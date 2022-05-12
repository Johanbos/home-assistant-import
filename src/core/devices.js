const DeviceDomotics = require('./deviceDomotics.js');
const DeviceSma = require('./deviceSma.js');

class Devices {
    constructor(filePath, options) {
        this.filePath = filePath;
        this.options = options;
    }

    async createImport(metadata_id, entityId) {
        entityId = entityId !== null && entityId !== '' ? entityId : null;
        try {
            
            const deviceDomotics = new DeviceDomotics(this.filePath);
            if (await deviceDomotics.isMatch()) {
                const entities = await deviceDomotics.entities();
                const selectedEntityId = entityId ?? entities.at(0).EntityID;
                const statistics = await deviceDomotics.getStatistics(metadata_id, selectedEntityId, this.options);
                const script = statistics.getScript(this.options);
                return new ImportResponse(this.filePath, 'Found Domoticz', deviceDomotics.error, entities, selectedEntityId, script);
            }
            
            const deviceSma = new DeviceSma(this.filePath);
            if (await deviceSma.isMatch()) {
                const entities = await deviceSma.entities();
                const selectedEntityId = entityId ?? entities.at(0).EntityID;
                const statistics = await deviceSma.getStatistics(metadata_id, selectedEntityId, this.options);
                const script = statistics.getScript(this.options);
                return new ImportResponse(this.filePath, 'Found SMA CSV Export', deviceSma.error, entities, selectedEntityId, script);
            }

            const errors = { deviceSmaError: deviceSma.error, deviceDomoticsError: deviceDomotics.error };
            return new ImportResponse(this.filePath, 'Unknown filetype', errors);
        } catch (error) {
            const errors = { error };
            return new ImportResponse(this.filePath, 'Error occured', errors);
        }
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