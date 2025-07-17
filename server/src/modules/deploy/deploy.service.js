const { sshService } = require("../../lib/ssh/ssh.service");
const fs = require("fs").promises;
const path = require("path");
const {
  supportedOperatingSystems,
  supportedDistributions,
} = require("./constants/constants");
const { shellService } = require("../../lib/shell/shell.service");
const { fsService } = require("../../lib/fs/fs.service");
const { config } = require("../../config/constants");
const { ansibleService } = require("../../lib/ansible/ansible.service");
const { uuid } = require("../../lib/uuid");
const { AppError } = require("../../utils/error");
const { DeployPipelineErrors } = require("../../errors/deployPipelineErrors");

async function checkOS(data) {
  try {
    const sshData = {
      ...data,
    };
    try {
      if (sshData.private_key) {
        sshData.private_key = await fs.readFile(sshData.private_key, "utf8");
      }
    } catch (error) {
      throw new AppError(DeployPipelineErrors.SSH_PRIVATE_KEY_NOT_FOUND);
    }

    const result = await sshService.runRemoteCommand(
      sshData,
      `uname -s && echo ::: && lsb_release -is`
    );

    if (!result) {
      throw new AppError(DeployPipelineErrors.SSH_COMMAND_FAILED);
    }

    const [os, distribution] = result
      .split(":::")
      .map((s) => s.trim().toLowerCase());

    if (!supportedOperatingSystems.includes(os)) {
      throw new AppError(DeployPipelineErrors.UNSUPPORTED_OS);
    }

    if (!supportedDistributions.includes(distribution)) {
      throw new AppError(DeployPipelineErrors.UNSUPPORTED_DISTRIBUTION);
    }

    return {
      os,
      distribution,
    };
  } catch (error) {
    if (
      error.message.includes("authentication") &&
      error.message.includes("failed")
    ) {
      throw new AppError(DeployPipelineErrors.SSH_AUTHENTICATION_FAILED);
    }
    throw new AppError(DeployPipelineErrors.SSH_CONNECTION_FAILED);
  }
}

async function deployApplication(data) {
  const appId = data.appDetails.app_id;
  const localAppPath = path.join(config.deployGroundPath, appId);
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
  await ansibleService.generatePlaybookContent(
    { ...data.appDetails, uploads_path: uploadsPath },
    playbookPath
  );

  // Create .env file in uploads directory
  await fs.writeFile(path.join(uploadsPath, ".env"), data.appDetails.env);

  const res = await shellService.runShellCommand(
    `ansible-playbook -i ${inventoryPath} ${playbookPath}`
  );

  const error = await ansibleService.extractErrorFromLog(
    res.logs[res.logs.length - 1]
  );

  if (error?.msg) {
    throw new Error(error.msg);
  }

  return res;
}

const deployService = {
  checkOS,
  deployApplication,
};

module.exports = {
  deployService,
};
