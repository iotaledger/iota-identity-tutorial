
// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { KeyPair, KeyType, publish, VerificationMethod, Service, Document } = require("@iota/identity-wasm/node");
const { resolution } = require('./resolution');
const { CLIENT_CONFIG } = require('./config');
const { logExplorerUrl } = require('./explorer_util');
const { getRecentMessageId } = require('./getRecentMessageId');
const { logDid } = require('./logDid');

/*
    This example shows how to add more to an existing DID Document.
    The two main things to add are Verification Methods and Services.
    A verification method adds public keys, which can be used to digitally sign things as an identity.
    The services provide metadata around the identity via URIs. These can be URLs, but can also emails or IOTA indices.
    An important detail to note is the previousMessageId. This is an important field as it links the new DID Document to the old DID Document, creating a chain.
    Without setting this value, the new DID Document won't get used during resolution of the DID!
*/
async function manipulateIdentity(holder, did, authKey) {
    //Resolve existing DID document object and corresponding messageId
    let resolvedDid = await resolution(CLIENT_CONFIG, did);
    let messageId = await getRecentMessageId(did)
    
    //Set Did Document field "updated" to current timestamp
    resolvedDid.updated = new Date();

    //Create DID document instance
    let doc = Document.fromJSON(resolvedDid);

    //Log results of resolved existing did
    logExplorerUrl("Existing Identity:", CLIENT_CONFIG.network.toString(), messageId);
    
    //Log Did information of resolved existing did
    logDid(holder, doc, messageId, authKey, null);

    //Add a new VerificationMethod with a new KeyPair
    const newKey = new KeyPair(KeyType.Ed25519);
    const method = VerificationMethod.fromDID(doc.id, newKey, "newKey");
    doc.insertMethod(method, "VerificationMethod");

    //Add a new ServiceEndpoint
    const serviceJSON = {
        "id":doc.id+"#linked-domain",
        "type": "LinkedDomains",
        "serviceEndpoint" : "https://iota.org"
    };
    doc.insertService(Service.fromJSON(serviceJSON));

    //Add the messageId of the previous message in the chain.
    //This is REQUIRED in order for the messages to form a chain.
    //Skipping / forgetting this will render the publication useless.

    doc.previousMessageId = messageId;

    //Sign the DID Document with the appropriate key
    doc.sign(authKey);

    //Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
    const nextMessageId = await publish(doc.toJSON(), CLIENT_CONFIG);

    //Log results of updated did
    logExplorerUrl("Updated Identity:", CLIENT_CONFIG.network.toString(), nextMessageId);
    
    //Log Did information of updated did
    logDid(holder, doc, nextMessageId, authKey, newKey);

    return {key, newKey, doc, nextMessageId};
}

exports.manipulateIdentity = manipulateIdentity;

let holder = 'University of Oslo'
let did = 'did:iota:HaAxn94whEtc6EkoTvtbTLarNS2a5YBAhiy77sGL9r6d';
let key = KeyPair.fromBase58(1, '6dFr6WF1NvbAyGU7Hz8MYAbnVJvuRmxw3U7C4g7KrNoj', '6QUCgFBjU6rATT59FMhyzUc6PBMNQf56k3EGY9fn4ag9');

manipulateIdentity(holder, did, key);