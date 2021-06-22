// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

const { readFileSync } = require('fs');


function getWeakholdObject(weakholdFilePath) {
    //Read weakhold object from file
    let weakholdObject = JSON.parse(readFileSync(weakholdFilePath));
    return(weakholdObject);
}

exports.getWeakholdObject = getWeakholdObject;