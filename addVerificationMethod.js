
// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { DID, Client, Config, KeyPair, KeyType, VerificationMethod, Service, Document } = require("@iota/identity-wasm/node");
const { resolveDid } = require('./resolveDid');
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
async function addVerificationMethod(subjectName, did, authKey, verificationMethodName) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Resolve existing DID document object and corresponding messageId
    let resolvedDid = await resolveDid(did);

    let messageId = resolvedDid.messageId

    //Set Did Document field "updated" to current timestamp as ISO 8601 string without milliseconds
    resolvedDid.document.updated = (new Date()).toISOString().split('.')[0]+"Z";

    //Create DID document instance
    let issuerDoc = Document.fromJSON(resolvedDid.document);

    //Create new key pair and new verification method
    const newKey = new KeyPair(KeyType.Ed25519);
    const method = VerificationMethod.fromDID(issuerDoc.id, newKey, verificationMethodName);

    //Remove method first, if method with this name already exists and create new method with newly created key pair
    issuerDoc.removeMethod(DID.parse(issuerDoc.id.toString()+"#"+verificationMethodName));
    issuerDoc.insertMethod(method, "VerificationMethod");

    //Add the messageId of the previous message in the chain.
    //This is REQUIRED in order for the messages to form a chain.
    //Skipping / forgetting this will render the publication useless.

    issuerDoc.previousMessageId = messageId;

    //Sign the DID Document with the appropriate key
    issuerDoc.sign(authKey);

    //Log updated DID document
    console.log('\n',`This is ${subjectName}'s updated DID document, with the new verification method '${verificationMethodName}'`);
    console.log(issuerDoc);

    //Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
    const nextMessageId = await client.publishDocument(issuerDoc.toJSON());

    //Store new DID keys to weakhold
    storeWeakholdObject(subjectName, issuerDoc, nextMessageId, authKey, newKey);

    return {};
}

exports.addVerificationMethod = addVerificationMethod;

//Add verification method to issuer DID
let issuer = getWeakholdObject('./weakhold/UniversityofOslo.json')
let issuerVerificationMethod = "aliceDegreeVerification";
addVerificationMethod(issuer.subject, issuer.did, KeyPair.fromJSON(issuer.authKey), issuerVerificationMethod);

//Add verification method to holder DID
let holder = getWeakholdObject('./weakhold/Alice.json')
let holderVerificationMethod = "aliceDegreePresentation";
addVerificationMethod(holder.subject, holder.did, KeyPair.fromJSON(holder.authKey), holderVerificationMethod);