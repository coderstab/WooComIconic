import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController, ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as WC from 'woocommerce-api';
import {HomePage} from '../home/home'
import {MenuPage} from '../menu/menu';





// @IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})


export class OrderPage {
  newOrder: any;
  WooCommerce: any;
  userInfo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public storage: Storage) {

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

      this.WooCommerce.getAsync("orders?customer="+id).then((data) => {

        this.newOrder = JSON.parse(data.body).orders;
        console.log(JSON.parse(data.body).orders);

      })

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

}
