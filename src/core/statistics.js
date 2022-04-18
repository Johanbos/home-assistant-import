
class Statistics {
    constructor() {
       this.data = [];
       this.lastStatistic = null;
    }

    add(metadata_id, date, value) {
        var sum = this.lastStatistic ? value - this.lastStatistic.state : 0;
        const statistic = new Statistic(metadata_id, date, date, value, sum)
        this.data.push(statistic);
        this.lastStatistic = statistic;
    }
  
    getScript() {
        const deleteSql = `delete from statistics where created <= "${this.lastStatistic.created}"\n\n`;
        const updateSql = `update statistics set sum = sum + 0 where created > "${this.lastStatistic.created}"\n\n`;
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