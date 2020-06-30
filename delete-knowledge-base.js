'use strict';

let fs = require('fs');
let https = require('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace this with a valid subscription key.
let subscriptionKey = 'ADD KEY HERE';

// NOTE: Replace this with a valid knowledge base ID, the one you want to delete.
let kb = 'ADD KNOWLEDGE BASE ID HERE';

let host = 'westus.api.cognitive.microsoft.com';
let service = '/qnamaker/v4.0';
let method = '/knowledgebases/';

let pretty_print = function (s) {
    return JSON.stringify(JSON.parse(s), null, 4);
}

// callback is the function to call when we have the entire response.
let response_handler = function (callback, response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        // Call the callback function with the status code, headers, and body of the response.
        callback({ status: response.statusCode, headers: response.headers, body: body });
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

// Get an HTTP response handler that calls the specified callback function when we have the entire response.
let get_response_handler = function (callback) {
    // Return a function that takes an HTTP response, and is closed over the specified callback.
    // This function signature is required by https.request, hence the need for the closure.
    return function (response) {
        response_handler(callback, response);
    }
}

// callback is the function to call when we have the entire response from the DELETE request.
let http_delete = function (path, content, callback) {
    let request_params = {
        method: 'DELETE',
        hostname: host,
        path: path,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': content.length,
            'Ocp-Apim-Subscription-Key': subscriptionKey,
        }
    };

    // Pass the callback function to the response handler.
    let req = https.request(request_params, get_response_handler(callback));
    req.write(content);
    req.end();
}

// callback is the function to call when we have the response from the /knowledgebases DELETE method.
let delete_kb = function (path, req, callback) {
    console.log('Calling ' + host + path + '.');
    // Send the DELETE request.
    http_delete(path, req, function (response) {
        // Extract the data we want from the DELETE response and pass it to the callback function.
        if (response.status == '204') {
            let result = { 'result': 'Success' };
            callback(JSON.stringify(result));
        }
        else {
            callback(response.body);
        }
    });
}

var path = service + method + kb;
delete_kb(path, '', function (result) {
    console.log(pretty_print(result));
});

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Press enter', (answer) => {
    rl.close();
});