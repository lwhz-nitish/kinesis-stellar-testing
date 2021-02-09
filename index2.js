const stellar = require('stellar-sdk')
const phraseString = 'KEM UAT'
// const server = new JsKinesis.Server('http://ec2-3-248-231-34.eu-west-1.compute.amazonaws.com:8000', { allowHttp: true })
// const passPhrase = 'Kinesis KAG Test Yield'

// const rootSecret = 'SC3QXJN2QHTWGJWBZ5DW6MD2MWVUOY5UKRQBXNQQR2A3ZN55BZ54JC2E'
// const sourceKeys = JsKinesis.Keypair.fromSecret(rootSecret)
const sourceKeys = stellar.Keypair.master(phraseString)
const rootPublic = sourceKeys.publicKey()

console.log(sourceKeys.publicKey())
console.log(sourceKeys.secret())
const newAccountPublic = 'GBVGFXNNCF6WIVRQBAZNNZM4XNOJBXTZI55W63GV5FWFSX6JBLMLIQZG'

// const createNewAccount = () => {
//     let pair = JsKinesis.Keypair.random()
//     console.log("Secret:", pair.secret())
//     console.log("Public:", pair.publicKey())
// }

// const fundAccount = async () => {

//     server.loadAccount(rootPublic)
//         .then(({ id, sequence }) => {
//             let acc = new JsKinesis.Account(id, sequence);
//             // console.log(`id: ${id}, sequence: ${sequence}`)
//             let fee = "1000000000";
//             let txn = new JsKinesis.TransactionBuilder(acc, { fee: fee, networkPassphrase: passPhrase })
//                 // .addOperation(JsKinesis.Operation.createAccount({
//                 //     destination: newAccountPublic,
//                 //     startingBalance: "10000"
//                 // })) // <- funds and creates destinationA
//                 .addOperation(JsKinesis.Operation.payment({
//                     destination: newAccountPublic,
//                     amount: "10000",
//                     asset: JsKinesis.Asset.native()
//                 })) // <- sends 100 XLM to destinationB
//                 // .addOperation(JsKinesis.Operation.inflation({
//                 //     source: 'GDOH22HD2ORICBF3V2M5K5FWX6IENHKXBI6JO7IOA2G5SVI2EDGIRYRN'
//                 // }))
//                 .setTimeout(30)
//                 .build();
//             txn.sign(sourceKeys)
//             console.log("txn: ", txn)
//             server.submitTransaction(txn, { skipMemoRequiredCheck: true })
//                 .then(msg => console.log("Sucess:", msg))
//                 .catch(err => {
//                     // console.log("Error :", err.request)
//                     console.error("Error :", err.response.data)
//                     // console.log("Errors :", err.response.data.extras)
//                 })
//         })
// }


// const checkAccountPresence = (publicKey) => {
//     server.accounts()
//         .accountId(publicKey)
//         .call()
//         .then(({ sequence }) => console.log("Done. \nSequence is:", sequence))
//         .catch((err) => console.log(err))
// }

// const getAccountTxHistory = (publicKey) => {
//     server.transactions()
//         .forAccount(publicKey)
//         .call()
//         .then(function (page) {
//             console.log('Page 1: ');
//             console.log(page.records);
//             return page.next();
//         })
//         .then(function (page) {
//             console.log('Page 2: ');
//             console.log(page.records);
//         })
//         .catch(function (err) {
//             console.log(err);
//         });
// }

// const getBalance = async (publicKey) => {
//     try {
//         let balance = 0;
//         // Load newly created accounts
//         account = await server.loadAccount(publicKey)
//         // check the balances
//         account.balances.forEach((bal) => {
//             balance = balance + bal.balance;
//         })
//         console.log("Balance:", balance)
//     } catch (err) {
//         console.log("ERROR :", err)
//     }
// }



// const mergeAccount = (sourcePrivate, dest) => {
//     let from = JsKinesis.Keypair.fromSecret(sourcePrivate)
//     server.loadAccount(from.publicKey())
//         .then(({ id, sequence }) => {
//             let acc = new JsKinesis.Account(id, sequence);
//             let fee = "100";
//             let txn = new JsKinesis.TransactionBuilder(acc, { fee: fee, networkPassphrase: passPhrase })
//                 .addOperation(JsKinesis.Operation.accountMerge({
//                     destination: dest
//                 })) // <- funds and creates destinationA
//                 .setTimeout(30)
//                 .build();
//             txn.sign(from)
//             // console.log("txn: ", txn)
//             server.submitTransaction(txn, { skipMemoRequiredCheck: true })
//                 .then(msg => console.log("Sucess:", msg))
//                 .catch(err => {
//                     console.log(err.response.data)
//                     console.log(err.response.data.extras.result_codes)
//                 })
//         })

// }

// const multiSigAccount = () => {
//     var rootKeypair = JsKinesis.Keypair.fromSecret("SBQWY3DNPFWGSZTFNV4WQZLBOJ2GQYLTMJSWK3TTMVQXEY3INFXGO52X")
//     var account = new JsKinesis.Account(rootkeypair.publicKey(), "46316927324160");

//     var secondaryAddress = "GC6HHHS7SH7KNUAOBKVGT2QZIQLRB5UA7QAGLA3IROWPH4TN65UKNJPK";

//     var transaction = new JsKinesis.TransactionBuilder(account, {
//         fee: JsKinesis.BASE_FEE,
//         networkPassphrase: Networks.TESTNET
//     })
//         .addOperation(JsKinesis.Operation.setOptions({
//             signer: {
//                 ed25519PublicKey: secondaryAddress,
//                 weight: 1
//             }
//         }))
//         .addOperation(JsKinesis.Operation.setOptions({
//             masterWeight: 1, // set master key weight
//             lowThreshold: 1,
//             medThreshold: 2, // a payment is medium threshold
//             highThreshold: 2 // make sure to have enough weight to add up to the high threshold!
//         }))
//         .setTimeout(30)
//         .build();

//     transaction.sign(rootKeypair); // only need to sign with the root signer as the 2nd signer won't be added to the account till after this transaction completes

//     // now create a payment with the account that has two signers

//     var transaction = new JsKinesis.TransactionBuilder(account, {
//         fee: JsKinesis.BASE_FEE,
//         networkPassphrase: Networks.TESTNET
//     })
//         .addOperation(JsKinesis.Operation.payment({
//             destination: "GBTVUCDT5CNSXIHJTDHYSZG3YJFXBAJ6FM4CKS5GKSAWJOLZW6XX7NVC",
//             asset: JsKinesis.Asset.native(),
//             amount: "2000" // 2000 XLM
//         }))
//         .setTimeout(30)
//         .build();

//     var secondKeypair = JsKinesis.Keypair.fromSecret("SAMZUAAPLRUH62HH3XE7NVD6ZSMTWPWGM6DS4X47HLVRHEBKP4U2H5E7");

//     // now we need to sign the transaction with both the root and the secondaryAddress
//     transaction.sign(rootKeypair);
//     transaction.sign(secondKeypair);
// }

// // createNewAccount();
// // fundAccount();
// // checkAccountPresence(rootPublic);
// // getAccountTxHistory(newAccountPublic);
// // getBalance(newAccountPublic);
// // makePayment(rootPublic, rootSecret, newAccountPublic, "10000");
// // mergeAccount("SCTRU3I74WKHGHBZBYV5J33PULLLOCJ6JKNWYY37VP5DO7YN2LD5LBO7", "GA7O4ESI4XA2GJAVKNDTT262X5IFNZJOIIZPBHX2DIQRAA5TC6B3ZR43")

