const fs = require("fs").promises;
const path = require("path");

async function generatePlaybook(data, playBookPath) {
  const vars = [];
  const skipKeys = [
    "uploads_path",
    "app_dir",
    "platform",
    "nginx",
    "source_dir",
    "env",
    "docker_volumes",
    "docker_networks",
    "start_script",
  ];
  const pythonLibraries = ["fastApi", "django", "flask"];
  const app_dir = data.app_dir || path.join("var", "www", data.app_name);
  const source_dir = path.join(app_dir, data.source_dir || "./");
  const platform = pythonLibraries.includes(data.platform)
    ? "python"
    : data.platform;
  let env = `env:\n`;
  let docker_volumes = `docker_volumes:\n`;
  let docker_networks = `docker_networks:\n`;
  const payload = { ...data };

  skipKeys.forEach((key) => delete payload[key]);

  vars.push(`app_dir: ${app_dir}`);
  vars.push(`source_dir: ${source_dir}`);

  if (data.env) vars.push(`env_file: ${path.join(data.uploads_path, ".env")}`);

  for (const [envKey, envValue] of Object.entries(data.env || {})) {
    if (envValue === undefined || envValue === null) {
      console.warn(`Skipping undefined env variable: ${envKey}`);
      continue;
    }
    env += `      ${envKey}: "${envValue}"\n`;
  }

  vars.push(env);

  if (data.docker_networks?.length) {
    data.docker_networks.forEach((net) => {
      docker_networks += `      - name: ${net}\n`;
    });
    vars.push(docker_networks);
  }

  if (data.docker_volumes?.length) {
    data.docker_volumes.forEach((vol) => {
      docker_volumes += `      - ${vol}\n`;
    });
    vars.push(docker_volumes);
  }

  if (data.start_script && data.platform === "nodejs") {
    vars.push(
      `start_script: ${data.start_script.replace(/npm run/g, "").trim()}`
    );
  }

  if (platform === "python") {
    let startScript = `start_script: "${source_dir}/env/bin/gunicorn ${data.python_start_script} --bind 0.0.0.0:${data.app_port}`;

    if (data.platform === "fastApi")
      startScript += ` -k uvicorn.workers.UvicornWorker"`;
    else startScript += `"`;

    vars.push(startScript);
  }

  for (const [key, value] of Object.entries(payload)) {
    vars.push(`${key}: ${value}`);
  }

  const roles = [
    "prepare",
    data.git_repo && "git_clone",
    data.source_code && "source_code",
    platform,
    data.nginx && "nginx",
    data.ssl && "ssl",
  ].filter(Boolean);

  const processedRoles = [];

  roles.forEach((role) => {
    processedRoles.push(role, `{role: end, label: end ${role}}`);
  });

  const playbook = `
- name: Deploy ${data.app_name}
  hosts: all
  become: true

  vars:
${vars.map((v) => `    ${v}`).join("\n")}

  roles:
${processedRoles.map((r) => `    - ${r}`).join("\n")}
`.trim();

  await fs.writeFile(playBookPath, playbook);
  return playbook;
}

module.exports = { generatePlaybook };
