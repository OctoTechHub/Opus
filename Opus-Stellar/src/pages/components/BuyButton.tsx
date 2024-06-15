import axios from "axios"

const BuyButton=({Block,publickey,privatekey}:{Block:String,publickey:String|null,privatekey:String|null})=>{
  console.log(typeof Block)
  const onBuy=async(Block:String)=>{
    if(!publickey || !privatekey){
      console.error("Public key or Private key not found");
      return;
    }
    const response=await axios.post('http://localhost:3000/buy-block',{publickey:`${publickey}`,privatekey:`${privatekey}`,blockid:Block});
    console.log(response.data);

  }
    return(
      <div>
        <button className="buy-button " onClick={() => onBuy(Block)}>Buy Block</button>
      </div>
    )
}
export default BuyButton;