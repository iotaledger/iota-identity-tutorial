import {
  SubjectHolderRelationship,
  PresentationValidationOptions,
  Resolver,
  FailFast,
  VerifierOptions,
  Presentation,
} from '@iota/identity-wasm/node'
import * as path from 'path'
import { readFileSync } from 'fs'

/**
 * Checks if a verifiable presentation located in `/presentations/<presentationFile>` is valid.
 *
 * @param presentationFile Name of presentation file in `/presentations/`.
 * @param challenge Challenge used when creating the presentation.
 */
async function checkVerifiablePresentation(
  presentationFile: string,
  challenge: string
) {
  // Get presentatoin from file.
  const filePath = path.join('presentations', presentationFile)
  const verifiablePresentation = JSON.parse(readFileSync(filePath, 'utf-8'))

  // Deserialize the presentation from the holder.
  const presentation = Presentation.fromJSON(verifiablePresentation)

  // The verifier wants the following requirements to be satisfied:
  // - Signature verification (including checking the requested challenge to mitigate replay attacks)
  // - Presentation validation must fail if credentials expiring within the next 10 hours are encountered
  // - The presentation holder must always be the subject, regardless of the presence of the nonTransferable property

  // Declare that the challenge must match our expectation:
  const presentationVerifierOptions = new VerifierOptions({
    challenge,
  })

  // Declare that the presentation holder's DID must match the subject ID on all credentials in the presentation.
  const subjectHolderRelationship = SubjectHolderRelationship.AlwaysSubject

  const presentationValidationOptions = new PresentationValidationOptions({
    presentationVerifierOptions: presentationVerifierOptions,
    subjectHolderRelationship: subjectHolderRelationship,
  })

  // In order to validate presentations and credentials one needs to resolve the DID Documents of
  // the presentation holder and of credential issuers. This is something the `Resolver` can help with.
  const resolver = new Resolver()

  try {
    // Validate the presentation and all the credentials included in it according to the validation options
    await resolver.verifyPresentation(
      presentation,
      presentationValidationOptions,
      FailFast.FirstError
    )
    // Since no errors were thrown by `verifyPresentation` we know that the validation was successful.
    console.log(`VP successfully validated`)
  } catch (error) {
    console.log(`VP validation unsuccessful`)
    console.log(error.message)
  }
}

export { checkVerifiablePresentation }
