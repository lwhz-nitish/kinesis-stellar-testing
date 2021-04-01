const Kinesis = require("js-kinesis-sdk");
// const stellarTx = require('./kinesis2')

const connection = {
  endpoint: "https://kau-testnet.kinesisgroup.io/",
  passphrase: "Kinesis UAT",
};

const request = {
  targetPayee: "GCNN2GHVSD6B663RQBYUBJ45LKNJBT4ENWT6XUZQY4UBRYJ644IF5B4B",
  amount: "1",
  memo: "abcdefghijklmnopqrstuvwxyzabc",
  fee: "100",
  sourceSecret: "SAP4FP44OLT7RVZZ4GEPY676P6OUISCE2E7ZTKZB53WAGEWSJHQJNMTW",
};

async function getTransactionsForAccount(address, limit, order) {
  Kinesis.Network.use(new Kinesis.Network(connection.passphrase));
  const server = new Kinesis.Server(connection.endpoint);

  const transactions = await server
    .transactions()
    .forAccount("GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B")
    .call();

  console.log(transactions._links);
}
// getTransactionsForAccount()
// console.log(await getTransactionsForAccount())

let doPayment = async () => {
  Kinesis.Network.use(new Kinesis.Network(connection.passphrase));
  const server = new Kinesis.Server(connection.endpoint);
  const sourceKeys = Kinesis.Keypair.fromSecret(request.sourceSecret);
  const acc = await server.loadAccount(sourceKeys.publicKey());
  const transaction = new Kinesis.TransactionBuilder(acc, { fee: request.fee })
    // .addOperation(
    //   Kinesis.Operation.payment({
    //     amount: request.amount,
    //     destination: request.targetPayee,
    //     asset: Kinesis.Asset.native(),
    //   })
    // )
    .addOperation(
      Kinesis.Operation.createAccount({
        destination: request.targetPayee,
        startingBalance: request.amount,
      })
    )
    // .addOperation(
    //     Kinesis.Operation.accountMerge({
    //         destination: request.targetPayee
    //     })
    // )
    // .addMemo(request.memo)
    .build();
  transaction.sign(sourceKeys);
  console.log(transaction);
  server
    .submitTransaction(transaction)
    .then((msg) => console.log("Sucess:", msg))
    .catch((err) => {
      // console.log("Error :", err.request)
      console.error("Error :", err);
      console.log("ErrorDetail :", err.data.extras);
    });
};

let importTx = async () => {
  txn = await stellarTx();
  Kinesis.Network.use(new Kinesis.Network(connection.passphrase));
  const server = new Kinesis.Server(connection.endpoint);
  server
    .submitTransaction(txn)
    .then((msg) => console.log("Sucess:", msg))
    .catch((err) => {
      // console.log("Error :", err.request)
      console.error("Error :", err);
      console.log("ErrorDetail :", err.response);
    });
};

let getOperationsForAccount = async () => {
  Kinesis.Network.use(new Kinesis.Network(connection.passphrase));
  const server = new Kinesis.Server(connection.endpoint);

  let acc = await server.loadAccount(request.targetPayee);
  const firstPage = await acc.operations({ order: "desc" });
  const isLastPageOrLastSeenTransactionHashFound = (ops) =>
    ops.records.some((op) => op.type === "create_account");
  const getAllOperationsSinceLastWithdrawal = async (page, allRecords = []) =>
    isLastPageOrLastSeenTransactionHashFound(page)
      ? allRecords.concat(page.records)
      : getAllOperationsSinceLastWithdrawal(
          await page.next(),
          allRecords.concat(page.records)
        );

  // console.log(await getAllOperationsSinceLastWithdrawal(firstPage))
  console.log(firstPage);
};

validateAddress = () => {
  let add = "GBUXCWNJQNZ73H4WRM36PS7FTZLUZCTGTTA3GZVGXEOI562WGC4X3BUX";
  try {
    Kinesis.Keypair.fromPublicKey(add);
    return true;
  } catch {
    return false;
  }
};

async function getPaymentsForAccount() {
  Kinesis.Network.use(new Kinesis.Network(connection.passphrase));
  const server = new Kinesis.Server(connection.endpoint);
  let acc = await (
    await server.loadAccount(
      "GDIENNQ3BXCTB74ZYCQAGXCY7KTGFBZGHRMUVF3ZLIW6SMAZIGX2JCCS"
    )
  ).operations({ limit: 100, order });
  // let val = await (await server.transactions().forAccount('GDITIX7PTPVNZZNDJWSAX4CRGKRHQMCK7A2LYO7Q2HAGLQFTQLGH654B').limit(100).call()).records
  console.log(acc.records.length);
}

async function doPaymentToAccount() {
  Kinesis.Network.use(new Kinesis.Network(connection.passphrase));
  const server = new Kinesis.Server(connection.endpoint);
  const { sequence } = await server.loadAccount(
    "GBGMVYDN4ECORMMTEIGS6FVX3IB5U6DV5JHG5XI33ZEOVSXKVDMVDYFX"
  );
  console.log(sequence);
}

function readTransaction() {
  // const transaction = new Kinesis.Transaction('AAAAANE0X++b6tzlo02kC/BRMqJ4MEr4NLw78NHAZcCzgsx/AAAAAAAG3jQASz3wAAAAMgAAAAAAAAABAAAACmhlbGxvIG1lbW8AAAAAAAEAAAAAAAAAAQAAAADRNF/vm+rc5aNNpAvwUTKieDBK+DS8O/DRwGXAs4LMfwAAAAAAAAAABfXhAAAAAAAAAAAA')
  const transaction = new Kinesis.Transaction(
    "AAAAANE0X++b6tzlo02kC/BRMqJ4MEr4NLw78NHAZcCzgsx/AAAAAAAG3jQASz3wAAAAMgAAAAAAAAABAAAACmhlbGxvIG1lbW8AAAAAAAEAAAAAAAAAAQAAAADRNF/vm+rc5aNNpAvwUTKieDBK+DS8O/DRwGXAs4LMfwAAAAAAAAAABfXhAAAAAAAAAAABs4LMfwAAAEAy1LKVV4laEy+fOUF+O6fv08G69UgtamXTwt9JaH5Hp4Bx/tmqQprGTPEa9Jlkpt03zZbXNPa4lFY703EsMBcK"
  );
  // const memo = transaction.memo.type === 'text' ? transaction.memo.value.toString() : null
  // const op = {
  //     operations: transaction.operations,
  //     sequence: transaction.sequence,
  //     fee: transaction.fee,
  //     source: transaction.source,
  //     memo: transaction.memo,
  //     signatures: transaction.signatures
  // }
  console.log(transaction.signatures);
}

// doPaymentToAccount()
// validateAddress()
doPayment();
// importTx()
// getOperationsForAccount()
// readTransaction()
