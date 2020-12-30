const Kinesis = require('js-kinesis-sdk')
const stellarTx = require('./kinesis2')

const connection = {
    endpoint: 'https://kem-testnet-ireland1.kinesisgroup.io',
    passphrase: 'KEM UAT'
}

const request = {
    targetPayee: 'GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B',
    amount: '10',
    memo: 'sdk-test',
    fee: '450100',
    sourceSecret: 'SAP4FP44OLT7RVZZ4GEPY676P6OUISCE2E7ZTKZB53WAGEWSJHQJNMTW'
}

let doPayment = async () => {
    Kinesis.Network.use(new Kinesis.Network(connection.passphrase))
    const server = new Kinesis.Server(connection.endpoint)
    const sourceKeys = Kinesis.Keypair.fromSecret(request.sourceSecret)
    const { id, sequence } = await server.loadAccount(request.targetPayee)
    const acc = new Kinesis.Account(id, sequence)
    const transaction = new Kinesis.TransactionBuilder(acc, { fee: request.fee })
        .addOperation(
            Kinesis.Operation.payment({
                amount: request.amount,
                destination: request.targetPayee,
                asset: Kinesis.Asset.native(),
            }),
        )
        .addMemo(Kinesis.Memo.text(request.memo || ''))
        .build()
    transaction.sign(sourceKeys)
    console.log(transaction)
    server.submitTransaction(transaction)
        .then(msg => console.log("Sucess:", msg))
        .catch(err => {
            // console.log("Error :", err.request)
            console.error("Error :", err)
            console.log("ErrorDetail :", err.response)
        })
}

//doPayment()

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

importTx()