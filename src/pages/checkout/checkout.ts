import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController, ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC from 'woocommerce-api';
import {HomePage} from '../home/home'
import {MenuPage} from '../menu/menu';
import {OrderPage} from '../order/order';


declare var RazorpayCheckout: any;
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
  
  cartItems: any[] = [];
  total: any;
  showEmptyCartMessage: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl : AlertController, public appCtrl: App, public viewCtrl: ViewController) {
    this.newOrder = {};
    this.newOrder.billing_address= {};
    this.newOrder.shipping_address= {};
    this.billing_shipping_same = false;

    this.paymentMethods = [
      // { method_id: "bacs", method_title: "Direct Bank Transfer" },
      // { method_id: "cheque", method_title: "Cheque Payment" },
      { method_id: "cod", method_title: "Cash on Delivery" },
      { method_id: "rpay", method_title: "RazorPay" }
    ];

      this.WooCommerce = WC({

        // url: "http://woonext.cloudaccess.host",
        // consumerKey: "ck_bd3580613c9edcca36e9a47fccd76f8e759cf9b7",
        // consumerSecret: "cs_1d08e7f5acd7c0f77133aa77553bd1b4675fb221",

        url: "http://codesevacoshop.cloudaccess.host",
        consumerKey: "ck_28d4fe04f0bd7fb9ec12d360eb064530b4a039a2",
        consumerSecret: "cs_c29f52c9464c59a3efdecfe06cae7d2d9952bb1d"
     
      });

      this.storage.get("userLoginInfo").then((userLoginInfo) => {

        this.userInfo = userLoginInfo.user;
  
        let email = userLoginInfo.user.email;
        let id = userLoginInfo.user.id;
  
        this.WooCommerce.getAsync("customers/email/"+email).then((data) => {
  
          this.newOrder = JSON.parse(data.body).customer;
  
        })
  
      })

      // cart
      this.total = 0.0;
  
      this.storage.ready().then(()=>{
        this.storage.get("cart").then( (data)=>{
          this.cartItems = data;
          console.log(this.cartItems);
  
          if(this.cartItems.length > 0){
            this.cartItems.forEach( (item, index)=> {
              this.total = this.total + (item.product.price * item.qty * 100);
  
            })
          }
          else {
  
            this.showEmptyCartMessage = true;
  
          }
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

    if (paymentData.method_id == "rpay") {

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
          // console.log(JSON.parse(data.body).order);
          // console.log(JSON.parse(data).body.order);
            let response = (JSON.parse(data.body).order);

            var options = {
              description: 'Credits towards consultation',
              image: 'https://i.imgur.com/3g7nmJC.png',
              currency: 'INR', 
              key: 'rzp_live_xxxxxxxxx', 
              amount: this.total, 
              // order_id:  response.id,
              name: 'Grocery V 1.0.7',
              prefill: {
                // email: 'admin@enappd.com',
                // contact: '9621323231',
                // name: 'Enappd'
              },
              theme: {
                color: '#F37254'
              },
              modal: {
                ondismiss: function () {
                  alert('dismissed')
                }
              }
            };
      
          //   var successCallback = function (payment_id) {
              
          //   localStorage.clear();
 
          //  this.alertCtrl.create({
          //        title: "Order Placed Successfully",
          //        message: "Your order has been placed successfully. Your order number is " + response.order_number,
          //        buttons: [{
          //                text: "OK",
          //                handler: () => {
          //                       this.navCtrl.setRoot(HomePage);
          //                }
          //        }]
          //   }).present();
          //   alert('Your order has been placed successfully. Your order number is' + ' ' + 'payment_id: ' + payment_id + ' '+  'order_id:' +  response.order_number);
             
          //   };
          var successCallback = (success) =>{
            // alert('payment_id: ' + success.razorpay_payment_id)
            // var orderId = success.razorpay_order_id
            // var signature = success.razorpay_signature
            // this.storage.set('payment_success',true); 
            this.alertCtrl.create({
                     title: "Order Placed Successfully",
                     message: "Your order has been placed successfully. Your order number is " + response.order_number,
                     buttons: [{
                             text: "OK",
                             handler: () => {
                                    this.navCtrl.setRoot(OrderPage);
                             }
                     }]
                }).present();
              
      };
        
            var cancelCallback = function (error) {
              alert(error.description + ' (Error ' + error.code + ')');
            };
        
            RazorpayCheckout.open(options, successCallback, cancelCallback)
        } )
      })

      let response = (JSON.parse(data.body).order);
      console.log(JSON.parse(data).body.order);


           // Razorpay Payment Gateway
            // var options = {
            //   description: 'Credits towards consultation',
            //   image: 'https://i.imgur.com/3g7nmJC.png',
            //   currency: 'INR', 
            //   key: 'rzp_live_DCOpxR8ECwFd7E', 
            //   amount: this.total, 
            //   order_id:  response.order_number,
            //   name: 'Grocery V 1.0.4',
            //   prefill: {
            //     email: 'admin@enappd.com',
            //     contact: '9621323231',
            //     name: 'Enappd'
            //   },
            //   theme: {
            //     color: '#F37254'
            //   },
            //   modal: {
            //     ondismiss: function () {
            //       alert('dismissed')
            //     }
            //   }
            // };
      
            // var successCallback = function (payment_id) {
            //   alert('payment_id: ' + payment_id +  'order_id:' +  response.order_number);
             
            // };
        
            // var cancelCallback = function (error) {
            //   alert(error.description + ' (Error ' + error.code + ')');
            // };
        
            // RazorpayCheckout.open(options, successCallback, cancelCallback);
     
      
      
    }else {
      this.storage.get("cart").then((cart) => {

        cart.forEach((element, index) => {
         
            orderItems.push({
               product_id: element.product.id, 
               quantity: element.qty 
              });
            ///total = total + (element.product.price * element.qty)
        });

        data.line_items = orderItems;
        let orderData: any = {};
        orderData.order = data;

        this.WooCommerce.postAsync("orders", orderData).then((data) => {
        
          console.log(JSON.parse(data.body).order);
            let response = (JSON.parse(data.body).order);
            this.alertCtrl.create({
              title: "Order Placed Successfully",
              message: "Your order has been placed successfully. Your order number is " + response.order_number,
              buttons: [{
                text: "OK",
                handler: () => {
                   this.navCtrl.setRoot(HomePage);
                   localStorage.clear();
                }
              }]
            }).present();
        } )
      })
    }

  }

}
