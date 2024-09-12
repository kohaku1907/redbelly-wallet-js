const Web3 = require('web3');
const bip39 = require('bip39');
const ethUtil = require('ethereumjs-util');
const hdkey = require('hdkey');

class RedbellyWallet {
  constructor(rpcUrl) {
    this.rpcUrl = rpcUrl;
    this.web3 = new Web3(rpcUrl);
  }

  async createWalletFromMnemonic(mnemonic) {
    try {
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase');
      }

      const seed = await bip39.mnemonicToSeed(mnemonic);
      const root = hdkey.fromMasterSeed(seed);
      const addrNode = root.derive("m/44'/60'/0'/0/0");
      const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
      const addr = ethUtil.publicToAddress(pubKey).toString('hex');
      const address = ethUtil.toChecksumAddress('0x' + addr);
      const privateKey = addrNode._privateKey.toString('hex');

      const balance = await this.web3.eth.getBalance(address);

      return {
        address,
        privateKey,
        publicKey: pubKey.toString('hex'),
        mnemonic,
        balance: this.web3.utils.fromWei(balance, 'ether')
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  }

  async isMetaMaskAvailable() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  }

  async connectMetaMask() {
    if (await this.isMetaMaskAvailable()) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        throw error;
      }
    } else {
      throw new Error('MetaMask is not installed');
    }
  }

  async getBalance(address) {
    const balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, 'ether');
  }

  async sendTransactionWithMetaMask(to, amount) {
    if (!(await this.isMetaMaskAvailable())) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const from = accounts[0];

      if (!from) {
        throw new Error('No account found. Please connect to MetaMask.');
      }

      const valueInWei = web3.utils.toWei(amount.toString(), 'ether');
      const valueHex = web3.utils.toHex(valueInWei);

      // Get the current gas price
      const gasPrice = await web3.eth.getGasPrice();

      // Estimate gas for the transaction
      const estimatedGas = await web3.eth.estimateGas({
        from: from,
        to: to,
        value: valueHex
      });

      const tx = {
        from: from,
        to: to,
        value: valueHex,
        gas: web3.utils.toHex(estimatedGas),
        gasPrice: web3.utils.toHex(gasPrice),
      };

      const receipt = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [tx],
      });
      return receipt;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }

  async sendTransaction(privateKey, to, amount) {
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.add(account);

    const gasPrice = await this.web3.eth.getGasPrice();
    const nonce = await this.web3.eth.getTransactionCount(account.address);

    const tx = {
      from: account.address,
      to: to,
      value: this.web3.utils.toWei(amount.toString(), 'ether'),
      gas: 21000,
      gasPrice: gasPrice,
      nonce: nonce
    };

    const signedTx = await this.web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
  }

  async isRedbellyNetworkConfigured() {
    if (!(await this.isMetaMaskAvailable())) {
      return false;
    }
  
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId === '0x98'; // Assuming Redbelly's chainId is 152 (0x98 in hex)
  }

  async addRedbellyNetwork() {
    if (!(await this.isMetaMaskAvailable())) {
      throw new Error('MetaMask is not installed');
    }
  
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x98', // 152 in decimal
          chainName: 'Redbelly Network Devnet',
          nativeCurrency: {
            name: 'Redbelly Coin',
            symbol: 'RBNT', // Replace with actual symbol
            decimals: 18
          },
          rpcUrls: [this.rpcUrl],
          blockExplorerUrls: ['https://explorer.devnet.redbelly.network/'] // Replace with actual explorer URL
        }]
      });
    } catch (error) {
      console.error('Failed to add Redbelly network:', error);
      throw error;
    }
  }
}

module.exports = RedbellyWallet;