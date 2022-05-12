
class Statistics {
    constructor(options) {
       this.data = [];
       this.lastStatistic = null;
       this.options = options;
       this.validateDataOptions = ['validate', 'skip'];
    }

    add(metadata_id, date, value) {
        try {
            let sum = 0;
            
            if (this.lastStatistic) {
                // Validate
                if (this.validateDataOptions.includes(this.options.validateData)) {
                    if (this.lastStatistic.start > date) {
                        throw { 
                            message: 'Added date cannot be before previous date', 
                            date, value,
                            lastStatistic: this.lastStatistic
                        };
                    }
                }

                // If the new value is higher, add to sum
                if (this.lastStatistic.state < value) {
                    sum = this.lastStatistic.sum + (value - this.lastStatistic.state);
                } else {
                    sum = this.lastStatistic.sum;
                }
            }
            
            console.log(sum);
            const statistic = new Statistic(metadata_id, date, date, value, sum);
            this.data.push(statistic);
            this.lastStatistic = statistic;
        } catch (error) {
            console.error(error);
            if (this.options.validateData == 'validate') {
                throw error;
            }
        }
    }
  
    getScript(options) {
        try {
            if (!this.lastStatistic) {
                throw 'no data available'
            }
                    
            const metadata_id = this.lastStatistic.metadata_id;
            const start = this.lastStatistic.start;
            let sql = '';
            if (options.existingDataMode == 'update') {
                const updateSql1 = `update statistics set sum = sum + ${this.lastStatistic.sum.toFixed(3)} where metadata_id = ${metadata_id} and start > "${start}"\n\n`;
                const updateSql2 = `update statistics_short_term set sum = sum + ${this.lastStatistic.sum.toFixed(3)} where metadata_id = ${metadata_id} and start > "${start}"\n\n`;
                sql = sql + updateSql1 + updateSql2;
            }
            
            if (options.existingDataMode == 'delete') {
                const deleteSql1 = `delete from statistics where metadata_id = ${metadata_id}\n\n`;
                const deleteSql2 = `delete from statistics_short_term where metadata_id = ${metadata_id}\n\n`;
                sql = sql + deleteSql1 + deleteSql2;
            }

            const insertSql = 'insert into statistics (created, start, state, sum, metadata_id) values\n';
            var resultSql = [];
            this.data.forEach(element => {
                resultSql.push(`("${element.created}", "${element.start}", ${element.state.toFixed(3)}, ${element.sum.toFixed(3)}, ${element.metadata_id})`);
            });
            return sql + insertSql + resultSql.join(',\n');
        } catch (error) {
            return '-- error: ' + error;
        }
    }
}

class Statistic {
    constructor(metadata_id, created, start, state, sum) {
        this.metadata_id = metadata_id;
        this.created = created;
        this.start = start;
        this.state = state;
        this.sum = sum;
    }
}

module.exports = Statistics;