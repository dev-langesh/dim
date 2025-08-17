const { getIO } = require("../socket.io/initSocket");

class ProcessAnsibleLogs {
  #io;
  #appData;
  #prevTask;
  logs = [];

  constructor(appData) {
    this.#io = getIO();
    this.#appData = appData;
  }

  #removeSSHLogs(lines) {
    if (!lines[0]?.startsWith(`<${this.#appData.host}>`)) return lines;

    const processedLines = [...lines];
    let deleteCount = 0;

    for (const line of lines) {
      if (line.startsWith(`<${this.#appData.host}>`) || line.startsWith("Escalation succeeded")) deleteCount++;
      else break;
    }

    processedLines.splice(0, deleteCount);

    return processedLines;
  }

  #storeAndEmitLog(task, status, endTask) {
    const currentTask = this.#prevTask;
    this.#prevTask = task;

    if (!currentTask && !endTask) return;

    this.#io.emit(`app-logs-${this.#appData.appId}`, `${currentTask || ""}\n${status}`);

    this.logs.push(`${currentTask || ""}\n${status}`);
  }

  processLines(lines) {
    let processedLines;
    const len = lines.length;
    const task = lines[len - 3];
    const endPlay = lines[len - 4].startsWith("PLAY RECAP");
    let status;

    if (
      (!task?.startsWith("TASK [") ||
        task?.startsWith("TASK [Gathering Facts]")) &&
      !endPlay
    )
      return;

    processedLines = this.#removeSSHLogs(lines);

    status = endPlay
      ? processedLines.join("\n")
      : processedLines.splice(0, len - 4).join("\n");

    if (endPlay) {
      this.#storeAndEmitLog("", status, true);
    }

    if (status.startsWith("skipping:") || status.startsWith("redirecting")) {
      this.#prevTask = task;
    } else {
      this.#storeAndEmitLog(task, status);
    }
  }
}

module.exports = { ProcessAnsibleLogs };
