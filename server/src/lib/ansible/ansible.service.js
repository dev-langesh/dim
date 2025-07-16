const fs = require("fs").promises;
const path = require("path");

async function generateInventoryContent(data, path) {
  const inventoryData = `
${data.appName} ansible_host=${data.ssh.host} ansible_port=${
    data.ssh.port || 22
  } ansible_user=${data.ssh.user} ${
    data.ssh.password
      ? "ansible_ssh_pass=" + data.ssh.password
      : data.ssh.privateKey
      ? "ansible_ssh_private_key_file=" + data.ssh.privateKey
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
  const app_dir = data.appDir || path.join("var", "www", data.appName);

  const payload = { ...data };

  skipKeys.forEach((key) => delete payload[key]);

  vars.push(`app_dir: ${app_dir}`);
  vars.push(`source_dir: ${path.join(app_dir, data.source_dir)}`);
  if(data.env) vars.push(`env_file: ${path.join(data.uploads_path, ".env")}`);

  for (const [key, value] of Object.entries(payload)) {
    vars.push(`${key}: ${value}`);
  }

  const roles = [
    data.gitRepo ? "git_clone" : "copy_file",
    data.platform,
    data.nginx && "nginx",
    data.ssl && "ssl",
  ].filter(Boolean);

  const playbook = `
- name: Deploy ${data.appName}
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

const ansibleService = {
  generateInventoryContent,
  generatePlaybookContent,
  extractErrorFromLog,
};

module.exports = { ansibleService };
