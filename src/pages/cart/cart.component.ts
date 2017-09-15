import {Component, OnInit, Input} from '@angular/core';
import {Storage} from '@ionic/storage';
import {AlertController, ModalController, Platform} from 'ionic-angular';

import {CartService} from '../../providers';
import {CartItem} from '../../models';

@Component({
  templateUrl: 'cart.component.html'
})
export class CartComponent implements OnInit {
  cart: CartItem[] = [];
  mercados: string[] = [];
  @Input() quant: number[] = [];

  constructor(
    private cartService: CartService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private storage: Storage
  ) { }

  ngOnInit(): void {
    this.cart = this.cartService.getCart();
    for (let item of this.cart) {
      if (this.mercados.indexOf(item.market) == -1) {
        this.mercados.push(item.market);
      }
    }
    for (let quant of this.cartService.quant) {
      this.quant.push(quant.quant);
    }
    this.cartService.lFlag=false;
  }

  ionViewDidEnter(): void {
    if (this.cart.length) {
      return;
    }

    let alert = this.alertCtrl.create({
      title: '<b>Seu carrinho está vazio!</b>',
      subTitle: 'Adicione alguns itens da nossa lista de produtos!',
      buttons: ['OK']
    });
    alert.present();
  }

  calcTotalSum() {
    return this.cartService.calcTotalSum();
  }

  calcEachSum(mercado) {
    return this.cartService.calcEachSum(mercado);
  }

  removeFromCart(mercado): void {
    this.cart = this.cartService.getCart();
    for (let item of this.cart) {
      if (this.mercados.indexOf(item.market) == -1) {
        this.mercados.push(item.market);
      }
    }
    //this.cartService.removeCartItem(index);
    var x = 0;
    for (let item of this.cart) {
      if (item.market == mercado && item.quant != 0) {
        x += 1;
      }
    }
    var m = this.mercados.indexOf(mercado);
    if (x == 0) {
      this.mercados.splice(m, 1);
    }
  }

  removeItem(item) {
    var i = 0;
    for (let q of this.cartService.quant) {
      if (q.name == item.name && q.market == item.market) {
        this.quant[i] = 0;
        this.cartService.quant[i].quant = 0;
        break;
      }
      i++;
    }
    this.cartService.addCartItem(item, item, 0, 0);
    this.removeFromCart(item.market);
  }

  lessOne(produto, prodOrd) {
    var j = 0;
    var i = 0;
    for (let q of this.cartService.quant) {
      if (q.name == produto.name && q.market == prodOrd.market) {
        break;
      }
      j++;
    }
    if (this.cartService.quant[j].quant >= 1) {
      for (let q of this.cartService.quant) {
        if (q.name == produto.name && q.market == prodOrd.market) {
          this.cartService.quant[i].quant -= 1;
          break;
        }
        i++;
      }
      this.cartService.addCartItem(produto, prodOrd, this.cartService.quant[i].quant, -1);
      this.removeFromCart(prodOrd.market);

      this.quant = [];
      for (let quant of this.cartService.quant) {
        this.quant.push(quant.quant);
      }
    }
  }

  plusOne(produto, prodOrd, num) {
    var i = 0;
    if (num == 1) {
            for (let q of this.cartService.quant) {
        if (q.name == produto.name && q.market == prodOrd.market) {
          this.cartService.quant[i].quant += 1;
          break;
        }
        i++;
      }
      this.cartService.addCartItem(produto, prodOrd, this.cartService.quant[i].quant, 1);

      this.quant = [];
      for (let quant of this.cartService.quant) {
        this.quant.push(quant.quant);
      }
    } else {
      for (let q of this.cartService.quant) {
        if (q.name == produto.name && q.market == prodOrd.market) {
          if (this.quant[i] == null || this.quant[i] == 0) {
            this.cartService.quant[i].quant = 0;
            break;
          } else {
            this.cartService.quant[i].quant = this.quant[i];
            break;
          }
        }
        i++;
      }

      if (this.cartService.quant[i].quant == 0 || this.cartService.quant[i].quant == null) {
        this.quant[i] = 0;
        this.cartService.addCartItem(produto, prodOrd, 0, 0);
        this.removeFromCart(prodOrd.market);
      } else {
        this.cartService.addCartItem(produto, prodOrd, this.cartService.quant[i].quant, 1);
      }

      this.quant = [];
      for (let quant of this.cartService.quant) {
        this.quant.push(quant.quant);
      }
    }
  }

  numi(name, market) {
    var i = 0;
    for (let produto of this.cartService.quant) {
      if (produto.name == name && produto.market == market) {
        return i;
      }
      i++;
    }
  }

  saveList() {
    if(this.cart.length!=0){
      let alert = this.alertCtrl.create({
        title: 'Nome da Lista',
        inputs: [
          {
            name: 'listName'
          }
        ],
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
              this.storage.set(data.listName, this.cartService.getCart());
            }
          }
        ]
      });
      alert.present();
    }
  }

  dropList() {
    if(this.cart.length!=0){
      let alert = this.alertCtrl.create({
        title: 'Deseja apagar os itens do carrinho?',
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
              this.cartService.setCart([]);
              this.cart=[];
              for (let q of this.cartService.quant) {
                q.quant = 0;
              }
              this.mercados=[];
            }
          }
        ]
      });
      alert.present();
    }
  }
}
