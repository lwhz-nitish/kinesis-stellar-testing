const Stellarsdk = require('stellar-sdk')
const server = new Stellarsdk.Server('https://kem-testnet-europe0.kinesisgroup.io', { allowHttp: true })
const passPhrase = 'KEM UAT'

const rootSecret = 'SAP4FP44OLT7RVZZ4GEPY676P6OUISCE2E7ZTKZB53WAGEWSJHQJNMTW'
const sourceKeys = Stellarsdk.Keypair.fromSecret(rootSecret)
const rootPublic = sourceKeys.publicKey()

const newAccountPublic = 'GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B'

console.log(JSON.stringify(server))

module.exports = async function buildTransaction() {

    let txn
    await server.loadAccount(rootPublic)
        .then(({ id, sequence }) => {
            let acc = new Stellarsdk.Account(id, sequence);
            console.log(`id: ${id}, sequence: ${sequence}`)
            let fee = '2250001'; //4500001
            txn = new Stellarsdk.TransactionBuilder(acc, { fee, networkPassphrase: passPhrase })
                // .addOperation(Stellarsdk.Operation.createAccount({
                //     destination: newAccountPublic,
                //     startingBalance: "10000"
                // })) // <- funds and creates destinationA
                .addOperation(Stellarsdk.Operation.payment({
                    destination: newAccountPublic,
                    amount: "50",
                    asset: Stellarsdk.Asset.native()
                }))  // <- sends 100 XLM to destinationB
                // .addOperation(Stellarsdk.Operation.inflation({
                //     source: 'GBUXCWNJQNZ73H4WRM36PS7FTZLUZCTGTTA3GZVGXEOI562WGC4X3BUX'
                // }))
                .setTimeout(30)
                .build();
            txn.sign(sourceKeys)
        })
    // console.log(txn)
    return txn
}