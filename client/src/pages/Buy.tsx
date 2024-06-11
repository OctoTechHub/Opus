import  {  SetStateAction, useEffect, useState } from "react";
import StellarSdk from "@stellar/stellar-sdk";

const BuyerComponent = () => {
  const [buyDetails, setBuyDetails] = useState(null);

  useEffect(() => {
    const server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

    const buyerKeys = StellarSdk.Keypair.fromSecret(
      "SANRKWZ23NIWJZY6V5KLSGATGF7ETVOY6JD5LGRR6YCYIXBNJZ6ODRSV"
    );

    const NewDollar = new StellarSdk.Asset(
      "NewDollar",
      "GBHJPRV5XBJKYKCXBVHSCIBGPCSDIBHFECAGRXKOHANLLAUXEUQ22ZJE"
    );

    server
      .loadAccount(buyerKeys.publicKey())
      .then((buyer: any) => {
        const transaction = new StellarSdk.TransactionBuilder(buyer, {
          fee: "100",
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.changeTrust({
              asset: NewDollar,
              limit: "1000",
            })
          )
          .setTimeout(100)
          .build();
        transaction.sign(buyerKeys);
        return server.submitTransaction(transaction);
      })
      .then((result: SetStateAction<null>) => {
        console.log(result);
        setBuyDetails(result);
      })
      .then(() => {
        return server.loadAccount(buyerKeys.publicKey());
      })
      .then((buyer: any) => {
        const transaction = new StellarSdk.TransactionBuilder(buyer, {
          fee: "100",
          networkPassphrase: StellarSdk.Networks.TESTNET,
        })
          .addOperation(
            StellarSdk.Operation.manageBuyOffer({
              selling: StellarSdk.Asset.native(),
              buying: NewDollar,
              buyAmount: "10",
              price: "1",
            })
          )
          .setTimeout(100)
          .build();
        transaction.sign(buyerKeys);
        return server.submitTransaction(transaction);
      })
      .then((result: SetStateAction<null>) => {
        console.log(result);
        setBuyDetails(result);
      })
      .catch((error: any) => {
        console.error("Error!", error);
      });
  }, []);

  return (
    <div>
      <h2>Buyer Component</h2>
      {buyDetails && (
        <div>
          <h3>Buy Details</h3>
          <p>Transaction ID: {buyDetails}</p>
        </div>
      )}
    </div>
  );
};

export default BuyerComponent;
