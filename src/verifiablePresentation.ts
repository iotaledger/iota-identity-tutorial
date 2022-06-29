import {
  ProofOptions,
  Account,
  Credential,
  Presentation,
} from '@iota/identity-wasm/node'
import { loadDID } from './loadDid'
import * as path from 'path'
import { readFileSync, writeFileSync } from 'fs'

/**
 * Creates a verifiable presentation from a verifiable credential. Saves the result in `presentations/<hodlerName>-presentation.json`.
 *
 * @param holderName Name of the holder to determin the Stronghold file in `/stronghold-files/<holderName>.hodl`.
 * @param holderPassword Stronghold password.
 * @param credentialFile Credential file in `credentials/<credentialFile>` for example "alice-credential.json".
 * @param verificationMethodFragment VM with which the presentation will be signed with.
 * @param challenge Challenge what will be included in the presentation before it being signed.
 */
async function createVerifiablePresentation(
  holderName: string,
  holderPassword: string,
  credentialFile: string,
  verificationMethodFragment: string,
  challenge: string
) {
  const filePath = path.join('credentials', credentialFile)
  const verifiableCredential = JSON.parse(readFileSync(filePath, 'utf-8'))

  const holder: Account = await loadDID(holderName, holderPassword)

  // Deserialize the credential.
  const receivedVc = Credential.fromJSON(verifiableCredential)

  // Create a Verifiable Presentation from the Credential
  const unsignedVp = new Presentation({
    holder: holder.did(),
    verifiableCredential: receivedVc,
  })

  // Sign the verifiable presentation using the holder's verification method
  // and include the requested challenge and expiry timestamp.
  const signedVp = await holder.createSignedPresentation(
    verificationMethodFragment,
    unsignedVp,
    new ProofOptions({
      challenge,
    })
  )

  const fileNamePresentation = holderName + '-presentation.json'
  const presentationFilePath = path.join('presentations', fileNamePresentation)
  writeFileSync(presentationFilePath, JSON.stringify(signedVp, null, 4))

  console.log('VP was successfully created. see file:')
  console.log(filePath.toString())
}

export { createVerifiablePresentation }
