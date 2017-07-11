import { Injectable } from '@angular/core';

@Injectable()
export class ProductService {


  private products: Product[] = [
    new Product(1, "Abby", 1.99, 3.5, "First Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Electronics", "Entertainment"]),
    new Product(2, "Bobby", 2.99, 2.2, "Second Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Sports", "Tools"]),
    new Product(3, "Cody", 3.99, 4.1, "Third Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Toy"]),
    new Product(4, "Dicky", 4.99, 3.4, "Fourth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Garment", "Women"]),
    new Product(5, "Esty", 5.99, 2.8, "Fifth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Food", "Child"]),
    new Product(6, "Fitty", 6.99, 4.5, "Sixth Product xxxxxxxxxxxxxxxxxxxxxxxxxx", ["Book"])
  ];

  private comments: Comment[] = [
    new Comment(1, 1, "2017-02-02", "april", 3, "ok"),
    new Comment(2, 1, "2017-03-02", "may", 4, "good"),
    new Comment(3, 1, "2017-04-02", "june", 2, "unsatisfied"),
    new Comment(4, 2, "2017-05-02", "jane", 1, "bad")
  ];

  constructor() {
  }

  getProducts(): Product[] {
    return this.products;
  }

  getProduct(id:number): Product {
    //noinspection TypeScriptValidateTypes
    return this.products.find((product) => product.id == id);
  }

  getCommentsForProductId(id:number): Comment[] {
    return this.comments.filter((comment: Comment) => comment.productId == id);
  }
}

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
