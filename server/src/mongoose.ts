import mongoose from 'mongoose';
const txnSchema = new mongoose.Schema({
    txnHash:String,
    blockId:String,
    Owner:String,
});
const Txn = mongoose.model('Txn', txnSchema);
export default Txn;
