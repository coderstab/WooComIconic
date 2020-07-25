import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController, ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC from 'woocommerce-api';
import {HomePage} from '../home/home'
import {MenuPage} from '../menu/menu'



@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  billing_shipping_same: boolean;
  WooCommerce: any;
  userInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl : AlertController, public appCtrl: App, public viewCtrl: ViewController) {
    this.newOrder = {};
    this.newOrder.billing_address= {};
    this.newOrder.shipping_address= {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
      { method_id: "bacs", method_title: "Direct Bank Transfer" },
      { method_id: "cheque", method_title: "Cheque Payment" },
      { method_id: "cod", method_title: "Cash on Delivery" },
      { method_id: "paypal", method_title: "PayPal" }];

      this.WooCommerce = WC({

        url: "http://woonext.cloudaccess.host",
        consumerKey: "ck_bd3580613c9edcca36e9a47fccd76f8e759cf9b7",
        consumerSecret: "cs_1d08e7f5acd7c0f77133aa77553bd1b4675fb221",
     
      });

      this.storage.get("userLoginInfo").then((userLoginInfo) => {

        this.userInfo = userLoginInfo.user;
  
        let email = userLoginInfo.user.email;
        let id = userLoginInfo.user.id;
  
        this.WooCommerce.getAsync("customers/email/"+email).then((data) => {
  
          this.newOrder = JSON.parse(data.body).customer;
  
        })
  
      })
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;

    if (this.billing_shipping_same) {
      this.newOrder.shipping_address = this.newOrder.billing_address;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
  }

  placeOrder() {

    let orderItems: any[] = [];
    let data: any = {};

    let paymentData: any = {};

    this.paymentMethods.forEach((element, index) => {
      if (element.method_id == this.paymentMethod) {
        paymentData = element;
      }
    });

    data = {

     payment_details: {
       method_id: paymentData.method_id,
       method_title: paymentData.method_title,
       paid: true
     },

     billing_address: this.newOrder.billing_address,
     shipping_address: this.newOrder.shipping_address,
     customer_id: this.userInfo.id || '',
     line_items: orderItems
     
    };

    if (paymentData.method_id == "paypal") {
      //TODO
    }else {
      this.storage.get("cart").then((cart) => {

        cart.forEach((element, index) => {
         
            orderItems.push({
               product_id: element.product.id, 
               quantity: element.qty 
              });
            ///total = total + (element.product.price * element.qty);
          
        });

        data.line_items = orderItems;

        let orderData: any = {};
        orderData.order = data;

        this.WooCommerce.postAsync("orders", orderData).then((data) => {
            let response = (JSON.parse(data.body).order);

            this.alertCtrl.create({
              title: "Order Placed Successfully",
              message: "Your order has been placed successfully. Your order number is " + response.order_number,
              buttons: [{
                text: "OK",
                handler: () => {
                
                //  this.viewCtrl.dismiss();
                   this.navCtrl.setRoot(HomePage);
                  //  this.navCtrl.push(HomePage);
                  // this.appCtrl.getRootNav().setRoot(HomePage);
                  
                  // this.viewCtrl.dismiss().then(() => this.appCtrl.getRootNav().setRoot(HomePage));
                  // this.navCtrl.popToRoot();
                  // this.navCtrl.setRoot(HomePage);
                  // this.navCtrl.push('HomePage');
                 
                
                }
              }]
            }).present();
        } )
      })
    }

  }

}
