const fs = require("fs").promises;
const path = require("path");

async function createDirectoryIfNotExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

async function copy(src, dest) {
  const isGlob = src.endsWith("/*");
  const baseSrc = isGlob ? src.slice(0, -2) : src;
  const stat = await fs.stat(baseSrc);

  if (stat.isDirectory()) {
    if (isGlob) {
      // Copy contents of baseSrc into dest
      await fs.mkdir(dest, { recursive: true });
      const entries = await fs.readdir(baseSrc);
      for (const entry of entries) {
        const entrySrc = path.join(baseSrc, entry);
        const entryDest = path.join(dest, entry);
        await copy(entrySrc, entryDest);
      }
    } else {
      // Copy entire directory (including its name)
      await fs.mkdir(dest, { recursive: true });
      const entries = await fs.readdir(baseSrc);
      for (const entry of entries) {
        const entrySrc = path.join(baseSrc, entry);
        const entryDest = path.join(dest, entry);
        await copy(entrySrc, entryDest);
      }
    }
  } else {
    // Copy single file
    const parentDir = path.dirname(dest);
    await fs.mkdir(parentDir, { recursive: true });
    await fs.copyFile(baseSrc, dest);
  }
}

async function chmod(filePath, mode) {
  try {
    await fs.chmod(filePath, mode);
    console.log(`Changed permissions of ${filePath} to ${mode}`);
  } catch (error) {
    console.error(`Failed to change permissions of ${filePath}:`, error);
  }
}

const fsService = {
  createDirectoryIfNotExists,
  chmod,
  copy,
};

module.exports = { fsService };
