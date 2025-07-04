const { Client } = require("ssh2");

async function connectServer(data, callback) {
  const ssh = new Client();

  ssh
    .on("ready", () => {
      console.log("Client :: ready");

      ssh.shell((err, stream) => {
        if (err) throw err;

        stream.on("close", () => {
          console.log("Stream :: close");
          conn.end();
          rl.close();
        });

        stream.on("data", (data) => {
          process.stdout.write(data.toString());
        });

        stream.stderr.on("data", (data) => {
          process.stderr.write("STDERR: " + data);
        });

        callback(stream);
      });
    })
    .connect(data);
}

function runRemoteCommand(config, command) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    let stdout = "";
    let stderr = "";

    conn
      .on("ready", () => {
        conn.exec(command, (err, stream) => {
          if (err) return reject(err);

          stream
            .on("close", (code, signal) => {
              conn.end();
              if (code === 0) {
                resolve(stdout.trim());
              } else {
                reject(
                  new Error(
                    `Command failed with code ${code}: ${stderr.trim()}`
                  )
                );
              }
            })
            .on("data", (data) => {
              stdout += data;
            })
            .stderr.on("data", (data) => {
              stderr += data;
            });
        });
      })
      .on("error", (err) => reject(err))
      .connect(config);
  });
}

const sshService = {
  runRemoteCommand,
  connectServer,
};

module.exports = { sshService };
