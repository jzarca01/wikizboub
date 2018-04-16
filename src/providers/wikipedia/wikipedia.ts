import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { WikiEntry, WikiResult } from '../../app/common/wiki';

/*
  Generated class for the WikiServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WikiProvider {

  private wikiUrl: string = "https://fr.wikipedia.org/w/api.php";

  constructor(public http: HttpClient) {
    console.log('Hello WikiServiceProvider Provider');
  }

  getPagesByLocation(latitude: Number, longitude: Number): Observable<WikiEntry[]> {
    const params = new HttpParams().set("format","json").set("action", "query").set("list", "geosearch").set("gscoord",`${latitude}|${longitude}`).set("gsradius", "10000").set("gslimit", "10").set("origin","*");
    return this.http.get<WikiResult>(this.wikiUrl, { params })
    .pipe(
      map(data => data.query.geosearch)
    );
  }

}
