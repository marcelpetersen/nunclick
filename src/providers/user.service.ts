import { Injectable } from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";

@Injectable()
export class UserService {
	usuario: FirebaseListObservable<any[]>;
	uid: string;
	slg: Boolean;
	myUser: any;
	objectSub: any;
	objectSubOrder: any;
	objectSubDetail: any;
	objectSubDetail2: any;
	userLatLng: any;

	constructor(
		public af: AngularFireAuth,
		public db: AngularFireDatabase
	){
		af.authState.subscribe(user => {
			if(user != null){
				this.usuario = db.list('/users/'+ user.uid);
				this.uid = user.uid;
			}
		});
	}
}