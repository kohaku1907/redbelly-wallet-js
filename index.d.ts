declare module 'redbelly-wallet-js' {
  export default class RedbellyWallet {
    constructor(network?: 'DEVNET' | 'TESTNET' | 'MAINNET');
    createWalletFromMnemonic(mnemonic: string): Promise<{
      privateKey: string;
      publicKey: string;
      address: string;
      mnemonic: string;
      balance: string;
    }>;
    isMetaMaskAvailable(): Promise<boolean>;
    connectMetaMask(): Promise<string>;
    getBalance(address: string): Promise<string>;
    sendTransactionWithMetaMask(to: string, amount: number): Promise<string>;
    sendTransaction(privateKey: string, to: string, amount: number): Promise<any>;
    isRedbellyNetworkConfigured(): Promise<boolean>;
    addRedbellyNetwork(): Promise<void>;
    fetchLatestPrice(): Promise<{ price: string; timestamp: number }>;
    fetchRBNTtoUSDRate(): Promise<number>;
  }
}