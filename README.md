# Cognitive Services QnA Maker Samples in Node.js

These REST samples show you how to programmatically create, update, publish, and replace a QnA Maker knowledge base, amongst many other ways to interact with it. All samples are in Node.js. To view these same samples in other languages:

[cognitive-services-qnamaker-csharp](https://github.com/Azure-Samples/cognitive-services-qnamaker-csharp)

[cognitive-services-qnamaker-java](https://github.com/Azure-Samples/cognitive-services-qnamaker-java)

[cognitive-services-qnamaker-python](https://github.com/Azure-Samples/cognitive-services-qnamaker-python)

## Features

Included are the following samples:

* [Create knowledge base](documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.js). Create a brand new knowledge base with given FAQ URLs. You may supply your own.
* [Update knowledge base](documentation-samples/quickstarts/update-knowledge-base/update-knowledge-base.js). Update an existing knowledge base by changing its name.
* [Publish knowledge base](documentation-samples/quickstarts/publish-knowledge-base/publish-knowledge-base.js). Publish any existing knowledge base to the host your Azure account.
* [Replace knowledge base](replace-knowledge-base.js). Replace an entire existing knowledge base with a custom question/answer pair.
* [Download knowledge base](download-knowledge-base.js). Download the contents of your existing knowledge base in JSON.
* [Delete knowledge base](delete-knowledge-base.js). Delete an existing knowledge base that was previously published.

All REST samples revolve around what you can do with a knowledge base, which is made up of FAQs or product manuals where there is a question and an answer. QnA Maker gives you more control over how to answer questions by allowing you to train a chat bot to give answers in a variety of ways that feels more like natural, conversational exchanges.

<img src="https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/media/botFrameworkArch.png" width="700">

## Getting Started

### Prerequisites

For each sample, a subscription key is required from your Azure Portal account. 
* To create a new account/resource for QnA Maker, see [Create a Cognitive Services API account in the Azure portal](https://docs.microsoft.com/en-us/azure/cognitive-services/cognitive-services-apis-create-account). You may need to 'Search in Marketplace' for QnA Maker if you don't see it in the list given.  
* For existing accounts, the key can be found in your [Azure Portal](https://ms.portal.azure.com/) dashboard in your QnA Maker resource under Resource Management > Keys. 

With the exception of creating a new knowledge base, these samples will require your [QnA Maker account](https://www.qnamaker.ai/Home/MyServices) knowledge base ID. To find your knowledge base ID, go to [My knowledge bases](https://www.qnamaker.ai/Home/MyServices) and select `View Code` on the right. You'll see the http request and your knowledge base ID is in the topmost line: for example, `POST /knowledgebases/2700e6b9-91a1-41e9-a958-6d1a98735b10/...`. Use only the ID.

<img src="find-kb-id.png">

### Run the sample

1. Create a Node.js project in your favorite IDE or create one in Visual Studio 2017 by expanding Javascript in the new project popup and selecting Node.js, then Blank Node.js Console Application.

1. Copy/paste the sample you want to test in the app.js file.

1. Add your Azure subscription key for QnA Maker and add your knowledge base ID (if applicable) to the code at the top.

1. Run the sample.

1. Check your knowledge bases in [qnamaker.ai](https://www.qnamaker.ai/Home/MyServices) to see changes.

### Quickstart

* Quickstart: [Create a new knowledge base in Node.js](documentation-samples/quickstarts/create-knowledge-base/create-new-knowledge-base.js)
* Quickstart: [Update a knowledge base in Node.js](documentation-samples/quickstarts/update-knowledge-base/update-knowledge-base.js)
* Quickstart: [Publish a knowledge base in Node.js](documentation-samples/quickstarts/publish-knowledge-base/publish-knowledge-base.js)
* More quickstarts coming soon... in the meantime, refer to [Quickstart for Microsoft QnA Maker API with Node.js](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/quickstarts/nodejs) for all quickstarts in minimal format.

## References

* [QnA Maker V4.0](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
