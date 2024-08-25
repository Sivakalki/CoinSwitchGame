// components/CoinFlip.tsx
import { useState } from 'react';
import { Button, Input, Alert } from 'antd';
import { ethers } from 'ethers';
interface CoinFlipProps {
    contract: ethers.Contract | null;
    walletAddress: string;
    updateBalance: () => void;
}

const CoinFlip: React.FC<CoinFlipProps> = ({ contract, walletAddress, updateBalance }) => {
    const [betAmount, setBetAmount] = useState<string>("");
    const [result, setResult] = useState<string>("");

    const flipCoin = async (heads: boolean) => {
        if (contract && walletAddress) {
            try {
                console.log("enteredh here")
                const betAmountBigNumber = ethers.parseEther(betAmount);

                // if (betAmountBigNumber.eq(ethers.toNumber(0))) {
                //   setResult("Please enter a valid bet amount.");
                //   return;
                // }

                const simulatedResult = Math.random() < 0.5; // true for heads, false for tails
                const win = simulatedResult === heads;

                // Call the contract method

                // Convert BigNumber to string for contract method
                const tx = await contract.flipCoin(heads, { value: betAmountBigNumber.toString() });
                const receipt = await tx.wait();

                const event = receipt.events?.find((event:any) => event.event === 'Flipped');
                if (event) {
                    const [user, result] = event.args as [string, boolean];
                    if (user.toLowerCase() === walletAddress.toLowerCase()) {
                        setResult(result ? "You won! Check your balance for updated amount." : "You lost. Better luck next time.");
                        await updateBalance(); // Update balance after transaction
                    }
                }
            } catch (err) {
                console.error("Transaction failed:", err);
                setResult("Transaction failed. Check console for details.");
            }
        }
    };

    return (
        <div>
            <Input
                placeholder="Enter bet amount in ETH"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                type="number"
                step="0.01"
                style={{ width: '100%' }}
            />
            <Button type="primary" onClick={() => flipCoin(true)} style={{ marginRight: '1rem' }}>
                Flip Heads
            </Button>
            <Button type="dashed" onClick={() => flipCoin(false)}>
                Flip Tails
            </Button>
            {result && <Alert message={result} type="info" showIcon style={{ marginTop: '1rem' }} />}
        </div>
    );
};

export default CoinFlip;
