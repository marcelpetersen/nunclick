import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController, ToastController, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FirebaseListObservable  }   from "angularfire2/database";
import {BarcodeScanner} from '@ionic-native/barcode-scanner';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MapPage } from '../pages/map/map';
import { OrderComponent } from '../pages/order/order.component';
import { CartComponent } from '../pages/cart/cart.component';
import { ListasModalComponent } from '../components/listas'
import { UserService } from '../providers/user.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;
  usuario: FirebaseListObservable<any[]>;
  pages: Array<{title: string, component: any, icon: string, num: number}>;
  exitStatus: number = 0;
  uid: string;
  usa: any;
  slg: Boolean;
  myUser: any;
  codeTxt: string;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public us: UserService,
    private barcodeScanner: BarcodeScanner,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController
  ) {
    this.platform.ready().then(() => {
      var thus = this;
      this.platform.registerBackButtonAction(() => {
        if(thus.exitStatus == 0){
          thus.presentToast();
        }else{
          navigator['app'].exitApp();                
        }
      });
    });

    us.af.authState.subscribe(user => {
      if(user != null) {
        this.slg = true;
        this.us.slg = true;
        this.uid = user.uid;
        this.usuario = us.db.list('/users/'+ user.uid);
        this.nav.setRoot(HomePage);
        this.getMyUser();
      }else{
        this.slg = false;
        this.us.slg = false;
      }

    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      { title: 'Início', component: HomePage, icon: 'home', num: 1 },
      { title: 'Lista de Produtos', component: OrderComponent, icon: 'pricetags', num: 1 },
      { title: 'Carrinho de Compras', component: CartComponent, icon: 'cart', num: 1 },
      { title: 'Minhas Listas', component: ListasModalComponent, icon: 'list-box', num: 0 },
      { title: 'Mapa', component: MapPage, icon: 'map', num: 1 },   
      { title: 'Código de Barras', component: '', icon: 'barcode', num: 2 },
      { title: 'Sobre Nós', component: AboutPage, icon: 'information-circle', num: 1 },
      { title: 'Sair', component: LoginPage, icon: 'exit', num: 1 }
    ];
  }

  presentToast(){
    var thus = this;
    this.exitStatus = 1;
    this.toastCtrl.create({
        message: 'Pressione novamente para sair',
        duration: 2000,
        position: 'bottom'
      }).present();
    setTimeout(function(){ thus.exitStatus = 0; }, 2000);  
  }

  openPage(page) {
    if(page.num == 1){
      if(page.component == LoginPage){
        if(this.us.objectSub) this.us.objectSub.unsubscribe();
        if(this.us.objectSubOrder) this.us.objectSubOrder.unsubscribe();
        if(this.us.objectSubDetail) this.us.objectSubDetail.unsubscribe();
        if(this.us.objectSubDetail2) this.us.objectSubDetail2.unsubscribe();
        this.us.af.auth.signOut();
      }
      this.nav.setRoot(page.component);
    }else if(page.num == 0){
      const modal = this.modalCtrl.create(page.component);
      modal.present();
    }else{
      this.scan();
    }

  }

  getMyUser(){
    var thus = this;
    thus.usa = thus.us.db.list('/users/'+ thus.uid, { preserveSnapshot: true });
    thus.us.objectSub = thus.usa.subscribe( snapshots => {
      snapshots.forEach(snapshot => {
        thus.myUser = snapshot.val();
        thus.us.myUser = thus.myUser;
      });
    });  
  }  

  scan() {
    this.platform.ready().then(() => {
        this.barcodeScanner.scan().then((result) => {
          this.codeTxt = result.text;
        }, (error) => {
          console.log(error);
        });
    });
  }

}
