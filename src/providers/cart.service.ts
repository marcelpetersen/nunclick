import { Injectable, EventEmitter } from '@angular/core';

import { CartItem, Produto, ProdQuant } from '../models';

@Injectable()
export class CartService {
  public numP: number = 0;
  public cart: CartItem[] = [];
  public quant: ProdQuant[] = [];
  lFlag: boolean = false;
  public statusChanged = new EventEmitter<{ type: string; totalCount: number }>();

  getCart(): CartItem[] {
    return this.cart;
  };

  setCart(cart): void {
    this.cart = cart;
  };

  getQuant(): ProdQuant[] {
    return this.quant;
  };

  addCartItem(produto: Produto, prodOrd: Produto, quant: number, n): void {
    var num: number = 0;
    var index: number = -1;
    for (let i = 0; i < this.cart.length; i++) {
      if (this.cart[i].name == produto.name && this.cart[i].market == prodOrd.market) {
        index = 1;
        num = i;
        break;
      }
    }
    if (index == -1) {
      if (n != 0) {
        this.cart.push({
          name: produto.name,
          market: prodOrd.market,
          price: prodOrd.price,
          img: produto.img,
          quant: quant
        });
      }
    } else if (n == -1) {
      if (this.cart[num].quant != 1) {
        this.cart[num].quant = quant;
      } else {
        this.cart.splice(num, 1);
      }
    } else if (n == 1) {
      this.cart[num].quant = quant;
    } else if (n == 0) {
      if (this.cart[num].quant != 0) {
        this.cart.splice(num, 1);
      }
    }
  };

  removeCartItem(index): void {
    this.cart.splice(index, 1);
  };

  calcTotalSum(): number {
    var sum: number;
    sum = 0;

    if (!this.cart || !this.cart.length) {
      return sum;
    }

    for (let i = 0; i < this.cart.length; i = i + 1) {
      sum = sum + (this.cart[i].price * this.cart[i].quant);
    }
    return sum;
  }

  calcEachSum(mercado): number {
    var sum: number = 0;
    for (let i = 0; i < this.cart.length; i = i + 1) {
      if (this.cart[i].market == mercado) {
        sum = sum + (this.cart[i].price * this.cart[i].quant);
      }
    }
    return sum;
  }
}
