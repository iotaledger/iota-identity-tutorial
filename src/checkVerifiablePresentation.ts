import {
  SubjectHolderRelationship,
  PresentationValidationOptions,
  Resolver,
  FailFast,
  VerifierOptions,
  Presentation,
} from '@iota/identity-wasm/node'
import * as path from 'path'
const { readFileSync } = require('fs')

async function checkVerifiablePresentation(
  holderName: string,
  challenge: string
) {
  const fileName = holderName + '.json'
  const filePath = path.join('presentations', fileName)
  const verifiablePresentation = JSON.parse(readFileSync(filePath))

  // Deserialize the presentation from the holder.
  const presentation = Presentation.fromJSON(verifiablePresentation)

  // The verifier wants the following requirements to be satisfied:
  // - Signature verification (including checking the requested challenge to mitigate replay attacks)
  // - Presentation validation must fail if credentials expiring within the next 10 hours are encountered
  // - The presentation holder must always be the subject, regardless of the presence of the nonTransferable property
  // - The issuance date must not be in the future.

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

  // Validate the presentation and all the credentials included in it according to the validation options
  await resolver.verifyPresentation(
    presentation,
    presentationValidationOptions,
    FailFast.FirstError
  )

  // Since no errors were thrown by `verifyPresentation` we know that the validation was successful.
  console.log(`VP successfully validated`)
}

export { checkVerifiablePresentation }
