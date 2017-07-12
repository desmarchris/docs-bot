function generateEntityArray(conversationResponse) {
  return new Promise(function(resolve,reject) {

    var entities = conversationResponse.entities
    var queryLanguage = 'enriched_text.keywords.text:';
    var entityQuery = '';

    for (var i = 0; i < entities.length; i++) {

        entityQuery = entityQuery.concat(queryLanguage + entities[i].value);

        if (i < (entities.length - 1)) {
          entityQuery = entityQuery.concat('|')
        }

    };
    resolve(entityQuery);
  });
}

module.exports = generateEntityArray;
