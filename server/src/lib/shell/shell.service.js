const { spawn } = require("child_process");

function runShellCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: true });

    let output = "";
    let error = "";

    // Listen to stdout data
    child.stdout.on("data", (data) => {
      const chunk = data.toString();
      output += chunk;
      console.log(`[stdout] ${chunk}`); // Optional: for live console logging
    });

    // Listen to stderr data
    child.stderr.on("data", (data) => {
      const chunk = data.toString();
      error += chunk;
      console.error(`[stderr] ${chunk}`); // Optional: for live error logging
    });

    // On process exit
    child.on("close", (code) => {
      resolve({ output, error });
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
