
class Statistics {
    constructor() {
       this.data = [];
       this.lastStatistic = null;
    }

    add(metadata_id, date, value) {
        var sum = 0; 
        if (this.lastStatistic) {
            if (this.lastStatistic.state > value) {
                throw { message: 'Added value cannot be smaller then previous value', previousValue: this.lastStatistic.state, value }
            }

            if (this.lastStatistic.start > date) {
                throw { message: 'Added date cannot be before previous date', previousDate: this.lastStatistic.start, date }
            }

            sum = this.lastStatistic.sum + (value - this.lastStatistic.state);
        }

        const statistic = new Statistic(metadata_id, date, date, value, sum);
        this.data.push(statistic);
        this.lastStatistic = statistic;
    }
  
    getScript() {
        const deleteSql = `delete from statistics where metadata_id = ${this.lastStatistic.metadata_id} and created <= "${this.lastStatistic.created}"\n\n`;
        const updateSql = `update statistics set sum = sum + ${this.lastStatistic.sum} where metadata_id = ${this.lastStatistic.metadata_id} and created > "${this.lastStatistic.created}"\n\n`;
        const insertSql = 'insert into statistics (created, start, state, sum, metadata_id) values\n';
        var resultSql = [];
        this.data.forEach(element => {
            resultSql.push(`("${element.created}", "${element.start}", ${element.state}, ${element.sum}, ${element.metadata_id})`);
        });
        return deleteSql + updateSql + insertSql + resultSql.join(',\n');
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