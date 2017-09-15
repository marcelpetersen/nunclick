import {Component, Input, OnInit, Injectable} from '@angular/core';


import {NavController, Refresher} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';

import {DetailComponent} from '../detail/detail.component';
import {CartComponent} from '../cart/cart.component';
import {ListaService, CartService, UserService} from '../../providers';
import {Produto} from '../../models';

@Component({
  templateUrl: 'order.component.html',
})

@Injectable()
export class OrderComponent implements OnInit {
  produtos: Produto[] = [];
  prodOrder: Produto[] = [];
  loading: boolean;
  produtoSource: Observable<Produto[]>;
  @Input() search: string = "";
  @Input() quant: number[] = [];


  constructor(
    private listaService: ListaService,
    private cartService: CartService,
    private us: UserService,
    private cartComponent: CartComponent,
    private nav: NavController
  ) { }

  ngOnInit() {
    this.prodOrder = [];
    var thus = this;
    let usa = thus.us.db.list('/lista', { preserveSnapshot: true });
    thus.us.objectSubOrder = usa.subscribe( snapshots => {
      snapshots.forEach(snapshot => {
        let data = snapshot.val();
        data.id = snapshot.key;
        thus.produtos.push(data);
      });
      thus.continue();
    }); 
  }

  continue(){
    this.produtos.sort(
      function compare(a, b) {
        if (a.name < b.name)
          return -1;
        if (a.name > b.name)
          return 1;
        return 0;
      }
    );

    for (let produto of this.produtos) {
      var index = -1;
      for (let i = 0; i < this.prodOrder.length; i++) {
        if (this.prodOrder[i].name == produto.name) {
          index = 1;
        }
      }
      if (index == -1) {
        this.prodOrder.push(produto);
      }
    }
    this.cartService.numP = this.prodOrder.length;
    for (let produto of this.produtos) {
      this.cartService.quant.push({
        name: produto.name,
        market: produto.market,
        quant: 0
      });
    }
    for (let quant of this.cartService.quant) {
      this.quant.push(quant.quant);
    }
  }

  doRefresh(refresher: Refresher) {
    this.prodOrder = [];
    var thus = this;
    let usa = thus.us.db.list('/lista', { preserveSnapshot: true });
    thus.us.objectSubOrder = usa.subscribe( snapshots => {
      snapshots.forEach(snapshot => {
        let data = snapshot.val();
        data.id = snapshot.key;
        thus.produtos.push(data);
      });
      thus.continue();
      refresher.complete();
    });
  }

  openProduto(id: number, $event) {
    $event.stopPropagation();
    this.nav.push(DetailComponent, {
      id: id
    });
  }

  openCart() {
    this.nav.push(CartComponent);
  }

  lessOne(produto, prodOrd) {
    var j = 0;
    for (let q of this.cartService.quant) {
      if (q.name == produto.name && q.market == prodOrd.market) {
        break;
      }
      j++;
    }
    if (this.cartService.quant[j].quant >= 1) {
      var i = 0;
      for (let q of this.cartService.quant) {
        if (q.name == produto.name && q.market == prodOrd.market) {
          this.cartService.quant[i].quant -= 1;
          break;
        }
        i++;
      }
      this.cartService.addCartItem(produto, prodOrd, this.cartService.quant[i].quant, -1);
      this.cartComponent.removeFromCart(prodOrd.market);

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
        this.cartComponent.removeFromCart(prodOrd.market);
      } else {
        this.cartService.addCartItem(produto, prodOrd, this.cartService.quant[i].quant, 1);
      }

      this.quant = [];
      for (let quant of this.cartService.quant) {
        this.quant.push(quant.quant);
      }
    }
  }

  minPrice(name) {
    var prod: Produto[] = [];
    for (let produto of this.produtos) {
      if (produto.name == name) {
        prod.push(produto);
      }
    }
    prod.sort(function(a, b) {
      return a.price - b.price
    });
    return prod[0];
  }

  numi(name, market) {
    var i = 0;
    for (let produto of this.produtos) {
      if (produto.name == name && produto.market == market) {
        return i;
      }
      i++;
    }
  }

  cartLength(): number {
    this.refCart();
    var l = 0;
    for (let cart of this.cartService.quant) {
      l += cart.quant;
    }
    return l;
  }

  refCart() {
    this.quant = [];
    for (let quant of this.cartService.quant) {
      this.quant.push(quant.quant);
    }
  }

}
