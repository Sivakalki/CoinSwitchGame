'use client';
import { useEffect, useState } from 'react';
import { Button, Typography } from 'antd';
import { ethers } from 'ethers';
import CoinFlip from './coinflip';

import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
// const { Title } = Typography;

export default function Home() {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [provider, setProvider] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [betAmount, setBetAmount] = useState<string>("");
  const [balance, setBalance] = useState<string>("0.00");
  const [result, setResult] = useState<string>("");
  const contractAddress = "0x2ec36f854EAA279bc8781209fCf59a52C9485751";
  const contractABI: any = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "result",
          "type": "bool"
        }
      ],
      "name": "Flipped",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "flipCoin",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ];

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts: any = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
  
        const provider: any = new ethers.BrowserProvider(window.ethereum); // Using BrowserProvider
        setProvider(provider);
  
        const signer: any = await provider.getSigner(); // Get the signer from provider
        const contract: any = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
  
        const balance: any = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance));
  
        console.log("Connected with address:", accounts[0]); // Use the account directly
      } catch (err: any) {
        console.error("Failed to connect wallet:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const updateBalance = async () => {
    if (provider && walletAddress) {
      try {
        const balance2: any = await provider.getBalance(walletAddress);
        setBalance(ethers.formatEther(balance2));
      } catch (err: any) {
        console.error("Failed to fetch balance:", err);
      }
    }
  };

  const flipCoin = async (heads: boolean) => {
    if (contract) {
      try {
        const betAmountBigNumber: any = ethers.parseEther(betAmount);
        
        if (betAmountBigNumber.isZero()) {
          setResult("Please enter a valid bet amount.");
          return;
        }
        
        const tx: any = await contract.flipCoin(heads, { value: ethers.parseEther(betAmount) });
        await tx.wait();
        setResult("Transaction complete! Check your MetaMask for details.");
      } catch (err: any) {
        console.error("Transaction failed:", err);
        setResult("Transaction failed. Check console for details.");
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Welcome to the Coin Flip Game!</h1>
      
      {!walletAddress ? (
        <Button type="primary" onClick={connectWallet} style={{ width: '100%' }}>
          Connect Wallet
        </Button>
      ) : (
        <div>
          <p>Connected: {walletAddress}</p>
          <h2>Balance is : <p className='text-green-500'>{balance}</p></h2>
          {/* {contract && <CoinFlipGame contract={contract} />} Pass contract to CoinFlipGame */}
          {walletAddress && contract && (
          <CoinFlip contract={contract} walletAddress={walletAddress} updateBalance={updateBalance} />
        )}
        </div>
      )}
    </div>
  );
}
