
const { VerifiableCredential, Client, Config } = require("@iota/identity-wasm/node");
const fs = require('fs');
const { CLIENT_CONFIG } = require('./config');

async function checkVc(vcPath) {
    // Create a default client configuration from the parent config network.
    const config = Config.fromNetwork(CLIENT_CONFIG.network);

    // Create a client instance to publish messages to the Tangle.
    const client = Client.fromConfig(config);

    //Read signed credential from file
    let signedVc = VerifiableCredential.fromJSON(JSON.parse(fs.readFileSync(vcPath)));
    //console.log(signedVc);
    
    //Check if the credential is verifiable
    const result = await client.checkCredential(signedVc.toString(), CLIENT_CONFIG);
    console.log(`VC verification result: ${result.verified}`);
}

exports.checkVc = checkVc;

//checkVc('./signedCredentials/signedVC.json');