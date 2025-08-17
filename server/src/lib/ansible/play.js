const { spawn } = require("child_process");
const { ProcessAnsibleLogs } = require("./processAnsibleLogs");

function ansiblePlay(appData, inventoryPath, playbookPath) {
  const command = `export ANSIBLE_HOST_KEY_CHECKING=False && ansible-playbook -i ${inventoryPath} ${playbookPath} -vvv`;

  return new Promise((resolve, reject) => {
    const child = spawn(command, { shell: true });
    const ansibleLogs = new ProcessAnsibleLogs(appData);

    // Handle stdout
    child.stdout.on("data", (data) => {
      const lines = data.toString().split(/\r?\n/);
      ansibleLogs.processLines(lines);
    });

    // Handle stderr (error JSON or other stderr lines)
    child.stderr.on("data", (data) => {
      const chunk = data.toString();
      console.log(chunk);
      if (!chunk.includes("WARNING"))
        reject(new Error("Deploy pipeline execution failed : " + chunk));
    });

    child.on("close", () => {
      if (ansibleLogs.error) {
        reject({ message: ansibleLogs.error.msg || ansibleLogs.error });
      }
      resolve({ logs: ansibleLogs.logs });
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

module.exports = { ansiblePlay };
