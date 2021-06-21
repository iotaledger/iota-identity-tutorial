  
// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { Client, Config, VerifiableCredential, KeyPair, Document } = require("@iota/identity-wasm/node");
const fs = require('fs');
const { resolution } = require('./resolution');
const { CLIENT_CONFIG } = require('./config');
const { checkVc } = require('./check_vc');
const { getWeakholdObject } = require('./getWeakholdObject');

/*
    This example shows how to create a Verifiable Credential and validate it.
    In this example, alice takes the role of the subject, while we also have an issuer.
    The issuer signs a UniversityDegreeCredential type verifiable credential with Alice's name and DID.
    This Verifiable Credential can be verified by anyone, allowing Alice to take control of it and share it with whoever they please.
*/
async function createVC(issuerDid, issuerVerifKey) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Resolve existing DID document object and corresponding messageId
    let resolvedIssuerDid = await resolution(CLIENT_CONFIG, issuerDid);

    //Create DID document instance
    let issuerDoc = Document.fromJSON(resolvedIssuerDid.document);

    //Create credential indicating the degree earned by Alice
    let holder = getWeakholdObject('./weakhold/Alice.json')
    const credentialSubject = {
        "id": holder.did,
        "name": holder.subject,
        "degreeName": "Bachelor of Science and Arts",
        "degreeType": "BachelorDegree",
        "GPA": "4.0"
    }
    //console.log(credentialSubject)

    // Create an unsigned `UniversityDegree` credential for Alice
    const unsignedVc = VerifiableCredential.extend({
        id: "http://example.edu/credentials/3732",
        type: "UniversityDegreeCredential",
        issuer: issuerDid,
        credentialSubject,
    });
    //console.log(unsignedVc);

    //Sign the credential with the key pair from the Issuer's new verification method
    const methodName = "aliceDegreeVerification";

    const signedVc = issuerDoc.signCredential(unsignedVc, {
        method: issuerDid+"#"+methodName,
        public: issuerVerifKey.public,
        secret: issuerVerifKey.secret,
    });
    console.log(signedVc);

    //Write signedVC data to file
    let vcFilepath = './signedCredentials/signedVC.json'
    try {
        fs.writeFileSync(vcFilepath, signedVc.toString())
        //file written successfully
      } catch (err) {
        console.error(err)
      }

    //Check if the credential is verifiable
    checkVc(vcFilepath);

    return {signedVc};
}

exports.createVC = createVC;

//Issue and sign verifiable credential from weakhold object
let issuer = getWeakholdObject('./weakhold/UniversityofOslo.json')

createVC(issuer.did, KeyPair.fromJSON(issuer.verifKey));