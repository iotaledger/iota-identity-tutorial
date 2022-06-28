import { createDID } from './createDid'
import { createSignedVerifiableCredential } from './verifiableCredentials'
import { createVerifiablePresentation } from './verifiablePresentation'
import { checkVerifiablePresentation } from './checkVerifiablePresentation'
import { addVerificationMethod } from './verificationMethods'
import { revokeVC } from './revocation'
import { addRevocationBitmap } from './revocationBitmap'
import { loadDID } from './loadDid'

async function stronghold() {
  if (!process.argv[2]) {
    console.error('No command was provided!')
    //todo log availiable commands
    return
  }

  // Create DID.
  if (process.argv[2].toLowerCase() == 'create-did') {
    if (process.argv.length != 5) {
      console.error('Error: Command arguments are incorrect!')
      console.error(
        'Please use: "npm run start create-did <name> <stronghold-password>"'
      )
      return
    }
    createDID(process.argv[3], process.argv[4])
    return
  }

  // Create Verification Method.
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
    return
  }

  // Add Revocation List.
  if (process.argv[2].toLowerCase() == 'add-revocation-list') {
    if (process.argv.length != 6) {
      console.error('Error: Command arguments are incorrect!')
      console.error(
        `Please use: "npm run start add-revocation-list <identity-name> <stronghold-password> <revocation-fragment>`
      )
      return
    }
    const name = process.argv[3]
    const password = process.argv[4]
    const fragment = process.argv[5]

    addRevocationBitmap(name, password, fragment)
    return
  }

  // Create verifiable Credential.
  if (process.argv[2].toLowerCase() == 'create-vc') {
    if (process.argv.length != 10) {
      console.error('Error: Command arguments are incorrect!')
      console.error(
        `please use "npm run start create-vc <issuer-name> <issuerPassword> <subjectName> <subjectDid> <verificationMethodFragment> <revocationBitmapFragment> <revocationIndex>`
      )
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
    return
  }

  // Get DID.
  if (process.argv[2].toLowerCase() == 'get-did') {
    if (process.argv.length != 5) {
      console.error('Error: Command arguments are incorrect!')
      console.log(
        `please use "npm run start get-did <identity-name> <stronghold-password>"`
      )
      return
    }
    const name = process.argv[3]
    const password = process.argv[4]
    loadDID(name, password, true)
    return
  }

  // Create Verifiable Presentation.
  if (process.argv[2].toLowerCase() == 'create-vp') {
    if (process.argv.length != 8) {
      console.error('Error: Command arguments are incorrect!')
      console.log(
        `Plese use "npm run start create-vp <holder-name> <holder-password> <credential-file> <verification-method-fragment> <challenge>`
      )
      return
    }
    const holderName = process.argv[3]
    const holderPassword = process.argv[4]
    const credentialFile = process.argv[5]
    const fragment = process.argv[6]
    const challenge = process.argv[7]
    createVerifiablePresentation(
      holderName,
      holderPassword,
      credentialFile,
      fragment,
      challenge
    )
    return
  }

  // Check Verifiable Presentation.
  if (process.argv[2].toLowerCase() == 'verify-vp') {
    if (process.argv.length != 5) {
      console.error('Error: Command arguments are incorrect!')
      console.log(
        `Please use "npm run start verify-vp <presentation-file> <challenge>"`
      )
      return
    }
    const presentationFile = process.argv[3]
    const challenge = process.argv[4]
    checkVerifiablePresentation(presentationFile, challenge)
    return;
  }

  // Revoke Verifiable Credential.
  if (process.argv[2].toLowerCase() == 'revoke-vc') {
    if (process.argv.length != 7) {
      console.error('Error: Command arguments are incorrect!')
      console.log(
        `Please run "npm run start revoke-vc <issuer-name> <issuer-password> <revocation-bitmap-fragment> <revocation-index>"`
      )
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
    return
  }
  console.error("Command not supported.")
}

stronghold().then(() => {})
