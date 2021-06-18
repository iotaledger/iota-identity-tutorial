const { publish, Document } = require("@iota/identity-wasm/node");
const { resolution } = require('./resolution');
const { CLIENT_CONFIG } = require('./config');
const { getKeyPair } = require("./getKeyPair");
const { logExplorerUrl } = require('./explorer_util');
const { getRecentMessageId } = require('./getRecentMessageId');

/*
    This example shows how to add more to an existing DID Document.
    The two main things to add are Verification Methods and Services.
    A verification method adds public keys, which can be used to digitally sign things as an identity.
    The services provide metadata around the identity via URIs. These can be URLs, but can also emails or IOTA indices.
    An important detail to note is the previousMessageId. This is an important field as it links the new DID Document to the old DID Document, creating a chain.
    Without setting this value, the new DID Document won't get used during resolution of the DID!
*/
async function removeVerificationMethod(did, key) {
    //Resolve existing DID document object and corresponding messageId
    let resolvedDid = await resolution(CLIENT_CONFIG, did);
    let messageId = await getRecentMessageId(did)

    //Log results of resolved existing did
    logExplorerUrl("Existing Identity:", CLIENT_CONFIG.network.toString(), messageId);
    
    //Set Did Document field "updated" to current timestamp
    resolvedDid.updated = new Date();

    //Create DID document instance
    let doc = Document.fromJSON(resolvedDid);

    //Remove method
    doc.removeMethod(doc.id);

    //Add the messageId of the previous message in the chain.
    //This is REQUIRED in order for the messages to form a chain.
    //Skipping / forgetting this will render the publication useless.

    doc.previousMessageId = messageId;

    //Sign the DID Document with the appropriate key
    doc.sign(key);

    //Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
    const nextMessageId = await publish(doc.toJSON(), CLIENT_CONFIG);

    //Log results of updated did
    logExplorerUrl("Updated Identity:", CLIENT_CONFIG.network.toString(), nextMessageId);

    return {key, newKey, doc, nextMessageId};
}

exports.removeVerificationMethod = removeVerificationMethod;

let did = 'did:iota:mHw9EjsyqHeow33kmmQhLaGCwB7PTXZcag4P8nqhDyr';
let key = getKeyPair('ed25519', 'HHaDy873Z74b2DahAXuPV3TyBLtRBtPMapfcsChjWcMg', 'DEXmBf2FCqq1rzj5pz6nQEeLGSjjcdxZbFt8GTumqULG');

removeVerificationMethod(did, key);