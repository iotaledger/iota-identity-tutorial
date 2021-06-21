### IOTA Identity WASM

Within the following code examples you will utilize the [WASM binding of the IOTA Identity framework](https://github.com/iotaledger/identity.rs/tree/dev/bindings/wasm/examples) to solve the problem described below:
> Alice recently graduated from the University of Oslo with a Bachelors Degree in Computer Science. Now she wants to apply for a remote job at the IOTA Foundation and needs to digitally prove the existence of her degree. What she needs is an immutable and verifiable credential, which has been approved by both the University of Oslo and herself, before presenting it to her possible new employer.

As described [here](https://www.iota.org/solutions/digital-identity), IOTA Identity builds on the W3C's proposed standards for a digital identity framework and thus is based on three roles:
- Holder (Alice)
- Issuer (University of Oslo)
- Verifier (IOTA Foundation)

In this process, you will complete the following steps from the perspective of one of the mentioned roles:
1. Holder: Create a DID (Decentralized Identifier) document for Alice
2. Issuer: Create a DID document for the University of Oslo
3. Issuer: Add a verification method to the University's DID document with the sole purpose to verify Alice's degree
4. Issuer: Setup a document representing Alice's degree, containing her DID
5. Issuer: Sign degree document with the private key of the University's verification method for a verifiable credential
6. Holder: Sign document with Alice's private authentication key for a verifiable presentation
7. Verifier: Verify Alice's and the University's signatures with their respective public keys

Examples should be executed in following order:
* [create_did.js](create_did.js)
* [manipulate_did.js](manipulate_did.js)
* [create_vc.js](create_vc.js)