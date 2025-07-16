const fs = require("fs").promises;

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

async function generatePlaybookContent(data, path) {
  const vars = [];

  if (data.appName) vars.push(`app_name: ${data.appName}`);
  if (data.appDir || data.appName)
    vars.push(`app_dir: ${data.appDir || `/var/www/${data.appName}`}`);
  if (data.gitRepo) vars.push(`git_repo: ${data.gitRepo}`);
  if (data.gitBranch) vars.push(`git_branch: ${data.gitBranch}`);
  if (data.sourceCode) vars.push(`source_code: ${data.sourceCode}`);
  if (data.domain) vars.push(`domain_name: ${data.domain}`);
  if (data.certEmail) vars.push(`cert_email: ${data.certEmail}`);
  if (typeof data.ssl !== "undefined") vars.push(`ssl_enabled: ${data.ssl}`);
  if (data.appPort) vars.push(`app_port: ${data.appPort}`);
  if (data.uploadsPath) vars.push(`env_file: ${data.uploadsPath}/.env`);

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

  await fs.writeFile(path, playbook);
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
