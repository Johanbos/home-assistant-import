const Database = require('better-sqlite3');

class DomoticzDatabase {
    constructor(filePath) {
        this.filePath = filePath;
    }

    setupDatabase() {
        if (!this.filePath) {
            throw { message: 'No file path' };
        }

        if (!this.filePath.endsWith('.db')) {
            throw { message: 'Not ending with .db', filePath: this.filePath }
        }

        this.database = new Database(this.filePath, { verbose: console.log });
    }

    isMatch() {
        try {
            this.setupDatabase();
            const tablesSql = `SELECT name FROM sqlite_schema WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY 1`;
            const tables = this.database.prepare(tablesSql).all();
            const tablesNeeded = ['DeviceStatus', 'Hardware', 'Meter_Calendar'];
            if (!tablesNeeded.every((tableName) => { return tables.find((value) => { return value.name == tableName }) })) {
                throw { message: 'Could not find all Domoticz tables', tablesNeeded, tables };
            }
            return true;
        } catch (error) {
            this.error = error;
            return false;
        }
    }

    entities() {
        const entitiesSql =
            `select m.DeviceRowID EntityID, h.Name || ' ' || d.Name DeviceName, min(m.Date) StartDate, max(m.Date) EndDate, count(*) TotalValues, min(m.Counter) MinValues, max(m.Counter) MaxValues
   from Meter_Calendar m 
   left join DeviceStatus d on d.ID = m.DeviceRowID
   left join Hardware h on h.ID = d.HardwareID
   group by m.DeviceRowID
  
   union all
  
   select m.DeviceRowID, h.Name || ' ' || d.Name, min(m.Date), max(m.Date),count(*), min(m.Counter1), max(m.Counter1)
   from MultiMeter_Calendar m 
   left join DeviceStatus d on d.ID = m.DeviceRowID
   left join Hardware h on h.ID = d.HardwareID
   where m.Counter1 <> 0
   group by DeviceRowID
  
   union all
  
   select m.DeviceRowID, h.Name || ' ' || d.Name, min(m.Date), max(m.Date),count(*), min(m.Counter2), max(m.Counter2)
   from MultiMeter_Calendar m 
   left join DeviceStatus d on d.ID = m.DeviceRowID
   left join Hardware h on h.ID = d.HardwareID
   where m.Counter2 <> 0
   group by DeviceRowID
  
   union all
  
   select m.DeviceRowID, h.Name || ' ' || d.Name, min(m.Date), max(m.Date),count(*), min(m.Counter3), max(m.Counter3)
   from MultiMeter_Calendar m 
   left join DeviceStatus d on d.ID = m.DeviceRowID
   left join Hardware h on h.ID = d.HardwareID
   where m.Counter3 <> 0
   group by DeviceRowID
  
   union all
  
   select m.DeviceRowID, h.Name || ' ' || d.Name, min(m.Date), max(m.Date),count(*), min(m.Counter4), max(m.Counter4)
   from MultiMeter_Calendar m 
   left join DeviceStatus d on d.ID = m.DeviceRowID
   left join Hardware h on h.ID = d.HardwareID
   where m.Counter4 <> 0
   group by DeviceRowID
   `;
        const entities = this.database.prepare(entitiesSql).all();
        return entities;
    }
}

module.exports = DomoticzDatabase;