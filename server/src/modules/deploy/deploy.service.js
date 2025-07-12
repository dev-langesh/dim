const { sshService } = require("../../lib/ssh/ssh.service");
const fs = require("fs").promises;
const path = require("path");
const {
  packageManagers,
  supportedOperatingSystems,
  supportedDistributions,
} = require("./constants/constants");
const { shellService } = require("../../lib/shell/shell.service");
const { v4: uuid } = require("uuid");
const { fsService } = require("../../lib/fs/fs.service");
const { config } = require("../../config/constants");
const { ansibleService } = require("../../lib/ansible/ansible.service");

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
  const localAppPath = path.join(
    config.deployGroundPath,
    data.appName + "-" + uuid()
  );
  const ansiblePath = config.ansiblePath;
  const inventoryPath = path.join(localAppPath, "inventory.ini");
  const playbookPath = path.join(localAppPath, "main.yml");
  const uploadsPath = path.join(localAppPath, "uploads");

  // Create necessary directories
  await fsService.createDirectoryIfNotExists(localAppPath);

  // Copy ansible files to the local app path
  await fsService.copy(ansiblePath + "/*", localAppPath);

  // Create uploads directory
  await fsService.createDirectoryIfNotExists(uploadsPath);

  // Generate inventory and playbook content
  await ansibleService.generateInventoryContent(data, inventoryPath);

  // Generate playbook content
  await ansibleService.generatePlaybookContent(data, playbookPath);

  // Create .env file in uploads directory
  await fs.writeFile(path.join(uploadsPath, ".env"), data.env);

  const res = await shellService.runShellCommand(
    `ansible-playbook -i ${inventoryPath} ${playbookPath}`
  );

  return res;
}

const deployService = {
  checkOS,
  deployApplication,
};

module.exports = {
  deployService,
};
