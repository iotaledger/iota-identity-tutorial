
const fs = require('fs');
const { getExplorerUrl } = require('./getExplorerUrl');
const { CLIENT_CONFIG } = require('./config');


//Logs relevant Did information
function storeWeakholdObject(holder, doc, messageId, authKey, verifKey = null) {
    let yourDid = {}

    yourDid['subject'] = holder;
    yourDid['did'] = JSON.parse(doc).id;
    yourDid['messageId'] = messageId;
    yourDid['explorerUrl'] = getExplorerUrl(CLIENT_CONFIG.network.toString(), messageId);
    yourDid.authKey = {};
    yourDid.authKey['type'] = JSON.parse(authKey).type;
    yourDid.authKey['public'] = JSON.parse(authKey).public;
    yourDid.authKey['secret'] = JSON.parse(authKey).secret;

    if (verifKey !== null) {
      yourDid.verifKey = {};
      yourDid.verifKey['type'] = JSON.parse(verifKey).type;
      yourDid.verifKey['public'] = JSON.parse(verifKey).public;
      yourDid.verifKey['secret'] = JSON.parse(verifKey).secret;
    }

    //Write Did Information to weakhold
    let didPath = `./weakhold/${holder}.json`.replace(/\s/g, '');
    try {
        fs.writeFileSync(didPath, JSON.stringify(yourDid, null, 4))
        console.log(`Following information was successfully written to weakhold: ${didPath}`)
      } catch (err) {
        console.error(err)
      }


    console.log(yourDid);
}

exports.storeWeakholdObject = storeWeakholdObject;