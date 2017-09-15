import { NgModule } from '@angular/core';
import { RoutePage} from './route';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [RoutePage],
  imports: [IonicPageModule.forChild(RoutePage)],
  entryComponents: [RoutePage]
})
export class RouteModule { }