const isMutant = require('./src/magneto-compiled').isMutant;
const { HUMAN_TYPE, MUTANT_TYPE, TABLE_NAME } = require('./src/constants');

const AWS = require('aws-sdk');
const dynamoDBClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const generateItem = (dnaSequence, type = MUTANT_TYPE) => {
  return {
    Item: {
      'adn-sequence': dnaSequence,
      type: type,
      count: 1
    },
    TableName: TABLE_NAME
  };
};

// Serverless function
module.exports.mutant = async (request, ctx) => {
  const { dna } = JSON.parse(request.body);
  const dnaToSave = dna.join('');
  const result = {};
  const query = { Key: { 'adn-sequence': dnaToSave }, TableName: TABLE_NAME };
  let itemToSave = {};

  if (isMutant(dna)) {
    itemToSave = generateItem(dnaToSave);
    result.statusCode = 200;
  } else {
    itemToSave = generateItem(dnaToSave, HUMAN_TYPE);
    result.statusCode = 403;
  }

  dynamoDBClient.get(query, (err, data) => {
    if (err) {
      console.error('Error query DNA', err);
    } else {
      if (Object.keys(data).length !== 0) {
        itemToSave.Item.count = data.Item.count + 1;
      }

      dynamoDBClient.put(itemToSave, (err, data) => {
        if (err) {
          console.error('DNA Saving Error!', err);
        } else {
          console.log('DNA Saved!', data);
        }
      });
    }
  });

  return result;
};
