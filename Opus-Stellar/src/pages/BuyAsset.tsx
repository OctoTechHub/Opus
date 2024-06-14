import axios from "axios";
import { useState } from "react";

const BuyAsset = () => {
    const publicKey = localStorage.getItem('publickey');
    // const funded=false;
    const[funded,setfunded]=useState<boolean>(false);
    const privateKey = localStorage.getItem('privatekey');
    const [fetchLoading, setFetchLoading] = useState<boolean>(false);
    const [balance, setbalance] = useState<number | null>(null);
    const[funding,setfunding]=useState<boolean>(false);
    const fetchaccountDetails = async () => {
        setFetchLoading(true);
        const response = await axios.get(`https://horizon-testnet.stellar.org/accounts/${publicKey}`);
        console.log(response.data);
        setbalance(response.data.balances[0].balance);
        setFetchLoading(false);
    }
    const fundaccount = async () => {
        setfunding(true);
        const response=await fetch("http://localhost:3000/fund-account/"+publicKey)
        console.log(response.json());
        setfunded(true);
        setfunding(false);
    }
    return (
        <div className="flex justify-center w-screen bg-black items-center h-screen">
            <div className="flex bg-blue-600 px-30 text-white rounded-lg px-5 py-10 gap-5 justify-center flex-col text-center">
                <p className="text-2xl">Get your Account Details and buy OP Tokens to enter the Metaverse</p>
                <p>Rate of OP TOken is</p>
                <p>1 OP = 1 XLM</p>
                <div className=" w-full flex justify-between w">
                    <button disabled={funded?true:false} onClick={fundaccount} className="px-2 py-2 rounded-lg bg-slate-800">
                        Fund your Account
                    </button>
                    {funding ? 'Funding...' : 'Funded'}
                    <button onClick={fetchaccountDetails} className="px-2 py-2 rounded-lg bg-slate-800">
                        FetchFunds
                        {fetchLoading ? 'Loading...' : balance}
                    </button>
                </div>
            </div>
        </div>
    )
}
export default BuyAsset;