/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk

var sendToDiscovery = require('./discovery'); // Send to Discovery function
var sendEntities = require('./sendEntities'); // Discovery function to query on entities
var sendBoth = require('./sendBoth');

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Create the service wrapper
var conversation = new Conversation({
  // If unspecified here, the CONVERSATION_USERNAME and CONVERSATION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',
  // url: 'https://gateway.watsonplatform.net/conversation/api',
  version_date: Conversation.VERSION_DATE_2017_04_21
});

// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {},
  };

  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }
    var response = updateMessage(payload, data);
    response.then(function(response) {
      return res.json(response);
    })

  });
});

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */
function updateMessage(input, response) {
  return new Promise(function(resolve, reject) {
    var responseText = null;
    var responseTextEntity = null;
    var responseTextBoth = null;

    if (!response.output) {
      response.output = {};
    } else if (response.intents[0] === undefined) {
      resolve(response);
    } else if (response.intents[0].intent === 'discovery' || response.output.text == '') {

      responseText = sendToDiscovery(input.input.text);
      responseTextEntity = sendEntities(response);
      responseTextBoth = sendBoth(input.input.text, response);

      // Three responses are given in an array, but sent through as one message
      responseText.then(function(responseText) {
        response.output.text[0] = responseText;
        responseTextEntity.then(function(responseTextEntity) {
          console.log(responseTextEntity);
          response.output.text.push(responseTextEntity);
          responseTextBoth.then(function(responseTextBoth) {
            response.output.text.push(responseTextBoth);
            resolve(response);
          });
        });
      });
    } else {
      resolve(response);
    }
  });
}


module.exports = app;
