import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  ToastController , ModalController} from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { Storage } from '@ionic/storage';
import {CartPage} from '../cart/cart';

@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

      product: any;
      WooCommerce: any;
      reviews: any[] = [] ;
      cartItems: any[] = [];
      total: any;
      item_qty:any;
      counts: any;
      tempLength: any;
      

  constructor(public navCtrl: NavController, public navParams: NavParams , public storage: Storage, public toastCtrl: ToastController, public modalCtrl: ModalController) {
    this.product = this.navParams.get("product");
    console.log(this.product);
    this.item_qty=1;

  

    this.WooCommerce = WC({

      // url: "http://woonext.cloudaccess.host",
      // consumerKey: "ck_bd3580613c9edcca36e9a47fccd76f8e759cf9b7",
      // consumerSecret: "cs_1d08e7f5acd7c0f77133aa77553bd1b4675fb221",
      url: "http://codesevacoshop.cloudaccess.host",
      consumerKey: "ck_28d4fe04f0bd7fb9ec12d360eb064530b4a039a2",
      consumerSecret: "cs_c29f52c9464c59a3efdecfe06cae7d2d9952bb1d"
   
    
    });

    this.WooCommerce.getAsync('products/' + this.product.id + '/reviews').then((data) => {

      this.reviews = JSON.parse(data.body).product_reviews;
      console.log(this.reviews);

    }, (err) => {
      console.log(err);
    })

    // copy 
    this.storage.get("cart").then((data) => {
     
   
    console.log(data.length);
    let counts = data.length;
    this.tempLength = data.length;
    console.log(counts);
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  
  // addToCart(product){
  //   localStorage.getItem("cart");
  //   console.log( localStorage.getItem("cart"));
  // }
  addToCart(product){
    this.storage.get("cart").then((data) => {
      if (data == undefined || data.length == 0) {
        data = [ ];
console.log(data);
        data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });
      } else {
        let added = 0;

        for (let i = 0; i < data.length; i++){

          if(product.id == data[i].product.id){ //Product ID matched
              console.log("Product is already in the cart")
              let  qty = data[i].qty;
              data[i].qty = qty+1;
              data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
              added= 1;
                
              }
      }
      if (added ==0 ){
        data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });
      }
    }
    this.storage.set("cart", data).then(() => {
      console.log("Cart Updated");
      console.log(this.cartItems.length);
       
        console.log(data);
       
        this.toastCtrl.create({
          message: "Cart Updated",
          duration: 3000
        }).present();

    })
    console.log(data.length);
    let counts = data.length;
    this.tempLength = data.length;
    console.log(counts);
    });
    
  }


  openCart(){

    this.modalCtrl.create(CartPage).present();

  }


}
