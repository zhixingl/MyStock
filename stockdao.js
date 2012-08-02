var azure=require('azure');
var uuid = require('node-uuid');
module.exports = StockDao;


function StockDao (client) {
    this.client = client;
};


StockDao.prototype = {

    getItems: function (tableName, callback) {
        var query = azure.TableQuery
            .select()
            .from(tableName);

        this.client.queryEntities(query, callback);
        
    },



    newItem: function (tableName, stock, callback) {
        stock.RowKey = uuid();
        stock.PartitionKey = 'partition1';

        this.client.insertEntity(tableName, stock,callback);
    }


};