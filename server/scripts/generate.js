const elliptic = require('elliptic');

// Create a new instance of the secp256k1 curve
const curve = new elliptic.ec('secp256k1');

// Generate a random key pair
const keyPair = curve.genKeyPair();
const privateKey = keyPair.getPrivate();
const publicKey = keyPair.getPublic();

console.log('privateKey:', privateKey.toString('hex'));
console.log('publicKey:', publicKey.encode('hex').substring(publicKey.encode('hex').length - 20));