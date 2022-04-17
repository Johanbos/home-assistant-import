const DomoticzDatabase = require('./domoticzDatabase.js');

class FileAnalyser {
    constructor(filePath) {
        this.filePath = filePath;
    }

    analyze() {
        const domoticzDatabase = new DomoticzDatabase(this.filePath);
        if (domoticzDatabase.isMatch()) {
            const entities = domoticzDatabase.entities();
            return new FileAnalyserResponse(this.filePath, 'Found Domoticz', domoticzDatabase.error, entities);
        }

        return new FileAnalyserResponse(this.filePath, 'Unknown filetype', domoticzDatabase.error);
    }
}

class FileAnalyserResponse {
    constructor(filePath, message, error, entities) {
        this.filePath = filePath;
        this.message = message;
        this.error = error;
        this.entities = entities;
    }
}

module.exports = FileAnalyser;