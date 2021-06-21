const fs = require('fs');


function getWeakholdObject(weakholdFilePath) {
    //Read weakhold object from file
    let weakholdObject = JSON.parse(fs.readFileSync(weakholdFilePath));
    return(weakholdObject);
}

exports.getWeakholdObject = getWeakholdObject;