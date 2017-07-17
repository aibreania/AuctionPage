"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var app = express();
var Product = (function () {
    function Product(id, title, price, rating, desc, cateogories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.cateogories = cateogories;
    }
    return Product;
}());
exports.Product = Product;
var products = [
    new Product(1, "Abby", 1.99, 3.5, "First Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Electronics"]),
    new Product(2, "Bobby", 2.99, 2.2, "Second Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Tools"]),
    new Product(3, "Cody", 3.99, 4.1, "Third Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Children"]),
    new Product(4, "Dicky", 4.99, 3.4, "Fourth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Women", "Tools"]),
    new Product(5, "Esty", 5.99, 2.8, "Fifth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Food", "Children"]),
    new Product(6, "Fitty", 6.99, 4.5, "Sixth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Electronics"])
];
app.get('/', function (req, res) {
    res.send("Hello Express!");
});
app.get('/products', function (req, res) {
    res.json(products);
});
app.get('/products/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("server started at localhost:8000");
});
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on("connection", function (websocket) {
    websocket.send("this is from the server");
    websocket.on("message", function (message) {
        console.log("message received" + message);
    });
});
setInterval(function () {
    if (wsServer.clients) {
        wsServer.clients.forEach(function (client) {
            client.send("this is timely inquiry");
        });
    }
}, 2000);
