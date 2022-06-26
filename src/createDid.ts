import { AccountBuilder, ExplorerUrl } from '@iota/identity-wasm/node'
import { Stronghold } from '@iota/identity-stronghold-nodejs'
import * as path from 'path'

async function createDID(name: string, password: string) {
  const strongholdPath = path.join('stronghold-files', name + '.hodl')
  const stronghold = await Stronghold.build(strongholdPath, password, true)

  // Retrieve all DIDs stored in the stronghold.
  const dids = await stronghold.didList()

  // Abort if Stronhold contains more then one DID.
  if (dids.length != 0) {
    throw new Error('Stronghold already contains a DID')
  }

  // The creation step generates a keypair, builds an identity
  // and publishes it to the IOTA mainnet.
  const builder = new AccountBuilder({
    storage: stronghold,
  })

  const account = await builder.createIdentity()

  // Print the DID.
  console.log(account.did().toString())

  // Print the local state of the DID Document
  console.log(account.document())

  // Print the Explorer URL for the DID.
  console.log(`Explorer Url:`, ExplorerUrl.mainnet().resolverUrl(account.did()))
}

export { createDID }
