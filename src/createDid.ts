import { AccountBuilder, ExplorerUrl } from '@iota/identity-wasm/node'
import { Stronghold } from '@iota/identity-stronghold-nodejs'
import * as path from 'path'

/**
 * Creates a new DID and publishes it to the Tangle.
 * Also, creates a stronhold storage in `/stronghold-files/<name>.hodl`.
 *
 * @param name Name of DID owner.
 * @param password Stronghold password to be set.
 */
async function createDID(name: string, password: string) {
  // Build Stronghold storage file in /stronghold-files/<name>.hodl.
  const strongholdPath = path.join('stronghold-files', name + '.hodl')
  const stronghold = await Stronghold.build(strongholdPath, password, true)

  // Retrieve all DIDs stored in the stronghold.
  const dids = await stronghold.didList()

  // Abort if Stronhold Already contains a DID.
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
  console.log(JSON.stringify(account.document(), null, 4))

  // Print the Explorer URL for the DID.
  console.log(`Explorer Url:`, ExplorerUrl.mainnet().resolverUrl(account.did()))
}

export { createDID }
