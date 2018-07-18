'use strict';

let fs = require ('fs');
let https = require ('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace this with a valid subscription key.
let subscriptionKey = 'ENTER KEY HERE';

// NOTE: Replace this with a valid knowledge base ID.
let kb = 'ENTER ID HERE';

// NOTE: Replace this with "test" or "prod".
let env = "test";

// Represents the various elements used to create HTTP request URIs
// for QnA Maker operations.
let host = 'westus.api.cognitive.microsoft.com';
let service = '/qnamaker/v4.0';
let method = `/knowledgebases/${kb}/${env}/qna/`;

// Formats and indents JSON for display.
let pretty_print = function (s) {
    return JSON.stringify(JSON.parse(s), null, 4);
}

// Calls 'callback' after we have the entire response.
let response_handler = function (callback, response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        // Calls the callback function with the status code, headers, and body of the response.
        callback({ status: response.statusCode, headers: response.headers, body: body });
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

// HTTP response handler calls 'callback' after we have the entire response.
let get_response_handler = function (callback) {
    // Return a function that takes an HTTP response, and is closed over the specified callback.
    // This function signature is required by https.request, hence the need for the closure.
    return function (response) {
        response_handler(callback, response);
    }
}

// Calls 'callback' after we have the entire GET request response.
let get = function (path, callback) {
    let request_params = {
        method: 'GET',
        hostname: host,
        path: path,
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
    };

    // Pass the callback function to the response handler.
    let req = https.request(request_params, get_response_handler(callback));
    req.end();
}

// Calls 'callback' after we have the response from the /knowledgebases GET method.
let get_qna = function (path, callback) {
    console.log('Calling ' + host + path + '.');
    // Send the GET request.
    get(path, function (response) {
        // Extract the data we want from the GET response and pass it to the callback function.
        callback({ operation: response.headers.location, response: response.body });
    });
}

var path = service + method;
// Sends the request to download the knowledge base, then prints response
get_qna(path, function (result) {
    console.log(pretty_print(result.response));
});

// Requires the 'enter' key to be pressed befor closing the console (Visual Studio)
require('readline')
    .createInterface(process.stdin, process.stdout)
    .question("Press [Enter] to exit...", function () {
        process.exit();
});