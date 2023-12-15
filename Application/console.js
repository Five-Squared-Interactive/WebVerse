class Console {
    constructor(textID)
    {
        this.console = document.getElementById(textID);
    }

    LogDebug(message) {
        if (this.console == null) {
            console.error("[Console->LogDebug] Could not find console element.");
            return;
        }

        this.console.innerText += "\n" + new Date(Date.now()).toLocaleString() + " [DEBUG]: " + message;
    }

    LogMessage(message) {
        if (this.console == null) {
            console.error("[Console->LogMessage] Could not find console element.");
            return;
        }

        this.console.innerText += "\n" + new Date(Date.now()).toLocaleString() + ": " + message;
    }

    LogWarning(message) {
        if (this.console == null) {
            console.error("[Console->LogWarning] Could not find console element.");
            return;
        }

        this.console.innerText += "\n" + new Date(Date.now()).toLocaleString() + " [WARN]: " + message;
    }

    LogError(message) {
        if (this.console == null) {
            console.error("[Console->LogError] Could not find console element.");
            return;
        }

        this.console.innerText += "\n" + new Date(Date.now()).toLocaleString() + " [ERROR]: " + message;
    }
}