import { Component , ViewChild } from '@angular/core';
import {IonicPage, NavController ,  Slides, ToastController,ModalController} from 'ionic-angular';
import * as WC from 'woocommerce-api';
import { ProductDetailsPage  } from '../product-details/product-details'
import { CartPage  } from '../cart/cart'
import { ProductsByCategoryPage  } from '../products-by-category/products-by-category'



import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {


  
  WooCommerce: any;
  products: any[ ];
  page: number;
  moreProducts: any[ ];
  categories: any[];
  qty: any;
  tempLength: any;


  @ViewChild('productSlides') productSlides: Slides;
  @ViewChild('content') childNavCtrl : NavController;
 

  
  constructor(public navCtrl: NavController , public toastCtrl: ToastController, public storage: Storage,public modalCtrl : ModalController) {
    this.page = 1;
    this.categories = [];
   

  
    

    this.WooCommerce = WC({

      url: "http://codesevacoshop.cloudaccess.host",
      consumerKey: "ck_28d4fe04f0bd7fb9ec12d360eb064530b4a039a2",
      consumerSecret: "cs_c29f52c9464c59a3efdecfe06cae7d2d9952bb1d"
      // url: "http://groceryshop.cloudaccess.host/",
      // consumerKey: "ck_174c14d5676c33401678380752b807e62af4c21c",
      // consumerSecret: "cs_c2885ce789e7fa0c5385990842605d91bdb9a7c4"
      // wpAPI: true,
      // queryStringAuth: true

   
    });

    // cart


     
    // this.storage.ready().then(()=>{
    //   this.storage.get("cart").then( (data)=>{
    //     this.cartItems = data;
    //     console.log(this.cartItems);

    //     if(this.cartItems.length > 0){
    //       this.cartItems.forEach( (item, index)=> {
    //         this.total = this.total + (item.product.price * item.qty);
    //         this.cartCount = this.cartCount + (item.qty)

    //       })
    //     }
    //     else {

    //       this.showEmptyCartMessage = true;

    //     }
    //   })
    // })

    // cat

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

    this.loadMoreProducts(null);

    this.WooCommerce.getAsync("products").then ( (data) =>{ 
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;
    }, (err) => {
      console.log(err);
    });

    // copy 
    this.storage.get("cart").then((data) => {
      console.log(data);
      console.log(data.qty);
      let counts = data.length;
      this.tempLength = data.length;
      console.log(counts);
      });

  }

  // cart

  //  removeFromCart(item, i){

  //   let price = item.product.price;
    
  //   let qty = item.qty;

  // let cartTotal = item.qty++;

  //   this.cartItems.splice(i, 1);

  //   this.storage.set("cart", this.cartItems).then( ()=> {

  //     this.total = this.total - (price * qty);

  //   });

  //   if(this.cartItems.length == 0){
  //     this.showEmptyCartMessage = true;
  //   }


  // }


  // changeQty(item, i, change){

  //   let price = 0;
  //   let  qty = 0;
    
    
  //     price = parseFloat(item.product.price);
    
  //    qty = item.qty;
  //    if(change < 0 && item.qty == 1){
  //      return;
  //    }

 
  //   qty = qty + change;
  //   item.qty = qty;
  //   item.amount = qty * price;

  //   this.cartItems[i] = item;

  //   this.storage.set("cart", this.cartItems).then( ()=> {

     

  //   });

  //   this.total = (parseFloat(this.total.toString()) + (parseFloat(price.toString()) * change));
  //   this.cartCount = (parseFloat(this.total.toString()) + (parseFloat(qty.toString()) * change));
    

   


  // }


  // ionViewDidLoad(){
  //   setInterval(()=> {
  //     if (this.productSlides.getActiveIndex() == this.productSlides.length()-1)
  //     this.productSlides.slideTo(0);
  //     this.productSlides.slideNext();
  //   }, 5000)
  // }

  loadMoreProducts(event){
    console.log(event);
    if(event == null)
    {
      this.page = 1;
      this.moreProducts = [];
    }
    else
      this.page++;

    this.WooCommerce.getAsync("products?page="+this.page).then( (data) => {
      console.log(JSON.parse(data.body));
      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

      if(event != null)
      {
        event.complete();
      }

      if(JSON.parse(data.body).products.length < 10){
        event.enable(false);

        this.toastCtrl.create({
          message: "No more products!",
          duration: 5000
        }).present();

      }


    }, (err) => {
      console.log(err)
    })
  }
  
  openCategoryPage(category) {

    this.navCtrl.push(ProductsByCategoryPage  , { "category":  category });

  }
  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage, {"product": product});
    
  }



  openCart(){

    this.modalCtrl.create(CartPage).present();

  }

  doRefresh(event) {
    this.storage.get("cart").then((data) => {
      console.log(data);
      console.log(data.qty);
      let counts = data.length;
      this.tempLength = data.length;
      console.log(counts);
      });
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.complete();
    }, 2000);
  }
 
   ionViewWillEnter() {
    this.storage.get("cart").then((data) => {
      console.log(data);
      console.log(data.qty);
      let counts = data.length;
      this.tempLength = data.length;
      console.log(counts);
      });
    console.log('Begin async operation');
  // location.reload();
    // location.reload();
  //   var foo = true;
  //   if (foo){
  //       window.location.reload(true);
  //       foo = false;
  //   }
  }

  
}
