import {EventEmitter, Injectable} from '@angular/core';
import {Http, RequestOptions, Headers, URLSearchParams} from "@angular/http";
import {Observable} from "rxjs/Rx";
import 'rxjs/Rx';

@Injectable()
export class ProductService {

  searchEvent:EventEmitter<ProductSearchParams> = new EventEmitter();

  getAllCategories(): string[] {
    return ["Electronics", "Tools", "Children", "Women", "Food"];
  }

  constructor(private http: Http) {

  }

  getProducts(): Observable<Product[]> {
    return this.http.get("/api/products").map(res => res.json());
  }

  getProduct(id:number): Observable<Product> {
    return this.http.get("/api/product/"+id).map(res => res.json());
  }

  getCommentsForProductId(id:number): Observable<Comment[]> {
    return this.http.get("/api/product/"+id+"/comments").map(res => res.json());
  }

  search(params: ProductSearchParams): Observable<Product[]> {
    let myHeaders = new Headers();
    let myParams = this.encodeParams(params);
    let options = new RequestOptions({headers: myHeaders, params: myParams});

    return this.http.get("/api/products", options).map(res => res.json());
  }


  private encodeParams(params: ProductSearchParams): URLSearchParams {

    return Object.keys(params)
      .filter(key => params[key])
      .reduce((sum:URLSearchParams, key:string) => {
        sum.append(key, params[key]);
        return sum;
      }, new URLSearchParams());
  }

  private encodeParams2(params: ProductSearchParams): string {

    return Object.keys(params)
      .filter(key => params[key])
      .reduce((s:string, key:string) => {
        s = s + key + "=" + params[key];
        return s;
      }, "");
  }
}


export class ProductSearchParams {
  constructor (
    public title:string,
    public price:number,
    public category:string
  ){}
}

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
