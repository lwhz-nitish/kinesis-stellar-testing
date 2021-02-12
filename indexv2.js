// import {
//     KinesisBlockchainGateway,
//     KinesisBlockchainGatewayFactory,
//     KinesisCoin,
//     Environment as Network,
//     OperationRecord,
//   } from '@abx/js-kinesis-sdk-v2'

const v2 = require('@abx/js-kinesis-sdk-v2')




const getBal = async () => {
    const blockchainGateway = new v2.KinesisBlockchainGatewayFactory().getGatewayInstance('KEM', 'testnet');
    // const bal = await blockchainGateway.getBalanceAtAddress('GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B')
    let seq = await blockchainGateway.getNextSequenceNumberForAccount('GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B')
    console.log(seq, seq - 1, String(seq).length)
    let Obj = {
        senderAddress: 'GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B',
        sequenceNumber: seq,
        toAddress: 'GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B'
        , memo: "request.memo",
        amount: Number(10)
    }
    let result = await blockchainGateway.createTransactionEnvelopeWithSequenceNumber(Obj)
    let transaction = await blockchainGateway.sendTransactionEnvelope(result, 'SAP4FP44OLT7RVZZ4GEPY676P6OUISCE2E7ZTKZB53WAGEWSJHQJNMTW')


    console.log(transaction)
}

getBal()