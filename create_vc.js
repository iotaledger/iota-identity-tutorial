  
// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { VerifiableCredential, checkCredential, KeyPair, Document } = require("@iota/identity-wasm/node");
const { resolution } = require('./resolution');
const { getRecentMessageId } = require('./getRecentMessageId');
const { logExplorerUrl } = require('./explorer_util');
const { CLIENT_CONFIG } = require('./config');

/*
    This example shows how to create a Verifiable Credential and validate it.
    In this example, alice takes the role of the subject, while we also have an issuer.
    The issuer signs a UniversityDegreeCredential type verifiable credential with Alice's name and DID.
    This Verifiable Credential can be verified by anyone, allowing Alice to take control of it and share it with whoever they please.
*/
async function createVC(subjectDid, issuerDid, issuerVerifKey) {
    //Resolve existing DID document object and corresponding messageId
    let resolvedIssuerDid = await resolution(CLIENT_CONFIG, issuerDid);

    //Create DID document instance
    let issuerDoc = Document.fromJSON(resolvedIssuerDid);

    // Prepare a credential subject indicating the degree earned by Alice
    let credentialSubject = {
        id: subjectDid,
        name: "Alice",
        degreeName: "Bachelor of Science and Arts",
        degreeType: "BachelorDegree",
        GPA: "4.0"
    };
    console.log(credentialSubject);

    // Create an unsigned `UniversityDegree` credential for Alice
    const unsignedVc = VerifiableCredential.extend({
        id: "http://example.edu/credentials/3732",
        type: "UniversityDegreeCredential",
        issuer: issuerDid,
        credentialSubject,
    });
    console.log(unsignedVc);

    //Sign the credential with the Issuer's newKey
    const signedVc = issuerDoc.signCredential(unsignedVc, {
        method: issuerDid+"#newKey",
        public: issuerVerifKey.public,
        secret: issuerVerifKey.secret,
    });
    console.log(signedVc);

    //Check if the credential is verifiable
    const result = await checkCredential(signedVc.toString(), CLIENT_CONFIG);
    console.log(`VC verification result: ${result.verified}`);

    return {signedVc};
}

exports.createVC = createVC;

subjectDid = 'did:iota:DgMnHixdGMVbu4BeBg2aLfDrvFGf5PxPyQpYkoy2sCbK';

issuerDid = 'did:iota:HaAxn94whEtc6EkoTvtbTLarNS2a5YBAhiy77sGL9r6d'
issuerVerifKey = KeyPair.fromBase58(1, 'CvkZ6kWeGhMubfxCe4PSjvk8EcvUjBtx82Fwvgx8uaBk', 'EJgEpms68rvBfnRMB4f6x1jugoTpegEZ6xxvsKvnETtr');

createVC(subjectDid, issuerDid, issuerVerifKey);