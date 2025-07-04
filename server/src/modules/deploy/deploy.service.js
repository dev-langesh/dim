const { sshService } = require("../../lib/ssh/ssh.service");
const { Client } = require("ssh2");
const fs = require("fs").promises;
const path = require("path");
const {
  packageManagers,
  supportedOperatingSystems,
  supportedDistributions,
} = require("./constants/constants");
const { systemRequirements } = require("./constants/commands");

async function checkOS(data) {
  const result = await sshService.runRemoteCommand(
    data,
    `uname -s && echo ::: && lsb_release -is`
  );

  if (!result) {
    throw new Error("Failed to retrieve OS and distribution information");
  }

  const [os, distribution] = result
    .split(":::")
    .map((s) => s.trim().toLowerCase());

  if (!supportedOperatingSystems.includes(os)) {
    throw new Error(`Unsupported operating system: ${os}`);
  }

  if (!supportedDistributions.includes(distribution)) {
    throw new Error(`Unsupported distribution: ${distribution}`);
  }

  return {
    os,
    distribution,
    packageManager: packageManagers[distribution],
  };
}

async function deployApplication(data) {
  const conn = new Client();

  function runCommand(command, init = false) {
    const cmd = init ? command : `cd /dim && ${command}`;

    let output = "";
    console.log(`Running command: ${command}`);
    return new Promise((resolve, reject) => {
      conn.exec(`${cmd}`, (error, stream) => {
        if (error) {
          console.log("error: ", error);

          reject({ error });
        } else {
          stream.on("close", () => {
            console.log(`${command} :: completed`);
            resolve(output);
          });
          stream.on("data", (data) => {
            console.log("STDOUT: " + data);
            output += data.toString();
          });
          stream.stderr.on("data", (data) => {
            console.error("STDERR: " + data);
          });
        }
      });
    });
  }

  return new Promise((resolve, reject) => {
    conn
      .on("ready", async () => {
        console.log("Client :: ready");

        // stream.on("close", () => {
        //   console.log(command + " :: completed");
        //   ssh.end();
        //   resolve("Deployment completed successfully");
        // });

        // default port for app
        data.port = 8888;

        try {
          // Create working directory if it doesn't exist
          const workingDir = "/dim";
          await runCommand(`mkdir -p ${workingDir}`, true);

          // Install system requirements
          // await runCommand(systemRequirements.common[data.os].join(" && "));

          if (data.repo) {
            // Check if directory exists
            const dirCheckOutput = await runCommand(
              `[ -d "${data.appName}" ] && echo "exists" || echo ""`
            );

            console.log("Directory check output:", dirCheckOutput);

            if (dirCheckOutput.trim().includes("exists")) {
              const random = Math.floor(Math.random() * 100);
              data.appName = `${data.appName}-${random}`;
            }

            // Clone the repo to the (possibly modified) directory name
            await runCommand(`git clone ${data.repo} ${data.appName}`);
          }

          if (data.platform === "nodejs") {
            // await runCommand(systemRequirements.nodejs[data.os].join(" && "));

            // Install project dependencies
            await runCommand(`cd ${data.appName} && npm install`);

            // Attach ENV
            await runCommand(`echo ${data.env} > ${data.appName}/.env`);

            // Start the Node.js application
            await runCommand(
              `cd ${data.appName} && pm2 start npm --name ${data.appName} -- start `
            );

            await runCommand(`pm2 save`);

            await runCommand("pm2 logs");
          }

          if (data.nginx) {
            let nginxConfigData = await fs.readFile(
              path.join(__dirname, "constants", "nginx.conf"),
              "utf8"
            );
            nginxConfigData = nginxConfigData.replace(/<PORT>/g, data.port);

            nginxConfigData = nginxConfigData.replace(/<DOMAIN>/g, data.domain);

            const nginxConfigPath = `/etc/nginx/sites-available/${data.domain}`;
            await runCommand(
              `echo "${nginxConfigData}" | sudo tee ${nginxConfigPath} > /dev/null\n`
            );
            await runCommand(
              `sudo ln -s ${nginxConfigPath} /etc/nginx/sites-enabled/\n`
            );
          }

          console.log(
            "Deployment completed successfully",
            "Path:",
            data.appName
          );
        } catch (error) {
          console.error("Error during deployment:", error);
          reject(error);
        }
      })
      .connect(data)
      .on("error", (err) => reject(err));
  });
}

const deployService = {
  checkOS,
  deployApplication,
};

module.exports = {
  deployService,
};
