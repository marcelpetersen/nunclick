import {Component, OnInit, Input} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import {NavParams} from 'ionic-angular';
import 'rxjs/add/operator/toPromise';


import {ListaService, CartService, UserService} from '../../providers';
import {Produto} from '../../models';
import {Mercado} from '../../models';
import {CartComponent} from '../cart/cart.component';

declare var google;

@Component({
  templateUrl: 'detail.component.html'
})
export class DetailComponent implements OnInit {
  produto: Produto;
  produtos: Produto[] = [];
  mercados: Mercado[] = [];
  loading: boolean;
  @Input() quant: number[] = [];



  constructor(
    private navParams: NavParams,
    private listaService: ListaService,
    private us: UserService,
    private cartService: CartService,
    private alertCtrl: AlertController,
    private cartComponent: CartComponent,
    private nav: NavController,
    public geolocation: Geolocation
  ) {
    this.geolocation.getCurrentPosition()
      .then((position) => {
        us.userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      },(err) => {
            console.log('erro:', err);
        });
  }

  ngOnInit(): void {
      var thus = this;
      let usa = thus.us.db.list('/lista', { preserveSnapshot: true });
      thus.us.objectSubDetail = usa.subscribe( snapshots => {
        snapshots.forEach(snapshot => {
          let data = snapshot.val();
          data.id = snapshot.key;
          thus.produtos.push(data);
        });
        this.produtos.sort(function(a, b){
            return a.price-b.price
        });
        
        for(let produto of this.produtos){
          if(produto.id==this.navParams.get('id')){
            this.produto=produto;
            break;
          }
        }

        for(let quant of this.cartService.quant){
          this.quant.push(quant.quant);
        }
      });

      let usa2 = thus.us.db.list('/lista', { preserveSnapshot: true });
      thus.us.objectSubDetail2 = usa2.subscribe( snapshots => {
        snapshots.forEach(snapshot => {
          thus.mercados.push(snapshot.val());
        });
      });  
  }  

  addToCart($event, produto: Produto, quant) {
    $event.stopPropagation();
    var produto1: Produto = produto;
    this.cartService.addCartItem(produto, produto1, quant, 1);
  }

  openCart() {
    this.nav.push(CartComponent);
  }

  mercImg(produto){
    var img;
    for(let mercado of this.mercados){
      if(mercado.name == produto.market){
        img = mercado.img;
        break;
      }
    }
    return img;
  }

  lessOne(produto, prodOrd) {
    var j = 0;
    for(let q of this.cartService.quant){
      if(q.name == produto.name && q.market == prodOrd.market){
        break;
      }
      j++;
    }
    if(this.cartService.quant[j].quant>=1){ 
      var x = 0;
      for(let q of this.cartService.quant){
        if(q.name == produto.name && q.market == prodOrd.market){
          this.cartService.quant[x].quant-=1;
          break;
        }
        x++;
      }
      this.cartService.addCartItem(produto, prodOrd, this.cartService.quant[x].quant, -1);  
      this.cartComponent.removeFromCart(prodOrd.market);

      this.quant = [];
      for(let quant of this.cartService.quant){
        this.quant.push(quant.quant);
      }
    }
  }

  plusOne(produto, prodOrd, num){
    var i = 0;
    if(num==1){
      for(let q of this.cartService.quant){
        if(q.name == produto.name && q.market == prodOrd.market){
          this.cartService.quant[i].quant+=1;
          break;
        }
        i++;
      }
      this.cartService.addCartItem(produto, prodOrd, this.cartService.quant[i].quant, 1);

      this.quant = [];
      for(let quant of this.cartService.quant){
        this.quant.push(quant.quant);
      }
    }else{
      for(let q of this.cartService.quant){
        if(q.name == produto.name && q.market == prodOrd.market){
          if(this.quant[i]==null || this.quant[i]==0){
            this.cartService.quant[i].quant=0;
            break;
          }else{
            this.cartService.quant[i].quant=this.quant[i];
            break;
          }
        }
        i++;
      }

      if(this.cartService.quant[i].quant==0 || this.cartService.quant[i].quant==null){
        this.quant[i]=0;
        this.cartService.addCartItem(produto, prodOrd, 0, 0);
        this.cartComponent.removeFromCart(prodOrd.market);      
      }else{
        this.cartService.addCartItem(produto, prodOrd, this.cartService.quant[i].quant, 1);
      }

      this.quant = [];
      for(let quant of this.cartService.quant){
        this.quant.push(quant.quant);
      }
    }
  }

  numi(name, market){
    var z = 0;
    for(let produto of this.cartService.quant){
      if(produto.name == name && produto.market == market){
        return z;
      }
      z++;
    }
  }

  cartLength(): number{
    var l = 0;
    for(let cart of this.cartService.quant){
      l+=cart.quant;
    }
    return l;
  } 

  colorOrd(name): number{
    var col = [];
    for(let produto of this.produtos){
      if(produto.name == name){
        col.push(produto.price);
      }
    }
    col.sort();
    return col[0];
  }
}
