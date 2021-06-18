//Receives IOTA did and returns index
function getIndexFromDid(did) {
    if (did.substring(0, 9) !== 'did:iota:') {
        throw new Error(`A valid IOTA did starts with the characters "did:iota:"`)
    }
    else {
        return did.split(':')[2];
    }
};

exports.getIndexFromDid = getIndexFromDid;