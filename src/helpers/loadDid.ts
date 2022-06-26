

import {AccountBuilder, ExplorerUrl, Account} from "@iota/identity-wasm/node"
import {Stronghold} from "@iota/identity-stronghold-nodejs";
import * as path from "path";

async function loadDID(name: string, password: string, log = false): Promise<Account> {

    console.log("getting stronhold");
    const strongholdPath = path.join("stronghold-files", name + ".hodl");
    const stronghold = await Stronghold.build(strongholdPath, password, true);

    console.log("stronhold loaded");
    // Retrieve all DIDs stored in the stronghold.
    const dids = await stronghold.didList();

    // Abort if Stronhold is empty. 
    if( dids.length == 0){
        throw new Error("Error: Stronghold doesn't contain any DIDs!")
    }

    // Abort if Stronhold contains more then one DID.
    if( dids.length > 1){
        throw new Error("Error: Stronghold contains more than one DID!")
    }

    // The creation step generates a keypair, builds an identity
    // and publishes it to the IOTA mainnet.
    let builder = new AccountBuilder({
        storage: stronghold,
    });
    
    let account: Account;

    if(log) console.log("DID exists in storage, Loading DID...")
    account = await builder.loadIdentity(dids[0]);
    if(log) console.log (`DID: ${dids[0]}`)

    return account;
}

export {loadDID}
