
import {Subject, ProofOptions, Account, Credential, RevocationBitmap, Presentation} from "@iota/identity-wasm/node"
import { loadDID } from "./helpers/loadDid"
import * as path from "path";
const { readFileSync, writeFileSync} = require('fs');

async function createVerifiablePresentation(
  holderName: string,
  holderPassword: string,
  verificationMethodFragment: string,
  challenge: string,
){
  const fileName = holderName + ".json";
  const filePath = path.join("credentials", fileName);
  const verifiableCredential = JSON.parse(readFileSync(filePath))

  let holder: Account = await loadDID(holderName, holderPassword);

  // Deserialize the credential.
  const receivedVc = Credential.fromJSON(verifiableCredential);

  // Create a Verifiable Presentation from the Credential
  const unsignedVp = new Presentation({
      holder: holder.did(),
      verifiableCredential: receivedVc
  })

  // Sign the verifiable presentation using the holder's verification method
  // and include the requested challenge and expiry timestamp.
  const signedVp = await holder.createSignedPresentation(
      verificationMethodFragment,
      unsignedVp,
      new ProofOptions({
          challenge,
      })
  );

    const fileNamePresentation = holderName + ".json";
    const presentationFilePath = path.join("presentations", fileNamePresentation);
    writeFileSync(presentationFilePath, JSON.stringify(signedVp, null, 4));

    console.log("VP was successfully created. see file:");
    console.log(filePath.toString());
}

export {createVerifiablePresentation}
