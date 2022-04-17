const SyncParser = require('csv-parse/sync');
const fs = require('fs');

class SmaCsvExport {
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

    }
}

module.exports = SmaCsvExport;