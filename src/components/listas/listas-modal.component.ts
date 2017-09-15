import {Component, OnInit} from '@angular/core';
import {AlertController, ViewController, NavController} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {CartComponent} from '../../pages/cart/cart.component';
import {CartService} from '../../providers';

@Component({
  templateUrl: 'listas-modal.component.html'
})
export class ListasModalComponent implements OnInit {
  listas: any[] = [];

 	constructor(
    private viewCtrl: ViewController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private nav: NavController,
    private cartService: CartService
  ) { }
 	ngOnInit(): void {
	    this.storage.forEach((value, key, index) => {
	      this.listas.push({ value, key, index });
	    });
      this.cartService.lFlag=true;
 	}

  ionViewDidEnter(): void {
    if (this.listas.length) {
      if(this.cartService.lFlag==false){
        this.listas=[];
        this.storage.forEach((value, key, index) => {
          this.listas.push({ value, key, index });
        });
      }
    }else{
      let alert = this.alertCtrl.create({
        title: '<b>Você não possui listas salvas!</b>',
        subTitle: 'Adicione itens ao seu carrinho de compras e salve suas listas!',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  // ionViewDidEnter(){
  //   this.listas = [];
  //   this.storage.forEach((value, key, index) => {
  //     this.listas.push({ value, key, index });
  //   });
  // }

  closeModal(): void {
    this.viewCtrl.dismiss();
  }

  showList(key) {
    this.storage.get(key).then((value) => {
      this.cartService.setCart(value);
      for (let q of this.cartService.quant) {
        q.quant = 0;
        for (let v of value) {
          if (q.name == v.name && q.market == v.market) {
            q.quant = v.quant;
          }
        }
      }
      this.nav.push(CartComponent);
    });
  }

  removeList(key, $event){
  	$event.stopPropagation();
    let alert = this.alertCtrl.create({
      title: 'Deseja apagar<br>"'+ key +'" ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.storage.remove(key).then(() => {});
            this.listas = [];
            this.storage.forEach((value, key, index) => {
              this.listas.push({ value, key, index });
            });
          }
        }
      ]
    });
    alert.present();
  }
}
