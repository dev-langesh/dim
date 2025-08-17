const fs = require("fs").promises;

async function generateInventory(data, path) {
  const inventoryData = `
${data.appDetails.app_name} ansible_host=${data.ssh.host} ansible_port=${
    data.ssh.port || 22
  } ansible_user=${data.ssh.user} ${
    data.ssh.password
      ? "ansible_ssh_pass=" + data.ssh.password
      : data.ssh.private_key
      ? "ansible_ssh_private_key_file=" + data.ssh.private_key
      : ""
  }
`;

  await fs.writeFile(path, inventoryData.trim());

  return inventoryData;
}

module.exports = { generateInventory };
