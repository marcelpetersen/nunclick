import {Injectable} from '@angular/core';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";


@Injectable()
export class ListaService {
  constructor(
    public af: AngularFireAuth,
    public db: AngularFireDatabase
  ) {

  }
}