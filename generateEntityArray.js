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

// response = {
//   intents: [ { intent: 'entity', confidence: 0.8285990357398987 } ],
//   entities:
//    [ { entity: 'intent',
//        location: [Object],
//        value: 'what is',
//        confidence: 1 },
//      { entity: 'overview',
//        location: [Object],
//        value: 'entities',
//        confidence: 1 },
//      { entity: 'overview',
//        location: [Object],
//        value: 'intents',
//        confidence: 1 } ],
//   input: { text: 'what is an entity' },
//   output: { text: [], nodes_visited: [ 'Entities' ], log_messages: [] },
//   context:
//    { conversation_id: 'b54ddfc1-16a3-4c50-951d-027639e6357e',
//      system:
//       { dialog_stack: [Object],
//         dialog_turn_counter: 3,
//         dialog_request_counter: 3,
//         _node_output_map: [Object],
//         branch_exited: true,
//         branch_exited_reason: 'completed' }
//    }
// };
//
// var res = generateEntityArray(response);
// res.then(function(res) {
//   console.log(res);
// });


module.exports = generateEntityArray;
