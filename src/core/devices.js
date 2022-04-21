const DeviceDomotics = require('./deviceDomotics.js');
const DeviceSma = require('./deviceSma.js');

class Devices {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async createImport(metadata_id, entityId) {
        const deviceDomotics = new DeviceDomotics(this.filePath);
        if (await deviceDomotics.isMatch()) {
            const entities = await deviceDomotics.entities();
            const selectedEntityId = entityId ?? entities.at(0).EntityID;
            const script = await deviceDomotics.script(metadata_id, selectedEntityId);
            return new ImportResponse(this.filePath, 'Found Domoticz', deviceDomotics.error, entities, selectedEntityId, script);
        }

        const deviceSma = new DeviceSma(this.filePath);
        if (await deviceSma.isMatch()) {
            const entities = await deviceSma.entities();
            const selectedEntityId = entityId ?? entities.at(0).EntityID;
            const script = await deviceSma.script(metadata_id, selectedEntityId);
            return new ImportResponse(this.filePath, 'Found SMA CSV Export', deviceSma.error, entities, selectedEntityId, script);
        }
        const errors = { deviceSmaError: deviceSma.error, deviceDomoticsError: deviceDomotics.error };
        return new ImportResponse(this.filePath, 'Unknown filetype', errors);
    }
}

class ImportResponse {
    constructor(filePath, message, error, entities, entityId, script) {
        this.filePath = filePath;
        this.message = message;
        this.error = error;
        this.entities = entities;
        this.entityId = entityId;
        this.script = script;
    }
}

module.exports = Devices;