import axios from "axios";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";

const BuyAsset = () => {
  const publicKey = localStorage.getItem("publickey");
  const privateKey = localStorage.getItem("privatekey");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [opTokens, setOpTokens] = useState<number>(0); 
  const [funding, setFunding] = useState(false);
  const [funded, setFunded] = useState(false);
  const [numTokens, setNumTokens] = useState<string>("");
  const [transactions, setTransactions] = useState<any[]>([]); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccountDetails();
    fetchTransactions();
    fetchOpTokenBalance();
  }, []);

  const fetchAccountDetails = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(
        `https://horizon-testnet.stellar.org/accounts/${publicKey}`
      );
      console.log(response.data);
      setBalance(response.data.balances[0].balance);
    } catch (error) {
      console.error("Error fetching account details:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const fundAccount = async () => {
    try {
      setFunding(true);
      const response = await fetch(`http://localhost:3000/fund-account/${publicKey}`);
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success("Account funded successfully!");
        setFunded(true);
      } else {
        toast.error("Failed to fund account. Please try again.");
      }
    } catch (error) {
      console.error("Error funding account:", error);
      toast.error("Failed to fund account. Please try again.");
    } finally {
      setFunding(false);
    }
  };

  const buyTokens = async () => {
    if (!privateKey) {
      console.error("Private key not found");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/buy-tokens", {
        secret: privateKey,
        amount: numTokens
      });
      console.log(response.data);
      const boughtTokens = parseInt(numTokens, 10); 
      const updatedOpTokens = opTokens + boughtTokens; 
      setOpTokens(updatedOpTokens); 
      localStorage.setItem("optokens", updatedOpTokens.toString()); 
      toast.success(`Successfully bought ${numTokens} OP tokens!`);
      fetchTransactions(); 
    } catch (error) {
      console.error("Error buying tokens:", error);
      toast.error("Failed to buy tokens. Please try again.");
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`https://horizon-testnet.stellar.org/accounts/${publicKey}/transactions`);
      console.log(response.data);
      const filteredTransactions = response.data._embedded.records.filter((transaction: { source_account: string | null; }) => {
        return transaction.source_account === publicKey;
      });
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchOpTokenBalance = () => {
    const storedOpTokens = localStorage.getItem("optokens");
    if (storedOpTokens) {
      setOpTokens(parseInt(storedOpTokens, 10));
    }
  };

  const handleBuyLand = () => {
    navigate('/buyLand');
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center w-screen bg-gradient-to-br from-gray-800 to-black items-center h-screen">
        <ToastContainer />
        <div className="flex bg-blue-600 px-10 text-white rounded-lg px-5 py-10 gap-5 justify-center flex-col text-center">
          <p className="text-4xl font-semibold">Manage Your Account Purchase OP Tokens</p>
          <p className="text-4xl font-semibold">Purchase OP Tokens</p>
          <p className="text-xl font-semibold">Rate of OP Token: 1 OP = 1 XLM</p>
          <div className="flex justify-between items-center w-full mt-8">
            <button
              disabled={funded}
              onClick={fundAccount}
              className={`px-4 py-2 rounded-lg bg-slate-800 ${funded ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {funding ? "Funding..." : "Fund Your Account"}
            </button>
            <button
              onClick={fetchAccountDetails}
              className="px-4 py-2 rounded-lg bg-slate-800"
            >
              {fetchLoading ? "Loading..." : `Check Balance ${balance !== null ? `: ${balance}` : "XLM"}`}
            </button>
          </div>
          <div className="flex gap-2 justify-center w-full mt-4">
            <input
              type="text"
              placeholder="Enter number of tokens"
              value={numTokens}
              onChange={(e) => setNumTokens(e.target.value)}
              className="px-2 py-2 rounded-lg bg-slate-800 w-full"
            />
            <button onClick={buyTokens} className="px-4 py-2 rounded-lg bg-slate-800">
              Buy Tokens
            </button>
          </div>
          <div className="flex justify-center w-full mt-4">
            <button
              onClick={handleBuyLand}
              className="px-4 py-2 rounded-lg bg-slate-800"
            >
              Buy Land
            </button>
          </div>
          
          <div className="mt-8">
            <div className="px-2 py-2 rounded-lg bg-slate-900  to-black text-white rounded-lg p-4 mb-4">
              <p className="text-xl font-semibold">Transaction History:</p>
            </div>
            <div className="overflow-y-auto max-h-40">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="border rounded-md p-2 mb-2">
                  <p className="text-sm">ID: {transaction.id}</p>
                  <p className="text-sm">Type: {transaction.type}</p>
                  <p className="text-sm">Created At: {transaction.created_at}</p>
                  <p className="text-sm">Amount: {transaction.amount}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-xl font-semibold">OP Token Balance: {opTokens}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyAsset;
