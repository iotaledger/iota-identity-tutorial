// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { Client, Config } = require('@iota/identity-wasm/node');
const { CLIENT_CONFIG } = require('./config');

/*
    A short example to show how to resolve a DID. This returns the latest DID Document.
    @param {{network: string, node: string}} clientConfig
*/
async function resolveDid(did) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    // Resolve a DID.
    resolvedDid = await client.resolve(did);
    
    return resolvedDid;
}

exports.resolveDid = resolveDid;

//resolveDid('did:iota:JCMSA2d7AuVXrxEXmeNw9vTnj8Xw2e5sFGzJwLensEvj').then(console.log);