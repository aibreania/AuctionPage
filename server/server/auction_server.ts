import * as express from 'express';
import {Server} from 'ws';
import {port} from "_debugger";

const app = express();

export class Product {
    constructor (
        public id: number,
        public title: string,
        public price: number,
        public rating: number,
        public desc: string,
        public cateogories: Array<string>) {
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

app.get('/', (req, res) => {
    res.send("Hello Express!");
});

app.get('/products', (req, res) => {
   res.json(products);
});

app.get('/products/:id', (req, res) => {
    res.json(products.find((product) => product.id == req.params.id));
});

const server = app.listen(8000, "localhost", () => {
   console.log("server started at localhost:8000");
});

const wsServer = new Server({port : 8085});
wsServer.on("connection", websocket => {
    websocket.send("this is from the server");
    websocket.on("message", message => {
        console.log("message received" + message);
    });
});

setInterval(() => {
    if(wsServer.clients) {
        wsServer.clients.forEach(client => {
            client.send("this is timely inquiry");
        })
    }
}, 2000);
