// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { VerifiableCredential, VerifiablePresentation, KeyPair, Document } = require("@iota/identity-wasm/node");
const { resolveDid } = require('./resolveDid');
const { getWeakholdObject } = require('./getWeakholdObject');
const { readFileSync, writeFileSync } = require('fs');

/*
    This example shows how to create a Verifiable Presentation and validate it.
    A Verifiable Presentation is the format in which a (collection of) Verifiable Credential(s) gets shared.
    It is signed by the subject, to prove control over the Verifiable Credential with a nonce or timestamp.
*/
async function createVerifiablePresentation(holderSubject, holderDid, holderVerifKey, holderVerificationMethod, vcPath) {
    //Resolve existing DID document object and corresponding messageId
    let resolvedIssuerDid = await resolveDid(holderDid);

    //Create DID document instance
    let holderDoc = Document.fromJSON(resolvedIssuerDid.document);
    
    //Read signed credential from file
    let signedVc = VerifiableCredential.fromJSON(JSON.parse(readFileSync(vcPath)));

    // Create a Verifiable Presentation from the Credential - signed by Alice's key
    const unsignedVp = new VerifiablePresentation(holderDoc, signedVc.toJSON())
    //Log unsigned verifiable credential
    console.log('\n',`This is ${holderSubject}'s unsigned verifiable presentation, containing the verifiable credential previously created:`);
    console.log(unsignedVp);


    const signedVp = holderDoc.signPresentation(unsignedVp, {
        method: "#"+holderVerificationMethod,
        secret: holderVerifKey.secret,
    })
    //Log signed verifiable credential
    console.log('\n',`This is the verifiable presentation signed by ${holderSubject}, using the key pair of the previously created verification method '${holderVerificationMethod}':`);
    console.log(signedVp);

    //Write signed verifiable presentation to file in pretty-printed JSON format
    let vpFilepath = './signedCredentials/offlineVerifiablePresentation.json'
    try {
        writeFileSync(vpFilepath, JSON.stringify(signedVp, null, 4))
        } catch (err) {
        console.error(err)
        }

    return {signedVp};
}

exports.createVerifiablePresentation = createVerifiablePresentation;

//Issue and sign verifiable credential from weakhold object
let holder = getWeakholdObject('./weakhold/Alice.json')
let holderVerificationMethod = "aliceDegreePresentation";
let signedVcPath = './signedCredentials/offlineVerifiableCredential.json';

createVerifiablePresentation(
    holder.subject,
    holder.did,
    KeyPair.fromJSON(holder.verifKey),
    holderVerificationMethod,
    signedVcPath);