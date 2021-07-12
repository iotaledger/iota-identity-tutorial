// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { VerifiableCredential, KeyPair, Document, KeyCollection, Digest } = require("@iota/identity-wasm/node");
const { resolveDid } = require('./resolveDid');
const { getWeakholdObject } = require('./getWeakholdObject');
const { writeFileSync } = require('fs');

/*
    This example shows how to create a Verifiable Credential and validate it.
    In this example, alice takes the role of the subject, while we also have an issuer.
    The issuer signs a UniversityDegreeCredential type verifiable credential with Alice's name and DID.
    This Verifiable Credential can be verified by anyone, allowing Alice to take control of it and share it with whoever they please.
*/
async function createVerifiableCredential(issuerSubject, issuerDid, issuerVerifKey, issuerVerificationMethod,  holderDid, holderSubject) {
    //Resolve existing DID document object and corresponding messageId
    let resolvedIssuerDid = await resolveDid(issuerDid);

    //Create DID document instance
    let issuerDoc = Document.fromJSON(resolvedIssuerDid.document);

    //Create credential indicating the degree earned by Alice
    const credentialSubject = {
        "id": holderDid,
        "name": holderSubject,
        "degreeName": "Bachelor of Computer Science",
        "degreeType": "BachelorDegree",
        "GPA": "4.0"
    }
    //Log newly created credential document
    console.log('\n',`This is ${holderSubject}'s credential document indicating her degree, but this doesn't prove anything so far:`);
    console.log(credentialSubject)

    // Create an unsigned `UniversityDegree` credential for Alice
    const unsignedVc = VerifiableCredential.extend({
        id: "http://example.edu/credentials/3732",
        type: "UniversityDegreeCredential",
        issuer: issuerDid,
        credentialSubject,
    });
    //Log unsigned verifiable credential
    console.log('\n',`This is the unsigned verifiable credential, containing the credential document:`);
    console.log(unsignedVc);

    //Sign the credential with the first key in the Merkle key collection of the Issuer's new verification method
    const signedVc = issuerDoc.signCredential(unsignedVc, {
        method: issuerDid+"#"+issuerVerificationMethod,
        public: issuerVerifKey.public(0),
        secret: issuerVerifKey.secret(0),
        proof: issuerVerifKey.merkleProof(Digest.Sha256, 0)
    });
    //Log signed verifiable credential
    console.log('\n',`This is the verifiable credential signed by ${issuerSubject}, using the key pair of the previously created verification method '${issuerVerificationMethod}':`);
    console.log(signedVc);

    //Write signed verifiable credential to file in pretty-printed JSON format
    let vcFilepath = './signedCredentials/offlineVerifiableCredential.json'
    try {
        writeFileSync(vcFilepath, JSON.stringify(signedVc, null, 4))
      } catch (err) {
        console.error(err)
      }

    return {signedVc};
}

exports.createVerifiableCredential = createVerifiableCredential;

//Issue and sign verifiable credential from weakhold object
let issuer = getWeakholdObject('./weakhold/UniversityofOslo.json')
let issuerVerificationMethod = "degreeVerifications";
let holder = getWeakholdObject('./weakhold/Alice.json')

createVerifiableCredential(
    issuer.subject,
    issuer.did,
    KeyCollection.fromJSON(issuer.verifKey),
    issuerVerificationMethod,
    holder.did,
    holder.subject);