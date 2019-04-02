var bitgoUtxoLib = require('bitgo-utxo-lib');
var bip32utils = require('bip32-utils');
var bs58check = require('bs58check');

// Hierarchical Deterministic wallet
function phraseToHDWallet(phraseStr) {
  // Seed key, make it fucking strong
  // phraseStr: string
  const seedHex = Buffer.from(phraseStr).toString('hex');

  //Set Network
  let network = bitgoUtxoLib.networks['bitcoinz'];

  // chains
  const hdNode = bitgoUtxoLib.HDNode.fromSeedHex(seedHex, network);
  var chain = new bip32utils.Chain(hdNode);

  // Creates 42 address from the same chain
  for (var k = 0; k < 42; k++){
    chain.next();
  }

  // Get private keys from them
  var privateKeys = chain.getAll().map((x) => chain.derive(x).keyPair.toWIF());
  
  return privateKeys;
}

module.exports = {
  phraseToHDWallet: phraseToHDWallet  
};