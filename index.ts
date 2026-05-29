import express from 'express'
import cors from 'cors';
import { client } from './redis-client';
import { matchBuy, matchSell } from './lib';

const app = express();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    
  res.send('Hello World')
})

export interface Orderbook {
    symbol: string;
    bids: {
        orderId : string,
        userId : string
        price: string; 
        quantity: string
     }[];
    asks: {
        orderId : string,
        userId : string
        price: string; 
        quantity: string
    
    }[];
  }

export interface Order {
    userId : string,
    symbol : string,
    side : "long" | "short",
    type : "limit" | "market",
    price : number,
    quantity : number,
    leverage : number,
    postOnly : boolean,
    clientOrderId : string
}

export interface User {

}
  


app.post("/api/users",async (req,res) => {
    
    const { userId, initialBalance } = req.body;

    await client.set(`user-${userId}`, initialBalance);



    res.json({
        userId: "alice"
    }).status(200)

})


app.get("/api/orderbook/:symbol",async (req,res) => {

    const symbol = req.params.symbol;

    const get_orderbook = await client.get(`orderbook-${symbol}`);

    if(get_orderbook){
       
        console.log("fetching orderbook ...");

        const orderbook : Orderbook = JSON.parse(get_orderbook);

        return res.json({orderbook}).status(200)
    }else{

        console.log("creating orderbook ...");

        const orderbook : Orderbook = {
            symbol : symbol,
            bids : [],
            asks : []
        } 

        await client.set(`orderbook-${symbol}`,JSON.stringify(orderbook));

        return res.json({
            orderbook
        }).status(200)

    }


})


app.post("/api/orders",(req,res) => {

    const data : Order = req.body;

    if (data.type === "limit" && data.price <= 0){
        return res.json("Error price should be more than 0").status(400)
    }

    if(data.side === "long"){
        matchBuy(data);
    }else {
        matchSell(data);
    }

})

app.get("/api/users/:userId/balance",(req,res) => {


    

})

app.get("/api/users/:userId/positions",(req,res) => {

    

})

app.post("/api/reset",async (req,res) => {

    let result = await client.flushAll();

    return res.json(result);

})


app.post("/api/mark-price",(req,res) => {

    

})

app.post("/api/funding",(req,res) => {

    

})

app.get("/api/insurance-fund/:symbol",(req,res) => {

})

app.get("/api/adl-events",(req,res) => {

})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})