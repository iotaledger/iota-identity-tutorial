// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { Client, Config, DID, KeyPair, Document, KeyCollection } = require('@iota/identity-wasm/node');
const { resolveDid } = require('./resolveDid');
const { storeWeakholdObject } = require('./storeWeakholdObject');
const { getWeakholdObject } = require('./getWeakholdObject');
const { CLIENT_CONFIG } = require('./config');

/*
    This example shows how to revoke verifiable credentials on scale.
    Instead of revoking the entire verification method, a single key can be revoked from a MerkleKeyCollection.
    This MerkleKeyCollection can be created as a collection of a power of 2 amount of keys.
    Every key should be used once by the issuer for signing a verifiable credential.
    When the verifiable credential must be revoked, the issuer revokes the index of the revoked key.
*/

async function removeMerkleKey(issuerSubject, issuerDid, issuerAuthKey, verificationMethodName, issuerVerifKeys) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Resolve existing DID document object and corresponding messageId
    let resolvedIssuerDid = await resolveDid(issuerDid);
    let messageId = resolvedIssuerDid.messageId

    //Set Did Document field "updated" to current timestamp as ISO 8601 string without milliseconds
    resolvedIssuerDid.document.updated = (new Date()).toISOString().split('.')[0]+"Z";

    //Create DID document instance
    let issuerDoc = Document.fromJSON(resolvedIssuerDid.document);
    console.log(issuerDoc);

    //Remove the public key that signed the VC - effectively revoking the VC as it will no longer be able to verify
    issuerDoc.revokeMerkleKey(verificationMethodName, 0);
    issuerDoc.previousMessageId = messageId;
    issuerDoc.sign(issuerAuthKey);

    //Log updated DID document
    console.log('\n',`This is ${issuerSubject}'s updated DID document.`);
    console.log(issuerDoc);

    //Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
    const nextMessageId = await client.publishDocument(issuerDoc.toJSON());

    //Store new DID keys to weakhold
    storeWeakholdObject(issuerSubject, issuerDoc, nextMessageId, issuerAuthKey, verificationMethodName, issuerVerifKeys);
}

exports.removeMerkleKey = removeMerkleKey;

//Revoke signatures, which used the first key in the Merkle key collection
let issuer = getWeakholdObject('./weakhold/UniversityofOslo.json');
let verificationMethodName  = "degreeVerifications";

removeMerkleKey(
    issuer.subject,
    issuer.did,
    KeyPair.fromJSON(issuer.authKey),
    verificationMethodName,
    KeyCollection.fromJSON(issuer.verifKey));