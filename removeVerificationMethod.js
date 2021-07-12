// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { Client, Config, DID, KeyPair, Document } = require('@iota/identity-wasm/node');
const { resolveDid } = require('./resolveDid');
const { storeWeakholdObject } = require('./storeWeakholdObject');
const { getWeakholdObject } = require('./getWeakholdObject');
const { CLIENT_CONFIG } = require('./config');

/*
    This example shows how to revoke a verifiable credential.
    The Verifiable Credential is revoked by actually removing a verification method (public key) from the DID Document of the Issuer.
    As such, the Verifiable Credential can no longer be validated.
    This would invalidate every Verifiable Credential signed with the same public key, therefore the issuer would have to sign every VC with a different key.
    Have a look at the Merkle Key example on how to do that practically.
    Note that this example uses the "main" network, if you are writing code against the test network then most function
    calls will need to include information about the network, since this is not automatically inferred from the
    arguments in all cases currently.
    We recommend that you ALWAYS using a CLIENT_CONFIG parameter that you define when calling any functions that take a
    ClientConfig object. This will ensure that all the API calls use a consistent node and network.
    @param {{network: string, node: string}} clientConfig
*/
async function removeVerificationMethod(issuerSubject, issuerDid, issuerAuthKey, verificationMethodName ) {
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

    //Remove the public key that signed the VC - effectively revoking the VC as it will no longer be able to verify
    issuerDoc.removeMethod(DID.parse(issuerDoc.id.toString()+"#"+verificationMethodName ));
    issuerDoc.previousMessageId = messageId;
    issuerDoc.sign(issuerAuthKey);

    //Log updated DID document
    console.log('\n',`This is ${issuerSubject}'s updated DID document. Note that the verifaction method '${verificationMethodName }' was removed:`);
    console.log(issuerDoc);

    //Publish the Identity to the IOTA Network, this may take a few seconds to complete Proof-of-Work.
    const nextMessageId = await client.publishDocument(issuerDoc.toJSON());

    //Store new DID keys to weakhold
    storeWeakholdObject(issuerSubject, issuerDoc, nextMessageId, issuerAuthKey, null);
}

exports.removeVerificationMethod = removeVerificationMethod;

//Remove whole verification method and thus also the used key pair for signatures
let issuer = getWeakholdObject('./weakhold/UniversityofOslo.json');
let verificationMethodName  = "degreeVerifications";

removeVerificationMethod(
    issuer.subject,
    issuer.did,
    KeyPair.fromJSON(issuer.authKey),
    verificationMethodName );