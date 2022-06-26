import { Account, MethodContent, ExplorerUrl } from '@iota/identity-wasm/node'
import { loadDID } from './loadDid'

async function addVerificationMethod(
  name: string,
  password: string,
  fragment: string
) {
  const account: Account = await loadDID(name, password)

  await account.createMethod({
    content: MethodContent.GenerateEd25519(),
    fragment,
  })

  console.log('Creating Method Successful!')
  console.log(`Explorer Url:`, ExplorerUrl.mainnet().resolverUrl(account.did()))
}

export { addVerificationMethod }
