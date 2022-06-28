import { Account } from '@iota/identity-wasm/node'
import { loadDID } from './loadDid'

async function revokeVC(
  issuerName: string,
  issuerPassword: string,
  revocationBitmapFragment: string,
  indexToRevoke: number
) {
  const issuer: Account = await loadDID(issuerName, issuerPassword)
  await issuer.revokeCredentials(revocationBitmapFragment, indexToRevoke)
  console.log('Revocation successful.')
}

export { revokeVC }
