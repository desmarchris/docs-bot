function sendToDiscovery(query) {
  return new Promise(function(resolve, reject) {
    var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

    var discovery = new DiscoveryV1({
      username: process.env.DISCOVERY_USERNAME,
      password: process.env.DISCOVERY_PASSWORD,
      version_date: '2017-06-25'
    });

    var environment_id = process.env.ENVIRONMENT_ID;
    var collection_id = process.env.COLLECTION_ID;

    discovery.query({
      environment_id: environment_id,
      collection_id: collection_id,
      query: 'text:' + query // only querying the text field
    }, function(error, data) {
        if (error) {
          reject(error);
        } else {
          // resolve([data.results[0].text, data.results[1].text, data.results[2].text]);
          resolve([data.results[0].title,data.results[0].text, data.results[0].url]);
        }
    });
  });
}

// sendToDiscovery('What is the shorthand for intents?');

module.exports = sendToDiscovery;
