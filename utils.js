const DynamoDB = require('aws-sdk/clients/dynamodb');
const dynamo = new DynamoDB.DocumentClient({ region: 'us-east-1' });

module.exports = {
  dynamoPut(params) {
    return new Promise((resolve, reject) => {
      dynamo.put(params, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  },

  dynamoGet(params) {
    return new Promise((resolve, reject) => {
      dynamo.get(params, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  },

  dynamoUpdate(params) {
    return new Promise((resolve, reject) => {
      dynamo.update(params, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  },

  dynamoScan(params) {
    return new Promise((resolve, reject) => {
      dynamo.scan(params, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  },

  dynamoQuery(params) {
    return new Promise((resolve, reject) => {
      dynamo.query(params, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });
  },
};
