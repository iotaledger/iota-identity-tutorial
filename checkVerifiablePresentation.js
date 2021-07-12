// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { VerifiablePresentation, Client, Config } = require("@iota/identity-wasm/node");
const { readFileSync } = require('fs');
const { CLIENT_CONFIG } = require('./config');

async function checkVerifiablePresentation(vpPath) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Read signed credential from file
    let signedVp = VerifiablePresentation.fromJSON(JSON.parse(readFileSync(vpPath)));
    
    //Check if the credential is verifiable
    const result = await client.checkPresentation(signedVp.toString());
    console.log(`Verifiable presentation verification result: ${result.verified}`);
}

exports.checkVerifiablePresentation = checkVerifiablePresentation;

let signedVpPath = './signedCredentials/offlineVerifiablePresentation.json';
checkVerifiablePresentation(signedVpPath);