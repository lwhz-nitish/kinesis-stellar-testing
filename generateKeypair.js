// this snippet is to generate public and secret keys using wallet's recovery phrase

const bip39 = require('bip39')      // "bip39": "2.5.0"
const hdKey = require('ed25519-hd-key')     // "ed25519-hd-key": "1.0.0"
const Kinesis = require('js-kinesis-sdk')   // "js-kinesis-sdk": "0.9.9"


function getKeypairFromMnemonic(mnemonic) {
    const data = hdKey.derivePath(`m/44'/148'/0'`, bip39.mnemonicToSeedHex(mnemonic))
    const keypair = Kinesis.Keypair.fromRawEd25519Seed(data.key)
    return {
        public: keypair.publicKey(),
        secret: keypair.secret()
    }
}


getKeypairFromMnemonic('learn armed jeans aerobic depth frown ball drift proof muscle theory betray')

