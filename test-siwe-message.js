// Test script to see what the SIWE message looks like
const { SiweMessage } = require('siwe');

const message = new SiweMessage({
  domain: 'localhost:3000',
  address: '0x1234567890123456789012345678901234567890',
  statement: 'Sign in to CaribEX with your Ethereum wallet',
  uri: 'http://localhost:3000',
  version: '1',
  chainId: 1,
  nonce: 'test1234',
  issuedAt: new Date().toISOString(),
});

const messageString = message.prepareMessage();
console.log('SIWE Message:');
console.log(messageString);
console.log('\nLine count:', messageString.split('\n').length);
console.log('\nLines:');
messageString.split('\n').forEach((line, i) => {
  console.log(`${i + 1}: "${line}"`);
});
