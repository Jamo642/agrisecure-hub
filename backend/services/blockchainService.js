const { ethers } = require('ethers');
const crypto = require('crypto');

class BlockchainService {
  constructor() {
    this.provider = null;
    this.wallet = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      if (process.env.BLOCKCHAIN_PROVIDER_URL) {
        this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_PROVIDER_URL);
        
        if (process.env.BLOCKCHAIN_PRIVATE_KEY) {
          this.wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, this.provider);
        }
        
        this.initialized = true;
        console.log('Blockchain service initialized');
      } else {
        console.log('Blockchain service running in simulation mode');
      }
    } catch (error) {
      console.error('Blockchain initialization error:', error);
    }
  }

  generateAddress() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase
    };
  }

  async createTransactionHash(transactionData) {
    const dataString = JSON.stringify({
      userId: transactionData.userId,
      amount: transactionData.amount,
      type: transactionData.transactionType,
      timestamp: new Date().toISOString(),
      nonce: crypto.randomBytes(16).toString('hex')
    });

    const hash = crypto.createHash('sha256').update(dataString).digest('hex');
    
    if (this.initialized && this.wallet) {
      try {
        const message = `AgriNova Transaction: ${hash}`;
        const signature = await this.wallet.signMessage(message);
        return {
          hash: `0x${hash}`,
          signature: signature,
          verified: true
        };
      } catch (error) {
        console.error('Blockchain signing error:', error);
      }
    }

    return {
      hash: `0x${hash}`,
      signature: null,
      verified: false,
      simulated: true
    };
  }

  async verifyTransaction(hash, signature) {
    if (!this.initialized || !signature) {
      return { valid: false, message: 'Blockchain verification not available' };
    }

    try {
      const message = `AgriNova Transaction: ${hash}`;
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      return {
        valid: recoveredAddress.toLowerCase() === this.wallet.address.toLowerCase(),
        message: 'Transaction verified on blockchain',
        recoveredAddress: recoveredAddress
      };
    } catch (error) {
      return { valid: false, message: 'Verification failed', error: error.message };
    }
  }

  async recordTransaction(transaction) {
    const blockchainData = await this.createTransactionHash(transaction);
    
    return {
      blockchainHash: blockchainData.hash,
      signature: blockchainData.signature,
      verified: blockchainData.verified,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new BlockchainService();
