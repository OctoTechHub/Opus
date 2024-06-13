const mongoose = require('mongoose');
const url ="mongodb+srv://Haard18:Haard1808@cluster0.zuniu39.mongodb.net/stellar";
const { Schema } = mongoose;

const txnSchema = new Schema({
  blockID: String,
  amount: String,
  owner: {
    type: String,
    
  },
  transactionID: String,
  status: {
    type: String,
    enum: ['success', 'pending', 'failed']
  }
});

const txnModel = mongoose.model('txn', txnSchema);

const connectToMongoose = async () => {
  try {
    await mongoose.connect(url, { serverSelectionTimeoutMS: 30000 });
    console.log("Connected to mongoose");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1); 
  }
};

module.exports = { connectToMongoose, txnModel };