import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

interface TransactionData {
  _id: string;
  txnHash: string;
  blockId: string;
  Owner: string;
  __v: number;
}

const Transaction = () => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/allowners");
        const transactionsData: TransactionData[] = response.data;
        setTransactions(transactionsData);
        console.log("Transactions:", transactionsData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const { _id, txnHash, blockId, Owner } = transaction;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      _id.toLowerCase().includes(lowerCaseSearchTerm) ||
      txnHash.toLowerCase().includes(lowerCaseSearchTerm) ||
      blockId.toLowerCase().includes(lowerCaseSearchTerm) ||
      Owner.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-gray-800 to-black font-mono">
        <div className="container mx-auto p-4 text-white">
            <div className="mt-8 px-2  rounded-lg bg-slate-900  to-black text-white rounded-lg p-4 mb-4 font-mono">
          <h2 className="text-2xl font-bold mb-4 text-left">All Block Transactions</h2>
           </div>
          <div className="mb-4 flex justify-center">
            <input
              type="text"
              className="border-2 border-gray-400 px-4 py-2 w-full max-w-md bg-gradient-to-br from-gray-800 to-black"
              placeholder="Search transactions"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-4 py-2">Transaction ID</th>
                  <th className="px-4 py-2">Transaction Hash</th>
                  <th className="px-4 py-2">Block ID</th>
                  <th className="px-4 py-2">Owner</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="bg-gray-800">
                    <td className="border px-4 py-2">{transaction._id}</td>
                    <td className="border px-4 py-2">{transaction.txnHash}</td>
                    <td className="border px-4 py-2">{transaction.blockId}</td>
                    <td className="border px-4 py-2">{transaction.Owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transaction;
