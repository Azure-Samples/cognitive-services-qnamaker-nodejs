"use strict";
require('dotenv').config();

/* This sample does the following tasks.
 * - Create a knowledge base.
 * - Update a knowledge base.
 * - Publish a knowledge base.
 */

/* To run this sample, install the following modules.
 * npm install @azure/ms-rest-js
 * npm install @azure/cognitiveservices-qnamaker
 */
exports.__esModule = true;

// <dependencies>
var msRest = require("@azure/ms-rest-js");
var qnamaker = require("@azure/cognitiveservices-qnamaker");
// </dependencies>


// Get environment values.
// <resourcekeys>
var key_var = 'QNAMAKER_SUBSCRIPTION_KEY';
if (!process.env[key_var]) {
    throw new Error('please set/export the following environment variable: ' + key_var);
}
var subscription_key = process.env[key_var];

var host_var = 'QNAMAKER_HOST';
if (!process.env[host_var]) {
    throw new Error('please set/export the following environment variable: ' + host_var);
}
var host = process.env[host_var];
var endpoint = host;
// </resourcekeys>

// Create client.
/*
 * The QnAMakerClient constructor expects a parameter 'credentials' of type
 * msRest.ServiceClientCredentials.
 * msRest.ApiKeyCredentials implements ServiceClientCredentials.
 * The ApiKeyCredentials constructor expects a parameter 'options' of type
 * ApiKeyCredentialOptions.
 * ApiKeyCredentialOptions is an interface that defines two fields: inHeader and inQuery.
 * Each is just a set of name/value pairs.
 *
 * See:
 * QnAMakerClient
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/qnAMakerClient.ts#L17
 * ApiKeyCredentialOptions
 * https://github.com/Azure/ms-rest-js/blob/master/lib/credentials/apiKeyCredentials.ts#L8
 * ApiKeyCredentials
 * https://github.com/Azure/ms-rest-js/blob/master/lib/credentials/apiKeyCredentials.ts#L26
 */

 // <authorization>
var creds = new msRest.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': subscription_key } });
var client = new qnamaker.QnAMakerClient(creds, endpoint);

var kb = new qnamaker.Knowledgebase(client);
// </authorization>


// Helper functions.

/*
 * See:
 *
 * listAll
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/operations/knowledgebase.ts#L29
 * KnowledgebaseListAllResponse
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/index.ts#L699
 * KnowledgebasesDTO
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/mappers.ts#L778
 * KnowledgebaseDTO
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/mappers.ts#L704
 */
// <listkbs>
function list_kbs() {
    kb.listAll().then(function (result) {
        console.log("Existing knowledge bases:\n");
        for (var _i = 0, _a = result.knowledgebases; _i < _a.length; _i++) {
            var x = _a[_i];
            console.log(x.id);
        }
    })["catch"](function (error) {
        throw error;
    });
}
// </listkbs>


/*
 * See:
 *
 * deleteMethod
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/operations/knowledgebase.ts#L81
 */
// Delete the specified KB. You can use this method to delete excess KBs created with this quickstart.
// <deletekbs>
function delete_kb(kb_id) {
    kb.deleteMethod(kb_id).then(function () {
        console.log("KB " + kb_id + " deleted.");
    })["catch"](function (error) {
        throw error;
    });
}
// </deletekbs>

/*
 * See:
 *
 * create
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/operations/knowledgebase.ts#L201
 * KnowledgebaseCreateResponse
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/index.ts#L760
 * Operation
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/index.ts#L421
 * getDetails
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/operations/operations.ts#L29
 * OperationsGetDetailsResponse
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/index.ts#L798
 */
// <monitorOperation>
function wait_for_operation(operation_id) {
    return client.operations.getDetails(operation_id).then(function (result) {
        var state = result._response.parsedBody.operationState;
        if ("Running" === state || "NotStarted" === state) {
            console.log("Operation is not finished. Waiting 10 seconds...");
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(wait_for_operation(operation_id));
                }, 10000);
            });
        }
        else {
            console.log("Operation result: " + state);
            if ("Failed" === state) {
                console.log(result._response.parsedBody.errorResponse);
            }
            return result._response.parsedBody;
        }
    })["catch"](function (error) {
        throw error;
    });
}
// </monitorOperation>


