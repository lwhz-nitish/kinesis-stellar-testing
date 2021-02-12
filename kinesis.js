const Kinesis = require('js-kinesis-sdk')
// const stellarTx = require('./kinesis2')

const connection = {
    endpoint: 'https://kag-testnet-oceania1.kinesisgroup.io',
    passphrase: 'Kinesis KAG UAT'
}

const request = {
    targetPayee: 'GBJDSV53EM5OIPFX3KU25CMS3YZKTB6HBNCXQ77FCTSRDCZBXPCKJPJN',
    amount: '10',
    memo: 'sdk-test',
    fee: '450100',
    sourceSecret: 'SAP4FP44OLT7RVZZ4GEPY676P6OUISCE2E7ZTKZB53WAGEWSJHQJNMTW'
}

let doPayment = async () => {
    Kinesis.Network.use(new Kinesis.Network(connection.passphrase))
    console.log("aaaaa")
    const server = new Kinesis.Server(connection.endpoint)
    const sourceKeys = Kinesis.Keypair.fromSecret(request.sourceSecret)
    const { id, sequence } = await server.loadAccount(sourceKeys.publicKey())
    console.log(sequence)
    const acc = new Kinesis.Account(id, sequence)
    const transaction = new Kinesis.TransactionBuilder(acc, { fee: request.fee })
        // .addOperation(
        //     Kinesis.Operation.payment({
        //         amount: request.amount,
        //         destination: request.targetPayee,
        //         asset: Kinesis.Asset.native(),
        //     }),
        // )
        .addOperation(
            Kinesis.Operation.createAccount({
                destination: request.targetPayee,
                startingBalance: request.amount
            })
        )
        .addMemo(Kinesis.Memo.text(request.memo || ''))
        .build()
    transaction.sign(sourceKeys)
    console.log(transaction.fee.low)
    server.submitTransaction(transaction)
        .then(msg => console.log("Sucess:", msg))
        .catch(err => {
            // console.log("Error :", err.request)
            console.error("Error :", err)
            console.log("ErrorDetail :", err.data.extras)
        })
}



let importTx = async () => {
    txn = await stellarTx()
    Kinesis.Network.use(new Kinesis.Network(connection.passphrase))
    const server = new Kinesis.Server(connection.endpoint)
    server.submitTransaction(txn)
        .then(msg => console.log("Sucess:", msg))
        .catch(err => {
            // console.log("Error :", err.request)
            console.error("Error :", err)
            console.log("ErrorDetail :", err.response)
        })
}

let getOperationsForAccount = async () => {
    Kinesis.Network.use(new Kinesis.Network(connection.passphrase))
    const server = new Kinesis.Server(connection.endpoint)

    let acc = await server.loadAccount(request.targetPayee)
    const firstPage = await acc.operations({ order: 'desc' })
    const isLastPageOrLastSeenTransactionHashFound = (ops) => ops.records.some((op) => op.type === 'create_account')
    const getAllOperationsSinceLastWithdrawal = async (page, allRecords = []) =>
        isLastPageOrLastSeenTransactionHashFound(page)
            ? allRecords.concat(page.records)
            : getAllOperationsSinceLastWithdrawal(await page.next(), allRecords.concat(page.records))


    // console.log(await getAllOperationsSinceLastWithdrawal(firstPage))
    console.log(firstPage)
}

validateAddress = () => {
    let add = 'GBUXCWNJQNZ73H4WRM36PS7FTZLUZCTGTTA3GZVGXEOI562WGC4X3BUX'
    try {
        Kinesis.Keypair.fromPublicKey(add)
        return true
    }
    catch {
        return false
    }
}

async function getPaymentsForAccount() {
    Kinesis.Network.use(new Kinesis.Network(connection.passphrase))
    const server = new Kinesis.Server(connection.endpoint)
    let acc = await (await server.loadAccount('GDIENNQ3BXCTB74ZYCQAGXCY7KTGFBZGHRMUVF3ZLIW6SMAZIGX2JCCS')).operations({ limit: 100, order })
    // let val = await (await server.transactions().forAccount('GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B').limit(100).call()).records
    console.log(acc.records.length)
}

async function doPaymentToAccount() {
    Kinesis.Network.use(new Kinesis.Network(connection.passphrase))
    const server = new Kinesis.Server(connection.endpoint)
    const { sequence } = await server.loadAccount('GBGMVYDN4ECORMMTEIGS6FVX3IB5U6DV5JHG5XI33ZEOVSXKVDMVDYFX')
    console.log(sequence)
}
// doPaymentToAccount()
// validateAddress()
doPayment()
// importTx()
// getOperationsForAccount()