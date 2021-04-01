const Kinesis = require('js-kinesis-sdk')
const express = require('express')

const app = express();

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

app.get('/transactions', (req, res) => {
    async function getTransactionsForAccount(address, limit, order) {
        Kinesis.Network.use(new Kinesis.Network(connection.passphrase))
        const server = new Kinesis.Server(connection.endpoint)

        const transactions = await server.transactions().forAccount('GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B').call()

        const next = async (tr) => {
            return mapThis(await tr.next())
        }
        const data = await next(transactions)
        res.send(data)
        // res.send(mapThis(transactions))
    }

    function mapThis(tx) {
        return tx.records.map((transaction) => ({
            id: transaction.id,
            paging_token: transaction.paging_token,
            fee_charged: String(transaction.fee_paid),
            created_at: transaction.created_at,
            operation_count: transaction.operation_count,
            source_account: transaction.source_account,
            source_account_sequence: transaction.source_account_sequence,
            envelope_xdr: transaction.envelope_xdr,
            result_xdr: transaction.result_xdr,
            result_meta_xdr: transaction.result_meta_xdr,
            memo: transaction.memo,
            signatures: transaction.signatures,
            _links: transaction._links,
        }))
    }
    getTransactionsForAccount()
})

app.listen(3000, () => {
    console.log('Server started at port: 3000')
})