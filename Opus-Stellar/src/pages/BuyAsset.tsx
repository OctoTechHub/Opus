import axios from "axios";
import { useState } from "react";

const BuyAsset = () => {
    const publicKey = localStorage.getItem('publickey');
    const [funded, setFunded] = useState<boolean>(false);
    const privateKey = localStorage.getItem('privatekey');
    const [fetchLoading, setFetchLoading] = useState<boolean>(false);
    const [balance, setBalance] = useState<number | null>(null);
    const [funding, setFunding] = useState<boolean>(false);
    const [numTokens, setNumTokens] = useState<String>(""); // New state for number of tokens to buy
    const [assetCount, setAssetCount] = useState<number>(0);
    const fetchAccountDetails = async () => {
        setFetchLoading(true);
        const response = await axios.get(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
        console.log(response.data);
        setBalance(response.data.balances[1].balance);
        setFetchLoading(false);
    }

    const fundAccount = async () => {
        setFunding(true);
        const response = await fetch("http://localhost:3000/fund-account/" + publicKey);
        console.log(response.json());
        setFunded(true);
        setFunding(false);
    }

    const buyTokens = async () => {
        // Implement the logic to buy the selected number of tokens
        if (!privateKey) {
            console.error("Private key not found");
            return;
        }
        const response=await axios.post("http://localhost:3000/buy-tokens", {
            secret: privateKey,
            amount: numTokens
        
        })
        console.log(`Buying ${numTokens} OP tokens...`);
    }
    const fetchassetcount = async () => {
        const response = await fetch("http://localhost:3000/fetch-OpusToken/" + publicKey);
        console.log(response.json());
        // setAssetCount(response.json().);
    }

    return (
        <div className="flex justify-center w-screen bg-black items-center h-screen">
            <div className="flex bg-blue-600 px-30 text-white rounded-lg px-5 py-10 gap-5 justify-center flex-col text-center">
                <p className="text-2xl">Get your Account Details and buy OP Tokens to enter the Metaverse</p>
                <p>Rate of OP Token is</p>
                <p>1 OP = 10 XLM</p>
                <div className="w-full flex flex-col gap-3 justify-between">
                    <div className="flex gap-2 justify-center">
                        <input
                            type="text"
                            
                            onChange={(e) => setNumTokens(e.target.value)}
                            className="px-2 py-2 rounded-lg bg-slate-800"
                        />
                        <button onClick={buyTokens} className="px-2 py-2 rounded-lg bg-slate-800">
                            Buy
                        </button>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <button disabled={funded ? true : false} onClick={fundAccount} className="px-2 py-2 rounded-lg bg-slate-800">
                            Fund your Account
                        </button>
                        {funding ? 'Funding...' : 'Funded'}
                        <button onClick={fetchAccountDetails} className="px-2 py-2 rounded-lg bg-slate-800">
                            Fetch Funds
                            {fetchLoading ? 'Loading...' : balance}
                        </button>
                        <button onClick={fetchassetcount} className="px-2 py-2 rounded-lg bg-slate-800">
                            Fetch Asset Count
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyAsset;