"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var app = express();
var Product = (function () {
    function Product(id, title, price, rating, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var Comment = (function () {
    function Comment(id, productId, timeStamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timeStamp = timeStamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var products = [
    new Product(1, "Abby", 1.99, 3.5, "First Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Electronics"]),
    new Product(2, "Bobby", 2.99, 2.2, "Second Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Tools"]),
    new Product(3, "Cody", 3.99, 4.1, "Third Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Children"]),
    new Product(4, "Dicky", 4.99, 3.4, "Fourth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Women", "Tools"]),
    new Product(5, "Esty", 5.99, 2.8, "Fifth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Food", "Children"]),
    new Product(6, "Fitty", 6.99, 4.5, "Sixth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Electronics"])
];
var comments = [
    new Comment(1, 1, "2017-02-02", "april", 3, "ok"),
    new Comment(2, 1, "2017-03-02", "may", 4, "good"),
    new Comment(3, 1, "2017-04-02", "june", 2, "unsatisfied"),
    new Comment(4, 2, "2017-05-02", "jane", 1, "bad")
];
app.get('/', function (req, res) {
    res.send("Hello Express!");
});
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    /*console.log("0");
    console.log(result);
    console.log(params);*/
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.category && params.category !== "-1" && result.length > 0) {
        result = result.filter(function (p) { return p.categories.indexOf(params.category) !== -1; });
    }
    console.log("3");
    console.log(result);
    res.json(result);
});
app.get('/api/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/product/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(8000, "localhost", function () {
    console.log("server started at localhost:8000");
});
var subscriptions = new Map();
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on('connection', function (websocket) {
    //websocket.send('this is from the server');
    websocket.on('message', function (message) {
        console.log("message received");
        console.log(message);
        var messageObj = JSON.parse(message);
        var productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket, productIds.concat([messageObj.productId]));
    });
});
var currentBids = new Map();
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscriptions.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
