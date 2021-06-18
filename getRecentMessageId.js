const { buildClient } = require('./buildClient.js');
const { getIndexFromDid } = require('./getIndexFromDid');

//Function takes a did and returns the most recent messageId associated to it, based on the field "updated" in the payload
async function getRecentMessageId(did) {

    const index = getIndexFromDid(did);

    const client = buildClient();
    const messages = await client.findMessages([index], []);
    //console.log(messages);

    //Reduce returned messages to messageId and updated timestamp only
    const messageTimestamps = messages.map(function (message) {

        const reformattetObject = {};
        reformattetObject['messageId'] = message.messageId;
        reformattetObject['updated'] = JSON.parse(Buffer.from(message.message.payload.data, 'hex').toString('utf8')).updated;

        return reformattetObject;
    });
    //console.log(messageTimestamps);

    //Find max timestamp in array of messageTimestamps
    const maxTimestamp = new Date(Math.max.apply(null, messageTimestamps.map(e => new Date(e.updated))));

    //Filter messageTimestamps for elements with matching maxTimestamp
    const filteredTimestamps = messageTimestamps.filter(e => (new Date(e.updated)).toString() === (new Date(maxTimestamp)).toString());
    //console.log(filteredTimestamps);

    if(filteredTimestamps.length > 1) {
        throw new Error(`There's more than one message with the max updated timestamp`)
    }
    else {
        return filteredTimestamps[0].messageId
    }

}

exports.getRecentMessageId = getRecentMessageId;

//getRecentMessageId(did).then(console.log);