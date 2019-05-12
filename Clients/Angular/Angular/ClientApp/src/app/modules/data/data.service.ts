import { Injectable } from '@angular/core';
import { ConfigService } from '../shared/config.service';
import { SecurityService } from '../shared/security.service';
import { StorageService } from '../shared/storage.service';
import { Observable, throwError }      from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private security: SecurityService, 
    private storageService: StorageService,
    private configService: ConfigService) { 
  }

  private setHeaders(options: any){
    if (this.security) {            
        options["headers"] = new HttpHeaders()
            .append('authorization', 'Bearer ' + this.security.GetToken());
    }
  }

  getPrivateValues(): Observable<string[]> {
    if (!this.security.IsAuthorized) {
      this.security.Authorize();
      return;
    }
    if (this.configService.isReady)
    {
      return this.doGet('/api/data/privateValues');
    }      
    else
    {
      this.configService.settingsLoaded.subscribe(x => {
        return this.doGet('/api/data/privateValues');
      });
    }    
  }

  private doGet(relativeUrl: string):Observable<any>{
    let url = this.storageService.GateUrl + relativeUrl;
    let options = { };
    this.setHeaders(options);
    
    return this.http.get(url, options)
        .pipe(
            map((res: string[]) => {
                return res;
            }),
            catchError(this.handleError)
        );
  }
  
  private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
        console.error('Client side network error occurred:', error.error.message);
    } else {
        console.error('Backend - ' +
            `status: ${error.status}, ` +
            `statusText: ${error.statusText}, ` +
            `message: ${error.error.message}`);
    }

    return throwError(error || 'server error');
  }
}
