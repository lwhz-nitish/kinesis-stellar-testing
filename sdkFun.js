const Kinesis = require('js-kinesis-sdk')

class SdkTest {

    // request = {
    //     targetPayee: 'GBJDSV53EM5OIPFX3KU25CMS3YZKTB6HBNCXQ77FCTSRDCZBXPCKJPJN',
    //     amount: '10',
    //     memo: 'sdk-test',
    //     fee: '450100',
    //     sourceSecret: 'SAP4FP44OLT7RVZZ4GEPY676P6OUISCE2E7ZTKZB53WAGEWSJHQJNMTW'
    // }

    constructor() {
        this.connection = {
            endpoint: 'https://kem-testnet.kinesisgroup.io',
            passphrase: 'KEM UAT'
        }
        Kinesis.Network.use(new Kinesis.Network(this.connection.passphrase))
        this.server = new Kinesis.Server(this.connection.endpoint)
    }

    async getTransactionsForAccount() {
        const transactions = await this.server.transactions().forAccount('GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B').call()
        return this.mapThis(transactions.next())
    }

    mapThis(tx) {
        const next = async () => {
            let nextTxPage = await tx.next()
            // console.log(nextTxPage)
            return this.mapThis(nextTxPage)
        }
        const prev = async () => {
            let prevTxPage = await tx.prev()
            return this.mapThis(prevTxPage)
        }
        return {
            next,
            prev,
            records: tx.records.map((transaction) => ({
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
    }

    async loadAccount() {
        const data = await this.server.loadAccount('GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B')
        // console.log(data)
        return data
    }
}

async function test() {
    let sdkTest = new SdkTest();
    const response = await sdkTest.loadAccount()
    console.log(response)
}

test()