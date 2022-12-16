const mongodb = require('mongodb');
const MongoCLient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

let database;

async function getDb() {
    const client = await MongoCLient.connect('mongodb://127.0.0.1:27017');
    database = client.db('library');
    if (!database) {
        console.log('database not connected');
    }

    return database;
}

module.exports = {
    getDb,
    ObjectId
}