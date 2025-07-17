const { spawn } = require("child_process");

function runShellCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: true });

    let logs = [];
    let errorLogs = [];

    // Listen to stdout data
    child.stdout.on("data", (data) => {
      const chunk = data.toString();
      logs.push(chunk);
      console.log(`[stdout] ${chunk}`); // Optional: for live console logging
    });

    // Listen to stderr data
    child.stderr.on("data", (data) => {
      const chunk = data.toString();
      errorLogs.push(chunk);
      console.error(`[stderr] ${chunk}`); // Optional: for live error logging
    });

    // On process exit
    child.on("close", (code) => {
      resolve({ logs, errorLogs });
    });

    // On error launching the process
    child.on("error", (err) => {
      reject(err);
    });
  });
}

const shellService = {
  runShellCommand,
};

module.exports = { shellService };
