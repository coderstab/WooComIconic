import { Component } from '@angular/core';
import {  NavController, NavParams,  ToastController} from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductDetailsPage  } from '../product-details/product-details'

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams , public toastCtrl: ToastController) {

    this.page=1;
    this.category = this.navParams.get("category");

    this.WooCommerce = WC({

      // url: "http://woonext.cloudaccess.host",
      // consumerKey: "ck_bd3580613c9edcca36e9a47fccd76f8e759cf9b7",
      // consumerSecret: "cs_1d08e7f5acd7c0f77133aa77553bd1b4675fb221",
      url: "http://codesevacoshop.cloudaccess.host",
      consumerKey: "ck_28d4fe04f0bd7fb9ec12d360eb064530b4a039a2",
      consumerSecret: "cs_c29f52c9464c59a3efdecfe06cae7d2d9952bb1d"
   
    
    });

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then ( (data) =>{ 
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    }, (err) => {
      console.log(err);
    });

  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event) {
    this.page++;
    console.log("Getting page " + this.page);
    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then((data) => {
      let temp = (JSON.parse(data.body).products);

      this.products = this.products.concat(JSON.parse(data.body).products)
      console.log(this.products);
      event.complete();

      if (temp.length < 10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No more products!",
          duration: 5000
        }).present();
      }
        event.enable(false);
    })
  } 

  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage, {"product": product});
  }


}
