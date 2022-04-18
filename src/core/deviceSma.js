const SyncParser = require('csv-parse/sync');
const fs = require('fs');
const Statistics = require('./statistics');

class deviceSma {
    constructor(filePath) {
        this.filePath = filePath;
    }

    parse() {
        if (!this.filePath) {
            throw { message: 'No file path' };
        }

        if (!this.filePath.endsWith('.csv')) {
            throw { message: 'Not ending with .csv', filePath: this.filePath }
        }
        this.rawData = fs.readFileSync(this.filePath, 'utf8')
        this.data = SyncParser.parse(this.rawData, {
            delimiter: ',',
            from_line: 10,
            columns: false,
        });
    }

    isMatch() {
        try {
            this.parse();
            const header = 'Version CSV3|Tool WebUI|Linebreaks CR/LF|Delimiter comma';
            if (!this.rawData.includes(header)) {
                throw { message: 'Missing header', header };
            }

            if (!this.data) {
                throw { message: 'Missing data' };
            }

            if (this.data.length == 0) {
                throw { message: 'No records in data' };
            }

            return true;
        } catch (error) {
            console.error(error);
            this.error = error;
            return false;
        }
    }

    entities() {
        const first = this.data[0];
        const last = this.data[this.data.length-1];
        console.log(first);
        console.log(last);
        const startDate = this.transformDate(first[0]);
        const endDate = this.transformDate(last[0]);
        const totalValues = this.data.length;
        const minValues = parseInt(first[1]);
        const maxValues = parseInt(last[1]);
        const entities = [{ EntityID: 1, DeviceName: 'SMA', StartDate: startDate, EndDate: endDate, TotalValues: totalValues, MinValues: minValues, MaxValues: maxValues }];
        return entities;
    }

    transformDate(dateStr) {
        const result = `${dateStr.substr(6, 4)}-${dateStr.substr(3, 2)}-${dateStr.substr(0, 2)}`;
        return result;
    }
}

module.exports = deviceSma;