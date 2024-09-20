# Redbelly Wallet JS

A JavaScript library for interacting with Redbelly blockchain wallets.

## Installation

```bash
npm install redbelly-wallet-js
```

## Usage

```javascript
const RedbellyWallet = require('redbelly-wallet-js');
const network = 'DEVNET'; // or 'TESTNET' or 'MAINNET'
const wallet = new RedbellyWallet(network);
// Create a new wallet from mnemonic
const mnemonic = 'your twelve word mnemonic phrase here';
wallet.createWalletFromMnemonic(mnemonic)
.then(account => console.log(account))
.catch(error => console.error(error));
// Get balance
wallet.getBalance('0x1234567890123456789012345678901234567890')
.then(balance => console.log(balance))
.catch(error => console.error(error));
// Send transaction
const privateKey = 'your private key here';
const toAddress = '0x1234567890123456789012345678901234567890';
const amount = 1.5; // in Ether
wallet.sendTransaction(privateKey, toAddress, amount)
.then(receipt => console.log(receipt))
.catch(error => console.error(error));
```

## License

MIT
