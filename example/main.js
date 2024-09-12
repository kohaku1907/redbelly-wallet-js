const RedbellyWallet = require('../src/wallet');
const bip39 = require('bip39');
// Replace with your actual Redbelly RPC URL
const rpcUrl = 'https://rbn-gcp-australia-southeast1-a-0-b-v2.devnet.redbelly.network:8545';
const wallet = new RedbellyWallet(rpcUrl);

async function generateMnemonic() {
    try {
        // Generate a random mnemonic (12 words)
        const mnemonic = bip39.generateMnemonic(128); // 128 bits = 12 words
        console.log('Generated mnemonic:', mnemonic);
        return mnemonic;
    } catch (error) {
        console.error('Error generating mnemonic:', error);
    }
}

async function main() {
    try {
        // Create a new wallet
        console.log('Creating a new wallet...');
        const mnemonic = await generateMnemonic();
        const account = await wallet.createWalletFromMnemonic(mnemonic);
        console.log('New wallet created:', account);

        // Check balance
        console.log('Checking balance...');
        const balance = await wallet.getBalance(account.address);
        console.log('Wallet balance:', balance, 'RBNT');

        // Send a transaction
        console.log('Sending a transaction...');
        const toAddress = '0x7Da7B3a2C1d7cDc9f9eC76DEF6cEb1a0A51345D2'; // Replace with a valid address
        const amount = 0.001; // in RBNT
        const receipt = await wallet.sendTransaction(account.privateKey, toAddress, amount);
        console.log('Transaction sent:', receipt.transactionHash);

        // Check balance again
        console.log('Checking balance after transaction...');
        const newBalance = await wallet.getBalance(account.address);
        console.log('New wallet balance:', newBalance, 'RBNT');

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main();