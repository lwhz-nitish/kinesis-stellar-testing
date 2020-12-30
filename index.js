const Stellarsdk = require('stellar-sdk')
const server = new Stellarsdk.Server('https://kem-testnet-europe0.kinesisgroup.io', { allowHttp: true })
const passPhrase = 'KEM UAT'

const rootSecret = 'SBFZOOYTRZ3PQ4XSUOW2T7IJ5X75JKYHTP2U3V4SIYXZNIGA6LW5KOT3'
const sourceKeys = Stellarsdk.Keypair.fromSecret(rootSecret)
const rootPublic = sourceKeys.publicKey()

// const signJeremy = Stellarsdk.Keypair.fromSecret('SDSW2PXCGGJUJLWUU5UC4R2YAKVJOEY2UIFGSR73CRZ4DYE4RSDCOH5P')
// const signNitish = Stellarsdk.Keypair.fromSecret('SAVZJGVD4PJHRCGQPWPPGX254G4A4PPJCANPSTP6UD7CYDIYQCNS4RX5')

console.log(rootPublic)
const newAccountPublic = 'GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B'

const createNewAccount = () => {
    let pair = Stellarsdk.Keypair.random()
    console.log("Secret:", pair.secret())
    console.log("Public:", pair.publicKey())
}

const fundAccount = async () => {

    server.loadAccount(rootPublic)
        .then(({ id, sequence }) => {
            let acc = new Stellarsdk.Account(id, sequence);
            console.log(`id: ${id}, sequence: ${sequence}`)
            let fee = '225000001'; //4500001
            let txn = new Stellarsdk.TransactionBuilder(acc, { fee, networkPassphrase: passPhrase })
                .addOperation(Stellarsdk.Operation.createAccount({
                    destination: newAccountPublic,
                    startingBalance: "5000"
                })) // <- funds and creates destinationA
                // .addOperation(Stellarsdk.Operation.payment({
                //     destination: newAccountPublic,
                //     amount: "100",
                //     asset: Stellarsdk.Asset.native()
                // }))  // <- sends 100 XLM to destinationB
                // .addOperation(Stellarsdk.Operation.inflation({
                //     source: 'GBUXCWNJQNZ73H4WRM36PS7FTZLUZCTGTTA3GZVGXEOI562WGC4X3BUX'
                // }))
                .setTimeout(30)
                .build();
            txn.sign(sourceKeys)
            // txn.sign(signJeremy)
            console.log("txn: ", txn)
            server.submitTransaction(txn, { skipMemoRequiredCheck: true })
                .then(msg => console.log("Sucess:", msg))
                .catch(err => {
                    // console.log("Error :", err)
                    console.error("Error :", err.response.data)
                    console.log("Errors :", err.response.data.extras)
                })
        })
}

const multiSigAccount = () => {

    server.loadAccount(rootPublic)
        .then(({ id, sequence }) => {
            let acc = new Stellarsdk.Account(id, sequence);
            let jeremy = Stellarsdk.Keypair.publicKey(signJeremy)
            var nitish = Stellarsdk.Keypair.publicKey(signNitish)

            let fee = '100';
            let txn = new Stellarsdk.TransactionBuilder(acc, { fee: fee, networkPassphrase: passPhrase })
                .addOperation(Stellarsdk.Operation.setOptions({
                    signer: {
                        ed25519PublicKey: jeremy,
                        weight: 3
                    }
                }))
                .addOperation(Stellarsdk.Operation.setOptions({
                    signer: {
                        ed25519PublicKey: nitish,
                        weight: 3
                    }
                }))
                .addOperation(Stellarsdk.Operation.setOptions({
                    masterWeight: 3, // set master key weight
                    lowThreshold: 2,
                    medThreshold: 5, // a payment is medium threshold
                    highThreshold: 7 // make sure to have enough weight to add up to the high threshold!
                }))
                .setTimeout(30)
                .build();

            txn.sign(sourceKeys);
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

const checkAccountPresence = (publicKey) => {
    server.accounts()
        .accountId(publicKey)
        .call()
        .then(({ sequence }) => console.log("Done. \nSequence is:", sequence))
        .catch((err) => console.log(err))
}

const getAccountTxHistory = (publicKey) => {
    server.transactions()
        .forAccount(publicKey)
        .call()
        .then(function (page) {
            console.log('Page 1: ');
            console.log(page.records);
            return page.next();
        })
        .then(function (page) {
            console.log('Page 2: ');
            console.log(page.records);
        })
        .catch(function (err) {
            console.log(err);
        });
}

const getBalance = async (publicKey) => {
    try {
        let balance = 0;
        // Load newly created accounts
        account = await server.loadAccount(publicKey)
        // check the balances
        account.balances.forEach((bal) => {
            balance = balance + bal.balance;
        })
        console.log("Balance:", balance)
    } catch (err) {
        console.log("ERROR :", err)
    }
}



const mergeAccount = (sourcePrivate, dest) => {
    let from = Stellarsdk.Keypair.fromSecret(sourcePrivate)
    server.loadAccount(from.publicKey())
        .then(({ id, sequence }) => {
            let acc = new Stellarsdk.Account(id, sequence);
            let fee = "100";
            let txn = new Stellarsdk.TransactionBuilder(acc, { fee: fee, networkPassphrase: passPhrase })
                .addOperation(Stellarsdk.Operation.accountMerge({
                    destination: dest
                })) // <- funds and creates destinationA
                .setTimeout(30)
                .build();
            txn.sign(from)
            // console.log("txn: ", txn)
            server.submitTransaction(txn, { skipMemoRequiredCheck: true })
                .then(msg => console.log("Sucess:", msg))
                .catch(err => {
                    console.log(err.response.data)
                    console.log(err.response.data.extras.result_codes)
                })
        })

}



// createNewAccount();
fundAccount();
// checkAccountPresence(rootPublic);
// getAccountTxHistory(newAccountPublic);
// getBalance(newAccountPublic);
// makePayment(rootPublic, rootSecret, newAccountPublic, "10000");
// mergeAccount("SDM737LOFJSGF3IAUUSUVCEROSYQDYK747GX5LL3J3OS6YWAMJE7VEF4", "GBVGFXNNCF6WIVRQBAZNNZM4XNOJBXTZI55W63GV5FWFSX6JBLMLIQZG")

// multiSigAccount();