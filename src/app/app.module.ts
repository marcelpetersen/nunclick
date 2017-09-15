import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { MapPage } from '../pages/map/map';
import { RegisterPage } from '../pages/register/register';
import { OrderComponent } from '../pages/order/order.component';
import { CartComponent } from '../pages/cart/cart.component';
import { DetailComponent } from '../pages/detail/detail.component';
import { UserService} from '../providers/user.service';
import { ListasModalComponent } from '../components/listas/listas-modal.component';
import { CartIndicatorComponent } from '../components/cart-indicator/cart-indicator.component';
import { CartService, ListaService } from '../providers';
import { MapService } from '../providers/map.service';
import { ProdutoSearchPipe } from '../pipes';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export const firebaseConfig = {
  apiKey: "AIzaSyCkq_xNB4-IVBNoHuh2cpceGF2lNGCxFgY",
  authDomain: "nunclicklista.firebaseapp.com",
  databaseURL: "https://nunclicklista.firebaseio.com",
  projectId: "nunclicklista",
  storageBucket: "nunclicklista.appspot.com",
  messagingSenderId: "268139890399"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    LoginPage,
    HomePage,
    MapPage,
    RegisterPage,
    OrderComponent,
    CartComponent,
    DetailComponent,
    ListasModalComponent,
    CartIndicatorComponent,
    ProdutoSearchPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    LoginPage,
    HomePage,
    MapPage,
    RegisterPage,
    OrderComponent,
    CartComponent,
    DetailComponent,
    ListasModalComponent
  ],
  providers: [
    StatusBar,
    UserService,
    CartService,
    ListaService,
    MapService,
    HttpModule,
    CartComponent,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
