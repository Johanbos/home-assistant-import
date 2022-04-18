const DeviceDomotics = require('./deviceDomotics.js');
const DeviceSma = require('./deviceSma.js');

class matcher {
    constructor(filePath) {
        this.filePath = filePath;
    }

    match() {
        const deviceDomotics = new DeviceDomotics(this.filePath);
        if (deviceDomotics.isMatch()) {
            const entities = deviceDomotics.entities();
            return new MatcherResponse(this.filePath, 'Found Domoticz', deviceDomotics.error, entities);
        }

        const deviceSma = new DeviceSma(this.filePath);
        if (deviceSma.isMatch()) {
            const entities = deviceSma.entities();
            return new MatcherResponse(this.filePath, 'Found SMA CSV Export', deviceSma.error, entities);
        }
        const errors = { deviceSmaError: deviceSma.error, deviceDomoticsError: deviceDomotics.error };
        return new MatcherResponse(this.filePath, 'Unknown filetype', errors);
    }
}

class MatcherResponse {
    constructor(filePath, message, error, entities) {
        this.filePath = filePath;
        this.message = message;
        this.error = error;
        this.entities = entities;
    }
}

module.exports = matcher;