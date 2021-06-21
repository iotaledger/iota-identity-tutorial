
const fs = require('fs');



//Logs relevant Did information
function storeToWeakhold(holder, doc, messageId, explorerUrl, authKey, verifKey = null) {
    let yourDid = {}

    yourDid['subject'] = holder;
    yourDid['did'] = JSON.parse(doc).id;
    yourDid['messageId'] = messageId;
    yourDid['explorerUrl'] = explorerUrl;
    yourDid.authKey = {};
    yourDid.authKey['auth_key_type'] = JSON.parse(authKey).type;
    yourDid.authKey['auth_public_key'] = JSON.parse(authKey).public;
    yourDid.authKey['auth_private_key'] = JSON.parse(authKey).secret;

    if (verifKey !== null) {
      yourDid.verifKey = {};
      yourDid.verifKey['verif_key_type'] = JSON.parse(verifKey).type;
      yourDid.verifKey['verif_public_key'] = JSON.parse(verifKey).public;
      yourDid.verifKey['verif_private_key'] = JSON.parse(verifKey).secret;
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

exports.storeToWeakhold = storeToWeakhold;