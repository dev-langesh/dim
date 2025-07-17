const fs = require("fs").promises;
const path = require("path");
const { spawn } = require("child_process");
const { getIO } = require("../socket.io/initSocket");

async function generateInventoryContent(data, path) {
  const inventoryData = `
${data.appDetails.app_name} ansible_host=${data.ssh.host} ansible_port=${
    data.ssh.port || 22
  } ansible_user=${data.ssh.user} ${
    data.ssh.password
      ? "ansible_ssh_pass=" + data.ssh.password
      : data.ssh.private_key
      ? "ansible_ssh_private_key_file=" + data.ssh.private_key
      : ""
  }
`;

  await fs.writeFile(path, inventoryData.trim());

  return inventoryData;
}

async function generatePlaybookContent(data, playBookPath) {
  const vars = [];
  const skipKeys = [
    "uploads_path",
    "app_dir",
    "platform",
    "nginx",
    "env",
    "source_dir",
  ];
  const app_dir = data.app_dir || path.join("var", "www", data.app_name);

  const payload = { ...data };

  skipKeys.forEach((key) => delete payload[key]);

  vars.push(`app_dir: ${app_dir}`);
  vars.push(`source_dir: ${path.join(app_dir, data.source_dir || "./")}`);
  if (data.env) vars.push(`env_file: ${path.join(data.uploads_path, ".env")}`);

  for (const [key, value] of Object.entries(payload)) {
    vars.push(`${key}: ${value}`);
  }

  const roles = [
    data.git_repo ? "git_clone" : "copy_file",
    data.platform,
    data.nginx && "nginx",
    data.ssl && "ssl",
  ].filter(Boolean);

  const playbook = `
- name: Deploy ${data.app_name}
  hosts: all
  become: true

  vars:
${vars.map((v) => `    ${v}`).join("\n")}

  roles:
${roles.map((r) => `    - ${r}`).join("\n")}
`.trim();

  await fs.writeFile(playBookPath, playbook);
  return playbook;
}

async function extractErrorFromLog(log) {
  let error;

  const match = await log.match(/FAILED! => (\{.*?\})/s);

  if (match) {
    const jsonStr = match[1];
    try {
      error = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON:", e);
    }
  }
  return error;
}

function processAnsibleLine(line) {
  line = line.trim();

  const taskRegex = /^TASK \[(.+?)\]/;
  const statusRegex = /^(ok|changed|skipping): \[.+?\]/;
  const errorJsonRegex = /FAILED! => (.+)$/;

  if (
    line.startsWith("PLAY [") ||
    line.startsWith("TASK [Gathering Facts]") ||
    line === ""
  ) {
    return null;
  }

  const taskMatch = line.match(taskRegex);
  if (taskMatch) {
    return { type: "task", content: `TASK [${taskMatch[1]}]` };
  }

  const statusMatch = line.match(statusRegex);
  if (statusMatch) {
    const status = statusMatch[1];
    return { type: "status", content: `status: ${status}` };
  }

  const errorMatch = line.match(errorJsonRegex);
  if (errorMatch) {
    return { type: "error", content: errorMatch[1] }; // Already JSON, no formatting
  }

  return null;
}

function createAnsibleLogHandler(appId) {
  let currentTask = null;
  const io = getIO();

  return function handleLine(line) {
    const parsed = ansibleService.processAnsibleLine(line);
    if (!parsed) return;

    // If it's a task line, store it as current task
    if (parsed.type === "task") {
      currentTask = parsed;
      return;
    }

    // If it's a status line, and we have a current task
    if (parsed.type === "status" && currentTask) {
      const statusText = parsed.content.toLowerCase();

      if (statusText.includes("status: skipping")) {
        currentTask = null; // Discard skipped task
        return;
      }

      const output = `${currentTask.content}\n${parsed.content}`;
      console.log(output);
      io.emit(`app-logs-${appId}`, output);

      currentTask = null; // Clear after pairing
      return output;
    }

    // If it's an error line (fatal with JSON), emit it directly
    if (parsed.type === "error") {
      try {
        const json = JSON.parse(parsed.content);
        const errorOutput = JSON.stringify(json, null, 2);
        console.log(errorOutput);
        io.emit(`app-logs-${appId}`, errorOutput);
        return json;
      } catch (e) {
        // Non-JSON error fallback
        console.log(parsed.content);
        io.emit(`app-logs-${appId}`, parsed.content);
        return parsed.content;
      }
    }
  };
}

function play(appId, inventoryPath, playbookPath) {
  const command = `ansible-playbook -i ${inventoryPath} ${playbookPath}`;
  const handler = createAnsibleLogHandler(appId);

  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true });

    let logs = [];

    // Handle stdout
    child.stdout.on("data", (data) => {
      const lines = data.toString().split(/\r?\n/);

      lines.forEach((line) => {
        const processedLine = handler(line);
        if (processedLine) logs.push(processedLine);
      });
    });

    // Handle stderr (error JSON or other stderr lines)
    child.stderr.on("data", (data) => {
      const chunk = data.toString();
      console.log(chunk);
      if (!chunk.includes("WARNING"))
        reject(new Error("Deploy pipeline execution failed : " + chunk));
    });

    child.on("close", (code) => {
      console.log(logs);
      console.log("code", code);
      if (code !== 0) {
        resolve({ error: logs[logs.length - 1] });
      }
      resolve({ logs });
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

const ansibleService = {
  generateInventoryContent,
  generatePlaybookContent,
  extractErrorFromLog,
  processAnsibleLine,
  play,
};

module.exports = { ansibleService };
