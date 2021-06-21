
// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { DID, Client, Config, KeyPair, KeyType, VerificationMethod, Service, Document } = require("@iota/identity-wasm/node");
const { resolution } = require('./resolution');
const { CLIENT_CONFIG } = require('./config');
const { storeWeakholdObject } = require('./storeWeakholdObject');
const { getWeakholdObject } = require('./getWeakholdObject');


/*
    This example shows how to add more to an existing DID Document.
    The two main things to add are Verification Methods and Services.
    A verification method adds public keys, which can be used to digitally sign things as an identity.
    The services provide metadata around the identity via URIs. These can be URLs, but can also emails or IOTA indices.
    An important detail to note is the previousMessageId. This is an important field as it links the new DID Document to the old DID Document, creating a chain.
    Without setting this value, the new DID Document won't get used during resolution of the DID!
*/
async function manipulateIdentity(clientConfig, issuerSubject, issuerDid, issuerAuthKey) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(clientConfig.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Resolve existing DID document object and corresponding messageId
    let resolvedDid = await resolution(CLIENT_CONFIG, issuerDid);
    //console.log(resolvedDid.document.verificationMethod);
    let messageId = resolvedDid.messageId

    //Set Did Document field "updated" to current timestamp as ISO 8601 string without milliseconds
    resolvedDid.document.updated = (new Date()).toISOString().split('.')[0]+"Z";

    //Create DID document instance
    let doc = Document.fromJSON(resolvedDid.document);

    //Create new key pair and new verification method
    const newKey = new KeyPair(KeyType.Ed25519);
    const methodName = "aliceDegreeVerification";
    const method = VerificationMethod.fromDID(doc.id, newKey, methodName);

    //Remove method first if exists and create new method with newly created key pair
    doc.removeMethod(DID.parse(doc.id.toString()+"#"+methodName));
    doc.insertMethod(method, "VerificationMethod");

    //Add the messageId of the previous message in the chain.
    //This is REQUIRED in order for the messages to form a chain.
    //Skipping / forgetting this will render the publication useless.

    doc.previousMessageId = messageId;

    //Sign the DID Document with the appropriate key
    doc.sign(issuerAuthKey);
    console.log(doc);

    //Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
    const nextMessageId = await client.publishDocument(doc.toJSON());

    //Store new DID keys to weakhold
    storeWeakholdObject(issuerSubject, doc, nextMessageId, issuerAuthKey, newKey);

    return {issuerAuthKey, newKey, doc, nextMessageId};
}

exports.manipulateIdentity = manipulateIdentity;

//Manipulate identity from weakhold object
let issuer = getWeakholdObject('./weakhold/UniversityofOslo.json')
manipulateIdentity(CLIENT_CONFIG, issuer.subject, issuer.did, KeyPair.fromJSON(issuer.authKey));