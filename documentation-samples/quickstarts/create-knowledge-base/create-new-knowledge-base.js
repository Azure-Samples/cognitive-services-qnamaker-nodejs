'use strict';

let fs = require('fs');
let https = require('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Components used to create HTTP request URIs for QnA Maker operations.
let host = 'westus.api.cognitive.microsoft.com';
let service = '/qnamaker/v4.0';
let method = '/knowledgebases/create';

// Build your path URL.
let path = service + method;

// Replace this with a valid subscription key.
let subscriptionKey = '<qna-maker-subscription-key>';

// Dictionary that holds the knowledge base.
// The data source includes a QnA pair with metadata, the URL for the
// QnA Maker FAQ article, and the URL for the Azure Bot Service FAQ article.
let kb_model = {
    "name": "QnA Maker FAQ",
    "qnaList": [
        {
            "id": 0,
            "answer": "You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa",
            "source": "Custom Editorial",
            "questions": [
                "How do I programmatically update my Knowledge Base?"
            ],
            "metadata": [
                {
                    "name": "category",
                    "value": "api"
                }
            ]
        }
    ],
    "urls": [
        "https://docs.microsoft.com/en-in/azure/cognitive-services/qnamaker/faqs",
        "https://docs.microsoft.com/en-us/bot-framework/resources-bot-framework-faq"
    ],
    "files": []
};


// Convert the JSON object to a string.
let content = JSON.stringify(kb_model);

// Formats and indents JSON for display.
let pretty_print = function (s) {
    return JSON.stringify(JSON.parse(s), null, 4);
};

// The 'callback' is called from the entire response.
let response_handler = function (callback, response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        // Call the 'callback' with the status code, headers, and body of the response.
        callback({ status: response.statusCode, headers: response.headers, body: body });
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

// Get an HTTP response handler that calls 'callback' from the entire response.
let get_response_handler = function (callback) {
    // Return a function that takes an HTTP response and is closed over the specified callback.
    // This function signature is required by https.request, hence the need for the closure.
    return function (response) {
        response_handler(callback, response);
    };
};

// Call 'callback' when we have the entire response from the POST request.
let post = function (path, content, callback) {
    let request_params = {
        method: 'POST',
        hostname: host,
        path: path,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': content.length,
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };

    // Pass the 'callback' function to the response handler.
    let req = https.request(request_params, get_response_handler(callback));
    req.write(content);
    req.end();
};

// Call 'callback' when we have the entire response from the GET request.
let get = function (path, callback) {
    let request_params = {
        method: 'GET',
        hostname: host,
        path: path,
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey
        }
    };

    // Pass the callback function to the response handler.
    let req = https.request(request_params, get_response_handler(callback));
    req.end();
};

// Call 'callback' when we have the response from the /knowledgebases/create POST method.
let create_kb = function (path, req, callback) {
    console.log('Calling ' + host + path + '.');
    // Send the POST request.
    post(path, req, function (response) {
        // Extract the data we want from the POST response and pass it to the callback function.
        callback({ operation: response.headers.location, response: response.body });
    });
};

// Call 'callback' when we have the response from the GET request to check the status.
let check_status = function (path, callback) {
    console.log('Calling ' + host + path + '.');
    // Send the GET request.
    get(path, function (response) {
        // Extract the data we want from the GET response and pass it to the callback function.
        callback({ wait: response.headers['retry-after'], response: response.body });
    });
};

create_kb(path, content, function (result) {
    // Formats and indents the JSON response from the /knowledgebases/create method for display.

    console.log(pretty_print(result.response));

    // Loop until the operation is complete.
    let loop = function () {

        // add operation ID to the path
        path = service + result.operation;

        // Check the status of the operation.
        check_status(path, function (status) {

            // Formats and indents the JSON for display.
            console.log(pretty_print(status.response));

            // Convert the status into an object and get the value of the 'operationState'.
            var state = (JSON.parse(status.response)).operationState;

            // If the operation isn't complete, wait and query again.
            if (state === 'Running' || state === 'NotStarted') {

                console.log('Waiting ' + status.wait + ' seconds...');
                setTimeout(loop, status.wait * 1000);
            }
        });
    };
    // Begin the loop.
    loop();
});