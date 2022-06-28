import {
  ProofOptions,
  Account,
  Credential,
  RevocationBitmap,
} from '@iota/identity-wasm/node'
import { writeFileSync } from 'fs'
import { loadDID } from './loadDid'
import * as path from 'path'

/**
 * Create a signed `UniversityDegree` credential and saves it to `credentials/<subjectName>-credential.json
 * The issuer also chooses a unique revocation index to be able to revoke the credential later.
 *
 * @param issuerName used to locate the Stronghold file in `/stronghold-files/<issuerName>.hodl`.
 * @param issuerPassword Stronghold password.
 * @param subjectName Name of subject, output file will be `<subjectName>-credential.json`.
 * @param subjectDid DID of subject e.g. `did:iota:abc...zxy`.
 * @param verificationMethodFragment to determin which verification method the VC should be signed with.
 * @param revocationBitmapFragment to determin which revocation list the VC is tied to.
 * @param revocationIndex to determin the index of this credential in the revocation list.
 */
async function createSignedVerifiableCredential(
  issuerName: string,
  issuerPassword: string,
  subjectName: string,
  subjectDid: string,
  verificationMethodFragment: string,
  revocationBitmapFragment: string,
  revocationIndex: number
) {
  const issuer: Account = await loadDID(issuerName, issuerPassword)

  console.log(subjectName)
  console.log(subjectDid)

  // Create a credential subject indicating the degree earned by Alice, linked to their DID.
  const subject = {
    id: subjectDid,
    name: subjectName,
    degree: 'Bachelor of Science and Arts',
    GPA: '4.0',
  }

  // Create an unsigned `UniversityDegree` credential for the subject.
  // The issuer also chooses a unique `RevocationBitmap` index to be able to revoke it later.
  const unsignedVc = new Credential({
    id: 'https://example.edu/credentials/3732',
    type: 'UniversityDegreeCredential',
    credentialStatus: {
      id: issuer.did() + '#' + revocationBitmapFragment,
      type: RevocationBitmap.type(),
      revocationBitmapIndex: revocationIndex.toString(),
    },
    issuer: issuer.document().id(),
    credentialSubject: subject,
  })

  // Created a signed credential by the issuer.
  const signedVC = await issuer.createSignedCredential(
    verificationMethodFragment,
    unsignedVc,
    ProofOptions.default()
  )

  const fileName = subjectName + '-credential.json'
  const filePath = path.join('credentials', fileName)
  writeFileSync(filePath, JSON.stringify(signedVC, null, 4))

  console.log('VC was successfully created. see file:')
  console.log(filePath.toString())
}

export { createSignedVerifiableCredential }
