// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { DID, Client, Config, KeyPair, KeyType, VerificationMethod, Digest, KeyCollection, Document } = require("@iota/identity-wasm/node");
const { resolveDid } = require('./resolveDid');
const { CLIENT_CONFIG } = require('./config');
const { storeWeakholdObject } = require('./storeWeakholdObject');
const { getWeakholdObject } = require('./getWeakholdObject');


/*
    This example shows how to add a Verification Method to an existing DID Document.
    A verification method adds public keys, which can be used to digitally sign things as an identity.
    There is two ways to add keys to a verification mathod.
    The first one is the addition of a single key pair for signatures. The signature of a single key pair can be revoked by removing the whole verification method.
    The second one is the addition of a collection of merkle keys. The signature of one merkle key can be revoked without the need to delete the complete verification method and thus scales better for many signatures.

    An important detail to note is the previousMessageId. This is an important field as it links the new DID Document to the old DID Document, creating a chain.
    Without setting this value, the new DID Document won't get used during resolution of the DID!
*/
async function addVerificationMethod(subjectName, did, authKey, verificationMethodName, merkleKeys = false) {
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


    //Create single key pair or set of merkle keys depending on passed parameter "merkleKeys"
    let newKeys = {};
    let method = {};

    if (merkleKeys === false) {
        //Create new verification method with single key pair
        newKeys = new KeyPair(KeyType.Ed25519);
        method = VerificationMethod.fromDID(issuerDoc.id, newKeys, verificationMethodName);
    } else {
        //Create new verification method with merkle key collection of 8 keys (Must be a power of 2)
        newKeys = new KeyCollection(KeyType.Ed25519, 8);
        method = VerificationMethod.createMerkleKey(Digest.Sha256, issuerDoc.id, newKeys, verificationMethodName);
    }

    //Remove method if already exists, create new method
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
    storeWeakholdObject(subjectName, issuerDoc, nextMessageId, authKey, verificationMethodName, newKeys);

    return {};
}

exports.addVerificationMethod = addVerificationMethod;

//Add verification method with collection of merkle keys to issuer DID
//This enables the issuer to sign and revoke multiple documents without having to remove the verification method for each revocation
let issuer = getWeakholdObject('./weakhold/UniversityofOslo.json')
let issuerVerificationMethod = "degreeVerifications";

addVerificationMethod(
    subjectName = issuer.subject,
    did = issuer.did,
    authKey = KeyPair.fromJSON(issuer.authKey),
    verificationMethodName = issuerVerificationMethod,
    merkleKeys = true);

//Add verification method to holder DID
let holder = getWeakholdObject('./weakhold/Alice.json')
let holderVerificationMethod = "aliceDegreePresentation";

addVerificationMethod(
    subjectName = holder.subject,
    did = holder.did,
    authKey = KeyPair.fromJSON(holder.authKey),
    verificationMethodName = holderVerificationMethod,
    merkleKeys = false);