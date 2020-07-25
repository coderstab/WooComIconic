import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController} from 'ionic-angular';
import {HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { SignupPage } from '../signup/signup'




@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string;
  password: string;
 

  constructor(public navCtrl: NavController, public navParams: NavParams , public http: HttpClient, public storage: Storage , public toastCtrl: ToastController, public alertCtrl: AlertController ) {
    this.username = "";
    this.password = "";
    
  }

  login(){
    // this.http.get("https://woonext.cloudaccess.host/api/auth/generate_auth_cookie/?insecure=cool&username=" + this.username + "&password=" + this.password)
    this.http.get("https://codesevacoshop.cloudaccess.host/api/auth/generate_auth_cookie/?insecure=cool&username=" + this.username + "&password=" + this.password)
    .subscribe( (res) => {
        console.log(res) ;
        let response = res;
        if(response['error']){
          this.toastCtrl.create({
            message: response ['error'],
            duration: 5000
          }).present();
          return;
        }
        this.storage.set("userLoginInfo", response).then( (data) =>{

          this.alertCtrl.create({
            title: "Login Successful",
            message: "You have been logged in successfully.",
            buttons: [{
              text: "OK",
              handler: () => {
  
                // this.events.publish("updateMenu");
  
                if(this.navParams.get("next")){
                  this.navCtrl.push(this.navParams.get("next"));
                } else {
                  this.navCtrl.pop();
                }             
              }
            }]
          }).present();
  
  
        })

      });

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  SignUp(){

    this.navCtrl.push(SignupPage);

  }

}
