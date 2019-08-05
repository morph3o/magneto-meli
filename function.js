const isMutant = require('./src/magneto-compiled').isMutant;
const { HUMAN_TYPE, MUTANT_TYPE, DNA_TABLE_NAME, STATS_TABLE_NAME } = require('./src/constants');

const AWS = require('aws-sdk');
const dynamoDBClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const generateItem = (dnaSequence, type = MUTANT_TYPE) => {
  return {
    Item: {
      'adn-sequence': dnaSequence,
      type: type,
      count: 1
    },
    TableName: DNA_TABLE_NAME
  };
};

const updateStats = (newDNAItem) => {
  return new Promise((resolve, reject) => {
    const query = { Key: { id: 1 }, TableName: STATS_TABLE_NAME };
    dynamoDBClient.get(query, (err, data) => {
      if (err) {
        console.error('Get Stats Error!', err);
      } else {
        if (Object.keys(data).length === 0) {
          initStats()
            .then(stats => {
              console.log('Stats:', stats);
              const statsItem = {
                Item: {
                  ...stats
                },
                TableName: STATS_TABLE_NAME
              };

              if (newDNAItem.Item.type === MUTANT_TYPE) {
                statsItem.Item.count_mutant_dna += 1;
              } else {
                statsItem.Item.count_human_dna += 1;
              }

              statsItem.Item.ratio = (statsItem.count_mutant_dna / statsItem.count_human_dna).toFixed(2);

              dynamoDBClient.put(statsItem, (err, data) => {
                if (err) console.error('Saving stats error!', err);
                else {
                  console.log('Init stats saved successfully');
                  dynamoDBClient.get(query, (err, data) => {
                    if (err) {
                      console.error('Get Stats Error!', err);
                    } else {
                      resolve({ ...data });
                    }
                  });
                }
              });
            });
        } else {
          const statsItem = {
            Item: {
              ...data.Item
            },
            TableName: STATS_TABLE_NAME
          };

          if (newDNAItem.Item.type === MUTANT_TYPE) {
            statsItem.Item.count_mutant_dna += 1;
          } else {
            statsItem.Item.count_human_dna += 1;
          }

          statsItem.Item.ratio = (statsItem.Item.count_mutant_dna / statsItem.Item.count_human_dna).toFixed(2);

          dynamoDBClient.put(statsItem, (err, data) => {
            if (err) console.error('Saving stats error!', err);
            else console.log('Stats updated successfully');
          });
        }
      }
    });
  });
};

// Serverless function
module.exports.mutant = async (request, ctx) => {
  const { dna } = JSON.parse(request.body);
  const dnaToSave = dna.join('');
  const result = {};
  const query = { Key: { 'adn-sequence': dnaToSave }, TableName: DNA_TABLE_NAME };
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
          updateStats(itemToSave);
        }
      });
    }
  });

  return result;
};

/**
 * Function for initializing the stats table in case there is no data previously
 * */
const initStats = () => {
  return new Promise((resolve, reject) => {
    dynamoDBClient.scan({ TableName: DNA_TABLE_NAME }, (err, data) => {
      if (err) {
        console.error('Scan dna Error!', err);
      } else {
        const stats = data.Items.reduce((stats, item) => {
          if (item.type === HUMAN_TYPE) stats.count_human_dna += item.count;
          else stats.count_mutant_dna += item.count;
          return stats;
        }, {
          count_mutant_dna: 0,
          count_human_dna: 0
        });

        stats.ratio = (stats.count_mutant_dna / stats.count_human_dna).toFixed(2);

        const statsItem = {
          Item: {
            id: 1,
            ...stats
          },
          TableName: STATS_TABLE_NAME
        };

        dynamoDBClient.put(statsItem, (err, data) => {
          if (err) console.error('Saving stats error!', err);
          else console.log('Init stats saved successfully');
        });

        resolve({ ...stats });
      }
    });
  });
};

module.exports.stats = (request, ctx, callback) => {
  const query = { Key: { id: 1 }, TableName: STATS_TABLE_NAME };
  dynamoDBClient.get(query, (err, data) => {
    if (err) {
      console.error('Get Stats Error!', err);
    } else {
      if (Object.keys(data).length === 0) {
        initStats()
          .then(stats => {
            callback(null, {
              statusCode: 200,
              body: JSON.stringify(stats)
            });
          });
      } else {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({ ...data.Item })
        });
      }
    }
  });
};
