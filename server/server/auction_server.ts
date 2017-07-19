import * as express from 'express';
import {Server} from 'ws';
import * as path from "path";

const app = express();

export class Product {
    constructor (
        public id: number,
        public title: string,
        public price: number,
        public rating: number,
        public desc: string,
        public categories: Array<string>) {
    }
}

export class Comment {
    constructor (
        public id: number,
        public productId: number,
        public timeStamp: string,
        public user: string,
        public rating: number,
        public content: string) {
    }
}

const products: Product[] = [
    new Product(1, "Abby", 1.99, 3.5, "First Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Electronics"]),
    new Product(2, "Bobby", 2.99, 2.2, "Second Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Tools"]),
    new Product(3, "Cody", 3.99, 4.1, "Third Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Children"]),
    new Product(4, "Dicky", 4.99, 3.4, "Fourth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Women", "Tools"]),
    new Product(5, "Esty", 5.99, 2.8, "Fifth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Food", "Children"]),
    new Product(6, "Fitty", 6.99, 4.5, "Sixth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Electronics"])
];


const comments: Comment[] = [
    new Comment(1, 1, "2017-02-02", "april", 3, "ok"),
    new Comment(2, 1, "2017-03-02", "may", 4, "good"),
    new Comment(3, 1, "2017-04-02", "june", 2, "unsatisfied"),
    new Comment(4, 2, "2017-05-02", "jane", 1, "bad")
];


app.use('/', (express.static(path.join(__dirname, '..', 'client'))));

app.get('/api/products', (req, res) => {
    let result = products;
    let params = req.query;

    /*console.log("0");
    console.log(result);
    console.log(params);*/

    if(params.title) {
        result = result.filter((p) => p.title.indexOf(params.title) !== -1);
    }

    if(params.price && result.length > 0) {
        result = result.filter((p) => p.price <= parseInt(params.price));
    }

    if(params.category && params.category !== "-1" && result.length > 0) {
        result = result.filter((p) => p.categories.indexOf(params.category) !== -1);
    }

    console.log("3");
    console.log(result);

    res.json(result);
});


app.get('/api/product/:id', (req, res) => {
    res.json(products.find((product) => product.id == req.params.id));
});

app.get('/api/product/:id/comments', (req, res) => {
    res.json(comments.filter((comment: Comment) => comment.productId == req.params.id));
});

const server = app.listen(8000, "localhost", () => {
   console.log("server started at localhost:8000");
});

const subscriptions = new Map<any, number[]>();

const wsServer = new Server({port : 8085});
wsServer.on('connection', websocket => {
    //websocket.send('this is from the server');
    websocket.on('message', message => {
        console.log("message received");
        console.log(message);
        let messageObj = JSON.parse(message);
        let productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket, [...productIds, messageObj.productId]);
    });
});

const currentBids = new Map<number, number>();

setInterval(() => {

    products.forEach(p => {
        let currentBid = currentBids.get(p.id) || p.price;
        let newBid = currentBid + Math.random()*5;
        currentBids.set(p.id, newBid);
    });

    subscriptions.forEach((productIds: number[], ws) => {
        if(ws.readyState === 1) {
            let newBids = productIds.map( pid => ({
                productId: pid,
                bid: currentBids.get(pid)
            }));
            ws.send(JSON.stringify(newBids));
        } else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
