const { readFileSync } = require('fs');


function getWeakholdObject(weakholdFilePath) {
    //Read weakhold object from file
    let weakholdObject = JSON.parse(readFileSync(weakholdFilePath));
    return(weakholdObject);
}

exports.getWeakholdObject = getWeakholdObject;