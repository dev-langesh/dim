const { spawn } = require("child_process");
const { ansibleService } = require("../ansible/ansible.service");

function runShellCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: true });

    let logs = [];
    let errorLogs = [];

    let lineQueue = [];

    const handleLine = (line) => {
      const result = ansibleService.processAnsibleLine(line);
      console.log(result);
      if (!result) return;

      lineQueue.push(result);

      // If status or error follows task, format & flush
      if (lineQueue.length === 2 && lineQueue[0].type === "task") {
        const output = `${lineQueue[0].content}\n${lineQueue[1].content}`;
        logs.push(output);
        console.log(output);
        lineQueue = [];
      } else if (lineQueue.length > 2) {
        // flush if queue has irrelevant or unpaired items
        lineQueue.shift();
      }
    };

    // Handle stdout
    child.stdout.on("data", (data) => {
      const chunk = data.toString();
      const lines = chunk.split(/\r?\n/).filter(Boolean);
      lines.forEach(handleLine);
    });

    // Handle stderr (error JSON or other stderr lines)
    child.stderr.on("data", (data) => {
      const chunk = data.toString();
      const lines = chunk.split(/\r?\n/).filter(Boolean);
      lines.forEach(handleLine); // Some errors may come here
      errorLogs.push(chunk);
    });

    child.on("close", (code) => {
      resolve({ logs, errorLogs });
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

const shellService = {
  runShellCommand,
};

module.exports = { shellService };
