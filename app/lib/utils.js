import Promise from 'bluebird'
import bs58check from 'bs58check';

/*
 * Converts a private key to WIF format
 * @param {String} privKey (private key)
 * @param {boolean} toCompressed (Convert to WIF compressed key or nah)
 * @param {string} wif (wif hashing bytes (default: 0x80))
 * @return {Sting} WIF format (uncompressed)
 */
function privKeyToWIF(privKey, toCompressed, wif) {
  toCompressed = toCompressed || false;
  wif = wif || zconfig.mainnet.wif;

  if (toCompressed) privKey = privKey + '01';

  return bs58check.encode(Buffer.from(wif + privKey, 'hex'));
}

// Debounce promise
function promiseDebounce(fn, delay, count) {
  var working = 0, queue = [];
  function work() {
    if ((queue.length === 0) || (working === count)) return;
    working++;
    Promise.delay(delay).tap(function () { working--; }).then(work);
    var next = queue.shift();
    next[2](fn.apply(next[0], next[1]));
  }
  return function debounced() {
    var args = arguments;
    return new Promise(function(resolve){
      queue.push([this, args, resolve]);
      if (working < count) work();
    }.bind(this));
  }
}

// Append url
function urlAppend(url, param){
  if (url.substr(-1) !== '/'){
    url = url + '/'
  }

  return url + param
}

/*
 * Given a WIF format pk, convert it back to the original pk
 * @param {String} privKey (private key)
 * @return {Sting} Public Key (uncompressed)
 */
function WIFToPrivKey(wifPk) {
  var og = bs58check.decode(wifPk, 'hex').toString('hex');
  og = og.substr(2, og.length); // remove WIF format ('80')

  // remove the '01' at the end to 'compress it' during WIF conversion
  if (og.length > 64) {
    og = og.substr(0, 64);
  }

  return og;
}

module.exports = {
  privKeyToWIF: privKeyToWIF,
  promiseDebounce: promiseDebounce,
  urlAppend: urlAppend,
  WIFToPrivKey: WIFToPrivKey,
}