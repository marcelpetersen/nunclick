import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';

@Injectable()
export class MapService {
	
	constructor(private http: Http){

	}

	getPlaces(): Observable<any> {
	    return this.http
	      .get('https://spreadsheets.google.com/feeds/list/1BH_UbW9maO1jm7y5OqipY7YWWQHNXjx2a_6sa4Q7OA4/1/public/values?alt=json')
	      .delay(0)
	      .map((res: Response) => res.json());
	  }
}