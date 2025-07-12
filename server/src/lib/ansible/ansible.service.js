const fs = require("fs").promises;

async function generateInventoryContent(data, path) {
  const inventoryData = `
[${data.appName}]
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
  const playbookData = `
- name: Deploy ${data.appName}
  hosts: ${data.appName}
  become: true

  vars:
    app_name: ${data.appName}
    app_dir: ${data.appDir || "/var/www/" + data.appName}
    git_repo: ${data.repo}
    domain_name: ${data.domain}
    cert_email: ${data.certEmail || "your_email@example.com"}
    ssl_enabled: ${data.ssl}
    app_port: ${data.appPort}
    env_file: ${data.uploadsPath}/.env

  roles:
    ${data.repo ? "- git_clone" : "copy_file"}
    - ${data.platform}
    ${data.nginx ? "- nginx" : ""}
    ${data.ssl ? "- ssl" : ""}
    `;

  await fs.writeFile(path, playbookData.trim());

  return playbookData;
}

const ansibleService = {
  generateInventoryContent,
  generatePlaybookContent,
};

module.exports = { ansibleService };
