import {Subject, ProofOptions, Account, Credential, RevocationBitmap} from "@iota/identity-wasm/node"
import {writeFileSync} from "fs";
import { loadDID } from "./helpers/loadDid"
import * as path from "path";

async function revokeVC(
  issuerName: string,
  issuerPassword: string, 
  revocationBitmapFragment: string,
  indexToRevoke: number,
){
  let issuer: Account = await loadDID(issuerName, issuerPassword);
  await issuer.revokeCredentials(revocationBitmapFragment, indexToRevoke);
  console.log("Revocation successful.");
}

export { revokeVC }
