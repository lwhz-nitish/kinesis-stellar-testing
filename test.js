// const request = require("request");
// const moment = require("moment");
const fetch = require('node-fetch')
let URLResponse;
let KEMMainnetArray = [
    "https://kem-mainnet-america1.kinesisgroup.io:3000",
    "https://kem-mainnet-america0.kinesisgroup.io:3000",
    "https://kem-mainnet-oceania1.kinesisgroup.io:3000",
    "https://kem-mainnet-asia1.kinesisgroup.io:3000",
    "https://kem-mainnet-europe1.kinesisgroup.io:3000",
];

const test = async () => {
    URLResponse = await Promise.all(
        KEMMainnetArray.map(async (url) => {
            try {
                return await fetch(url).then(res => res.json());
            } catch (error) {
                return { "error": `node not found` };
            }
        })
    );

    URLResponse.forEach(node => {
        if (node.error) {
            // console.log("node has error")
        } else {
            console.log("Node is fine")
        }
    })
    console.log(URLResponse)
}

test()

// const res = fetch("https://kem-mainnet-asia1.kinesisgroup.io:3000").then(res => res.json()).then(val => val)


// const test = async () => {
//     let KEMMainnetArray = [
//         // "https://kem-mainnet-america1.kinesisgroup.io:3000",
//         // "https://kem-mainnet-america0.kinesisgroup.io:3000",
//         "https://kem-mainnet-oceania1.kinesisgroup.io:3000",
//         "https://kem-mainnet-asia1.kinesisgroup.io:3000",
//         "https://kem-mainnet-europe1.kinesisgroup.io:3000",
//     ];


//     const URLResponse = KEMMainnetArray.map(async url => {
//         return await fetch(url).then(res => res.json())
//     })

//     console.log(URLResponse)

//     //   let date = moment().format("hh:mm DD-MM-YY");
//     //   let kemData = " \n" + " date: " + date + "(GMT)" + "\n";

//     //   for (let index = 0; index < URLResponse.length; index++) {
//     //     let responseData = URLResponse[index];
//     //     console.log(responseData,"responseData")
//     //     console.log(responseData[index],"responseData[index]")
//     //     if (responseData[index]) {
//     //       console.log("URLResponse", URLResponse[index]);
//     //       let resBody = JSON.parse(responseData);
//     //       let region = URLResponse[index].split("-")[2].split(".")[0];
//     //       let node1ResponseObject = resBody.node1.info.quorum.qset;
//     //       let node1QuorumKey = Object.keys(node1ResponseObject)[0];
//     //       let node1AgreeCount = node1ResponseObject[node1QuorumKey];

//     //       kemData = kemData + " region: " + region + "\n";

//     //       if (node1AgreeCount < 4) {
//     //         kemData =
//     //           kemData +
//     //           "Node0 - Quorum Count is: " +
//     //           node1AgreeCount +
//     //           " remaining of 4" +
//     //           "\n";
//     //       }
//     //     } else {
//     //       console.log("ERROR");
//     //     }
//     //   }
//     //   // let responseData = URLResponse[index];
//     //   // let dataParsed = JSON.parse(URLResponse[index]);
//     //   // console.log(dataParsed["error"], ":::::::::::");

//     //   // if (dataParsed["error"]) {
//     //   // } else {

//     //   // }

//     //   if (kemData.length > 100) {
//     //     console.log("This Function is called");
//     //     await httpRequest(
//     //       "https://hooks.zapier.com/hooks/catch/8736770/op473yi/?nodes=" +
//     //         kemData +
//     //         "&date=" +
//     //         date,
//     //       "post",
//     //       { "Content-Type": "application/json" }
//     //     );
//     //   }
//     //   console.log("KEM Data", kemData);
//     //   console.log("KEM Data", kemData.length);
// };

// function httpRequest(url, method, headers) {
//     return new Promise(function (fulfill, reject) {
//         request(
//             { url: url, method: method, headers: headers },
//             function (error, response, body) {
//                 if (error) {
//                     reject(error);
//                 } else {
//                     fulfill(body);
//                 }
//             }
//         );
//     });
// }
// test();