// Main functions.


/*
    * See:
    * CreateKbDTO
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/mappers.ts#L473
    * QnADTO
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/mappers.ts#L363
    * MetadataDTO
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/mappers.ts#L331
    * FileDTO
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/mappers.ts#L423
    */
// <createkb>
function create_kb() {

    var answer = "You can use our REST APIs to manage your Knowledge Base. See here for details: https://westus.dev.cognitive.microsoft.com/docs/services/58994a073d9e04097c7ba6fe/operations/58994a073d9e041ad42d9baa";
    var source = "Custom Editorial";
    var questions = ["How do I programmatically update my Knowledge Base?"];
    var metadata = [{ Name: "category", Value: "api" }];
    var qna_list = [{ id: 0, answer: answer, Source: source, questions: questions, Metadata: metadata }];
    var create_kb_payload = {
        name: 'QnA Maker FAQ',
        qnaList: qna_list,
        urls: [],
        files: []
    };

    return kb.create(create_kb_payload).then(function (result) {
        console.log("Waiting for KB create operation to finish...");
        return wait_for_operation(result._response.parsedBody.operationId);
    })["catch"](function (error) {
        throw error;
    });
}
// </createkb>

/*
    * See:
    *
    * UpdateKbOperationDTO
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/index.ts#L107
    * UpdateKbOperationDTOAdd (simply extends CreateKbInputDTO)
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/index.ts#L35
    * CreateKbInputDTO
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/index.ts#L14
    * UpdateKbOperationDTODelete (simply extends DeleteKbContentsDTO)
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/index.ts#L64
    * DeleteKbContentsDTO
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/index.ts#L46
    * UpdateKbOperationDTOUpdate (simply extends UpdateKbContentsDTO)
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/index.ts#L97
    * UpdateKbContentsDTO
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/index.ts#L74
    * QnADTO
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/mappers.ts#L363
    * MetadataDTO
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/mappers.ts#L331
    * FileDTO
    * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/models/mappers.ts#L423
    */
// <updatekb>
function update_kb(kb_id) {

    // Add new Q&A lists, URLs, and files to the KB.
    var answer = "You can change the default message if you use the QnAMakerDialog. See this for details: https://docs.botframework.com/en-us/azure-bot-service/templates/qnamaker/#navtitle";
    var source = "Custom Editorial";
    var questions = ["How can I change the default message from QnA Maker?"];
    var metadata = [{ Name: "category", Value: "api" }];
    var qna_list = [{ id: 1, answer: answer, Source: source, questions: questions, Metadata: metadata }];
    var update_kb_add_payload = { qnaList: qna_list, urls: [], files: [] };
    // Update the KB name.
    var name = "New KB name";
    var update_kb_update_payload = { name: name };
    // Delete the QnaList with ID 0.
    var ids = [0];
    var update_kb_delete_payload = { ids: ids };
    // Bundle the add, update, and delete requests.
    var update_kb_payload = { add: update_kb_add_payload, update: update_kb_update_payload, deleteProperty: update_kb_delete_payload };

    kb.update(kb_id, update_kb_payload).then(function (result) {
        console.log("Waiting for KB update operation to finish...");
        wait_for_operation(result._response.parsedBody.operationId);
    })["catch"](function (error) {
        throw error;
    });
}
// </updatekb>

/*
 * See:
 * publish
 * https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/cognitiveservices/cognitiveservices-qnamaker/src/operations/knowledgebase.ts#L109
 */
// <publishkb>
function publish_kb(kb_id) {
    kb.publish(kb_id).then(function (result) {
        console.log("KB " + kb_id + " published.");
    })["catch"](function (error) {
        throw error;
    });
}
// </publishkb>

// 

async function quickstart() {
    console.log("Creating KB...");
    var result = await create_kb();
    var kb_id = result.resourceLocation.replace('/knowledgebases/', '') ;
    console.log();

    console.log("Updating KB...");
    update_kb(kb_id);
    console.log();

    console.log("Publishing KB...");
    publish_kb(kb_id);
    console.log();
}

try {
    quickstart();
}
catch (error) {
    console.log(error);
}
