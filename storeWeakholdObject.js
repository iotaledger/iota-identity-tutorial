// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { writeFileSync } = require('fs');
const { getExplorerUrl } = require('./getExplorerUrl');
const { CLIENT_CONFIG } = require('./config');


//Logs relevant Did information
function storeWeakholdObject(holder, doc, messageId, authKey, verificationMethodName = null, verifKey = null) {
    let yourDid = {}

    yourDid['subject'] = holder;
    yourDid['did'] = JSON.parse(doc).id;
    yourDid['messageId'] = messageId;
    yourDid['explorerUrl'] = getExplorerUrl(CLIENT_CONFIG.network.toString(), messageId);
    yourDid.authKey = authKey;

    if (verifKey !== null) {
      yourDid.verifKey = verifKey;
      yourDid.verifKey.methodName = verificationMethodName;
    }

    //Write Did Information to weakhold
    let didPath = `./weakhold/${holder}.json`.replace(/\s/g, '');
    try {
        writeFileSync(didPath, JSON.stringify(yourDid, null, 4))
        console.log('\n',`The associated keys to proof ownership of ${holder}'s DID were stored/updated to this weakhold file: ${didPath}`)
        console.log(yourDid);
      } catch (err) {
        console.error(err)
      }
}

exports.storeWeakholdObject = storeWeakholdObject;