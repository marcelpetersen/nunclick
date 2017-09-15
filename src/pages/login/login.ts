import { Component} from '@angular/core';
import { NavController, NavParams, MenuController} from 'ionic-angular';

import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';
import { User } from '../../models/user';
import { UserService } from '../../providers/user.service';


@Component({
 	selector: 'page-login',
 	templateUrl: 'login.html'
})
export class LoginPage {
	  pages: {title: string, component: any};
  	errorMsg: string;
    user = {} as User;

	constructor(
    	public navCtrl: NavController,
      public navParams: NavParams,
    	private menu : MenuController,
    	private us: UserService
  	) {
	   
  	}

  ionViewDidEnter() { 
    // the root left menu should be disabled on this page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    this.menu.enable(true);
  }

  async login(user: User) {
    var thus = this;
    this.us.af.auth.signInWithEmailAndPassword(user.email, user.password)
       .then(function(user: any) {
           // Success 
           thus.navCtrl.setRoot(HomePage);
       })
      .catch(function(error: any) {
           // Error Handling
           if(error.code == 'auth/user-not-found'){
            thus.errorMsg = 'Usuário não cadastrado!';
           }else if(error.code == 'auth/invalid-email'){
            thus.errorMsg = 'Email inválido!';
           }else if(error.code == 'auth/wrong-password'){
            thus.errorMsg = 'Senha incorreta!';
           }
      });
  }

  goRegister(){
    this.navCtrl.setRoot(RegisterPage);
  }


}
