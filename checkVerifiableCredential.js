// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { VerifiableCredential, Client, Config } = require("@iota/identity-wasm/node");
const { readFileSync } = require('fs');
const { CLIENT_CONFIG } = require('./config');

async function checkVerifiableCredential(vcPath) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Read signed credential from file
    let signedVc = VerifiableCredential.fromJSON(JSON.parse(readFileSync(vcPath)));
    
    //Check if the credential is verifiable
    const result = await client.checkCredential(signedVc.toString(), CLIENT_CONFIG);
    console.log(`Verifiable credential verification result: ${result.verified}`);
}

exports.checkVerifiableCredential = checkVerifiableCredential;


let signedVcPath = './signedCredentials/offlineVerifiableCredential.json';
checkVerifiableCredential(signedVcPath);