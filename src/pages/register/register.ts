import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { User } from '../../models/user';
import { UserService } from '../../providers/user.service';


@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
	user = {} as User;
  	msg: Array<string> = [];
  	password2: string;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	private us: UserService,
  	private menu: MenuController
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

	async register(user: User) {
		if(this.password2 == user.password){
			  var thus = this;
			  this.us.af.auth.createUserWithEmailAndPassword(user.email, user.password)
			     .then(function(result){})
			     .catch(function(error: any){
					if(error.code == 'auth/weak-password'){
			        	thus.msg[0] = 'red';
						thus.msg[1] = 'A senha deve ter pelo menos 6 caracteres';
			        }else if(error.code == 'auth/invalid-email'){
			        	thus.msg[0] = 'red';
			        	thus.msg[1] = 'Email inválido!';
			        }else if(error.code == 'auth/email-already-in-use'){
			        	thus.msg[0] = 'red';
			        	thus.msg[1] = 'Email já registrado!';
			        }
				});
		}else{
			this.msg[0] = 'red';
			this.msg[1] = 'Senha e Confirmação errada!';
		}
	  
	}

	goLogin(){
	  this.navCtrl.setRoot(LoginPage);
	}

}
