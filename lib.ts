import type { Order, Orderbook } from ".";
import { client } from "./redis-client";

export async function matchBuy (order : Order) {

    const get_orderbook = await client.get(`orderbook-${order.symbol}`);

    
    if(get_orderbook){
        
        const orderbook : Orderbook = JSON.parse(get_orderbook);

        let asks = orderbook.asks;

        for (const i of asks) {
           
            const prices = Object.keys(i);

            

            console.log(prices);


        }


    }else {
        return Error("Orderbook does not exist for this asset");
    }

    if(order.type == "market"){
        
    }


}

export function matchSell (order : Order) {

    

}