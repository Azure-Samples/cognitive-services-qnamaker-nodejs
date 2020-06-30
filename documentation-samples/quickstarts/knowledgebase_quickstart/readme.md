# Create and update knowledge base

## To use this sample

1. Create QnA Maker resource in Azure portal.
1. Get resource's key and host.
1. Copy `.env.sample` into `.env`.
1. Edit values for your key and host.
1. Install dependencies.
1. Run sample.

# Install

```javascript
npm install
```

## Run

```javascript
npm start
```

## Sample output

```console
> knowledgebase_quickstart@1.0.0 start C:\Users\johndoe\repos\cognitive-services-qnamaker-nodejs\documentation-samples\quickstarts\knowledgebase_quickstart
> node knowledgebase_quickstart.js

Creating KB...
Waiting for KB create operation to finish...
Operation is not finished. Waiting 10 seconds...
Operation is not finished. Waiting 10 seconds...
Operation is not finished. Waiting 10 seconds...
Operation result: Succeeded

Updating KB...

Publishing KB...

Waiting for KB update operation to finish...
Operation is not finished. Waiting 10 seconds...
Operation is not finished. Waiting 10 seconds...
Operation result: Succeeded
KB <GUID-REMOVED> published.
PS C:\Users\johndoe\repos\cognitive-services-qnamaker-nodejs\documentation-samples\quickstarts\knowledgebase_quickstart>
```

