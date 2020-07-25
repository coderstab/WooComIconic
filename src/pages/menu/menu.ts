import { Component , ViewChild} from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';
import { CartPage } from '../cart/cart';
import { FaqPage } from '../faq/faq';
import * as WC from 'woocommerce-api';
import { ProductsByCategoryPage  } from '../products-by-category/products-by-category'
import { Storage } from '@ionic/storage';
import { OrderPage } from '../order/order';

@IonicPage({})
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  homePage: any;
  
  WooCommerce: any;
  categories: any[];
  @ViewChild('content') childNavCtrl : NavController;
  loggedIn: boolean;
  user: any;
  
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController) {
    this.homePage = HomePage
    this.categories = [];
    this.user = {};
    this.WooCommerce = WC({

      // url: "http://woonext.cloudaccess.host",
      // consumerKey: "ck_bd3580613c9edcca36e9a47fccd76f8e759cf9b7",
      // consumerSecret: "cs_1d08e7f5acd7c0f77133aa77553bd1b4675fb221",

      url: "http://codesevacoshop.cloudaccess.host",
      consumerKey: "ck_28d4fe04f0bd7fb9ec12d360eb064530b4a039a2",
      consumerSecret: "cs_c29f52c9464c59a3efdecfe06cae7d2d9952bb1d"
    });

    this.WooCommerce.getAsync("products/categories").then ( (data) =>{ 
      console.log(JSON.parse(data.body).product_categories);

      let temp: any[] = JSON.parse(data.body).product_categories;
      
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].parent == 0) {

          if (temp[i].slug == "uncategorized") {
            temp[i].icon = "archive";
          }
          if (temp[i].slug == "clothing") {
            temp[i].icon = "shirt";
          }
          if (temp[i].slug == "decor") {
            temp[i].icon = "color-palette";
          }
          if (temp[i].slug == "music") {
            temp[i].icon = "headset";
          }


          this.categories.push(temp[i]);
        }
      }
    }, (err) => {
      console.log(err);
    });

  }



  ionViewDidEnter() {

    this.storage.ready().then(() => {
      this.storage.get("userLoginInfo").then((userLoginInfo) => {

        if (userLoginInfo != null) {

          console.log("User logged in...");
          this.user = userLoginInfo.user;
          console.log(this.user);
          this.loggedIn = true;
        }
        else {
          console.log("No user found.");
          this.user = {};
          this.loggedIn = false;
        }

      })
    })


  }

  openCategoryPage(category) {

    this.childNavCtrl.setRoot(ProductsByCategoryPage  , { "category":  category });

  }
  openPage(pageName: string) {
    if (pageName == "signup") {
      this.navCtrl.push(SignupPage);
    }
    if (pageName == "login") {
      this.navCtrl.push(LoginPage);
    }
    if (pageName == 'logout') {
      this.storage.remove("userLoginInfo").then(() => {
        this.user = {};
        this.loggedIn = false;
      })
    }
    if (pageName == 'cart') {
      let modal = this.modalCtrl.create(CartPage);
      modal.present();
    }
    if (pageName == 'order') {
      this.navCtrl.push(OrderPage);
   
    }


}
// page direction
openHomePage() {
  this.navCtrl.push(HomePage);
}
openFaqPage() {
  this.navCtrl.push(FaqPage);
}

}
