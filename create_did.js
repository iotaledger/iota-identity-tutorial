// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { Document, KeyType, Client, Config } = require("@iota/identity-wasm/node");
const { CLIENT_CONFIG } = require('./config');
const { storeWeakholdObject } = require('./storeWeakholdObject');

/*
    This example shows a basic introduction on how to create a basic DID Document and upload it to the Tangle.
    A ED25519 Keypair is generated, from which the public key is hashed, becoming the DID.
    The keypair becomes part of the DID Document in order to prove a link between the DID and the published DID Document.
    That same keypair should be used to sign the original DID Document.
*/
async function createIdentity(clientConfig, subjectName) {
    //Create a DID Document (an identity).
    const { doc, key } = new Document(KeyType.Ed25519, clientConfig.network.toString())

    //Sign the DID Document with the generated key
    doc.sign(key);

    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(clientConfig.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
    const messageId = await client.publishDocument(doc.toJSON());

    //Store Did information to Weakhold and log to console
    storeWeakholdObject(subjectName, doc, messageId, key, null);

    //Return the results
    return {key, doc, messageId};
}

exports.createIdentity = createIdentity;

createIdentity(CLIENT_CONFIG, 'Alice');
createIdentity(CLIENT_CONFIG, 'University of Oslo');