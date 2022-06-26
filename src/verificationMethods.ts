
import {Account, MethodContent, ExplorerUrl} from "@iota/identity-wasm/node"
import { loadDID } from "./helpers/loadDid"

async function addVerificationMethod(name: string, password: string, fragment: string){

  let account: Account = await loadDID(name, password);

  // Create a new method
  await account.createMethod({
      content: MethodContent.GenerateEd25519(),
      fragment 
  })

  console.log("Creating Method Successful!");
  console.log(`Explorer Url:`, ExplorerUrl.mainnet().resolverUrl(account.did()));
}

export {addVerificationMethod}
