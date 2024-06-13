import mongoose, { Schema, Document } from 'mongoose';

const url = "mongodb+srv://Haard18:Haard1808@cluster0.zuniu39.mongodb.net/stellar";

interface Transaction extends Document {
  blockID: string;
  amount: string;
  owner: string;
  transactionID: string;
  status: 'success' | 'pending' | 'failed';
}

const txnSchema: Schema<Transaction> = new Schema({
  blockID: String,
  amount: String,
  owner: String,
  transactionID: String,
  status: {
    type: String,
    enum: ['success', 'pending', 'failed'],
  },
});

const txnModel = mongoose.model<Transaction>('txn', txnSchema);

const connectToMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to mongoose");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
};

export { connectToMongoose, txnModel };
