import { createDID } from './createDid'
import { createSignedVerifiableCredential } from './verifiableCredentials'
import { createVerifiablePresentation } from './verifiablePresentation'
import { checkVerifiablePresentation } from './checkVerifiablePresentation'
import { addVerificationMethod } from './verificationMethods'
import { revokeVC } from './revokation'
import { addRevocationBitmap } from './revocationBitmap'
import { loadDID } from './loadDid'

async function stronghold() {
  if (!process.argv[2]) {
    console.error('No command was provided!')
    //todo log availiable commands
    return
  }

  if (process.argv[2].toLowerCase() == 'create-did') {
    if (process.argv.length != 5) {
      console.error('Please add identity name as command line argument')
      console.error(
        'Please use: "npm run start create-did <name> <stronghold-password>"'
      )
      return
    }
    createDID(process.argv[3], process.argv[4])
    return
  }

  if (process.argv[2].toLowerCase() == 'create-vm') {
    if (process.argv.length != 6) {
      console.error('Error: Command arguments are incorrect!')
      console.error(
        `Please use: "npm run start create-vm <identity-name> <stronghold-password> <verification-fragment>`
      )
      return
    }
    const name = process.argv[3]
    const password = process.argv[4]
    const fragment = process.argv[5]
    addVerificationMethod(name, password, fragment)
  }

  if (process.argv[2].toLowerCase() == 'add-revocation-bitmap') {
    if (process.argv.length != 6) {
      console.error('Error: Command arguments are incorrect!')
      console.error(
        `Please use: "npm run start create-revocation-list <identity-name> <stronghold-password> <revocation-fragment>`
      )
      return
    }
    const name = process.argv[3]
    const password = process.argv[4]
    const fragment = process.argv[5]

    addRevocationBitmap(name, password, fragment)
  }

  if (process.argv[2].toLowerCase() == 'create-vc') {
    if (process.argv.length != 10) {
      console.error('Error: Command arguments are incorrect!')
      return
    }
    const issuerName = process.argv[3]
    const issuerPassword = process.argv[4]
    const subjectName = process.argv[5]
    const subjectDid = process.argv[6]
    const verificationMethodFragment = process.argv[7]
    const revocationBitmapFragment = process.argv[8]
    const revocationIndex = parseInt(process.argv[9])
    createSignedVerifiableCredential(
      issuerName,
      issuerPassword,
      subjectName,
      subjectDid,
      verificationMethodFragment,
      revocationBitmapFragment,
      revocationIndex
    )
  }

  if (process.argv[2].toLowerCase() == 'get-did') {
    if (process.argv.length != 5) {
      console.error('Error: Command arguments are incorrect!')
      return
    }
    const name = process.argv[3]
    const password = process.argv[4]
    loadDID(name, password, true)
  }

  if (process.argv[2].toLowerCase() == 'create-vp') {
    if (process.argv.length != 7) {
      console.error('Error: Command arguments are incorrect!')
      return
    }
    const holderName = process.argv[3]
    const holderPassword = process.argv[4]
    const fragment = process.argv[5]
    const challenge = process.argv[6]
    createVerifiablePresentation(
      holderName,
      holderPassword,
      fragment,
      challenge
    )
  }

  if (process.argv[2].toLowerCase() == 'verify-vp') {
    if (process.argv.length != 5) {
      console.error('Error: Command arguments are incorrect!')
      return
    }
    const holderName = process.argv[3]
    const challenge = process.argv[4]
    checkVerifiablePresentation(holderName, challenge)
  }

  if (process.argv[2].toLowerCase() == 'revoke-vc') {
    if (process.argv.length != 7) {
      console.error('Error: Command arguments are incorrect!')
      return
    }
    const issuerName = process.argv[3]
    const issuerPassword = process.argv[4]
    const revocationBitmapFragment = process.argv[5]
    const revocationIndex = process.argv[6]
    revokeVC(
      issuerName,
      issuerPassword,
      revocationBitmapFragment,
      parseInt(revocationIndex)
    )
  }
}

stronghold().then(() => {})
