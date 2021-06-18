const { ClientBuilder } = require('@iota/client');


function buildClient() {
    // client will connect to testnet by default
    const client = new ClientBuilder()
        .localPow(true)
        .network('mainnet')
        .node('https://mainnet.tanglebay.com')
        .build();

    return(client);
}

exports.buildClient = buildClient;