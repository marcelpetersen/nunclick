import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CartService} from '../../providers';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(
	  public navCtrl: NavController,
	  private cartService: CartService
  ) {

  }

}
