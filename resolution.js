// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { resolve } = require('@iota/identity-wasm/node');
const { CLIENT_CONFIG } = require('./config');

/*
    A short example to show how to resolve a DID. This returns the latest DID Document.
    @param {{network: string, node: string}} clientConfig
*/
async function resolution(clientConfig, did) {
    // Resolve a DID.
    resolvedDid = await resolve(did, clientConfig);
    //console.log(resolvedDid);
    
    return resolvedDid;
}

exports.resolution = resolution;

//resolution(CLIENT_CONFIG, 'did:iota:HaAxn94whEtc6EkoTvtbTLarNS2a5YBAhiy77sGL9r6d').then(console.log);