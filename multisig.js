const Stellarsdk = require('stellar-sdk')
const server = new Stellarsdk.Server('https://kem-mainnet.kinesisgroup.io')
const passPhrase = 'KEM LIVE'

const accountToConvert = '' // Secret key of Multisig account to be created

//Signers (as many as you require)

const signer1 = ''
const signer2 = ''

const multiSigAccount = () => {
    server.loadAccount(Stellarsdk.Keypair.fromSecret(accountToConvert).publicKey())
        .then(({ id, sequence }) => {
            let acc = new Stellarsdk.Account(id, sequence);

            let fee = '1';
            let txn = new Stellarsdk.TransactionBuilder(acc, { fee: fee, networkPassphrase: passPhrase })
                .addOperation(Stellarsdk.Operation.setOptions({
                    signer: {
                        ed25519PublicKey: signer1,
                        weight: 3 //provide weight for each signer
                    }
                }))
                .addOperation(Stellarsdk.Operation.setOptions({
                    signer: {
                        ed25519PublicKey: signer2,
                        weight: 3
                    }
                }))
                .addOperation(Stellarsdk.Operation.setOptions({
                    masterWeight: 3,
                    lowThreshold: 2,
                    medThreshold: 5,
                    highThreshold: 7
                }))
                .setTimeout(30)
                .build();

            txn.sign(Stellarsdk.Keypair.fromSecret(accountToConvert));
            console.log("txn: ", txn)
            server.submitTransaction(txn, { skipMemoRequiredCheck: true })
                .then(msg => console.log("Sucess:", msg))
                .catch(err => {
                    // console.log("Error :", err.request)
                    console.error("Error :", err.response.data)
                    console.log("Errors :", err.response.data.extras)
                })
        })
}