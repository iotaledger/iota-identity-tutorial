//Logs relevant Did information
function logDid(holder, doc, messageId, authKey, verifKey = null) {
    let yourDid = {}

    yourDid['subject'] = holder;
    yourDid['did'] = JSON.parse(doc).id;
    yourDid['messageId'] = messageId;
    yourDid[''] = '';
    yourDid['auth. key-type'] = JSON.parse(authKey).type;
    yourDid['auth. public key'] = JSON.parse(authKey).public;
    yourDid['auth. private key'] = JSON.parse(authKey).secret;

    if (verifKey !== null) {
        yourDid[''] = '';
        yourDid['verif. key-type'] = JSON.parse(verifKey).type;
        yourDid['verif. public key'] = JSON.parse(verifKey).public;
        yourDid['verif. private key'] = JSON.parse(verifKey).secret;
    }

    console.table(yourDid);
}

exports.logDid = logDid;