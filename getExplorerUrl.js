// Copyright 2020-2021 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

function getExplorerUrl(network, messageId) {
    return(`https://explorer.iota.org/${network}net/message/${messageId}`);
  }
  
exports.getExplorerUrl = getExplorerUrl;