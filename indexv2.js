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
    const bal = await blockchainGateway.getBalanceAtAddress('GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B')
    console.log(bal)
}

getBal()