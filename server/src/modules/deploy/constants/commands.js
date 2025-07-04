const systemRequirements = {
  common: {
    ubuntu: [
      "sudo apt update -y",
      "sudo apt install nginx -y",
      "sudo systemctl enable nginx",
      "sudo systemctl start nginx",
      "sudo apt install git -y",
      "sudo apt install unzip -y",
    ],
    debian: [
      "sudo apt update -y",
      "sudo apt install nginx -y",
      "sudo systemctl enable nginx",
      "sudo systemctl start nginx",
      "sudo apt install git -y",
      "sudo apt install unzip -y",
    ],
    centos: [
      "sudo yum update -y",
      "sudo yum install nginx -y",
      "sudo systemctl enable nginx",
      "sudo systemctl start nginx",
      "sudo yum install git -y",
      "sudo yum install unzip -y",
    ],
  },
  nodejs: {
    ubuntu: [
      "sudo apt install npm -y",
      "sudo npm i -g n",
      "sudo n stable",
      "sudo npm i -g pm2",
    ],
    debian: [
      "sudo apt install npm -y",
      "sudo npm i -g n",
      "sudo n stable",
      "sudo npm i -g pm2",
    ],
    centos: [
      "sudo yum install npm -y",
      "sudo npm install -g n",
      "sudo n stable",
      "sudo npm install -g pm2",
    ],
  },
};

module.exports = {
  systemRequirements,
};
