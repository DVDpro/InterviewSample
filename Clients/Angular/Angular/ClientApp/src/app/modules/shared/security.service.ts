import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ConfigService }  from './config.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private actionUrl: string;
  private headers: Headers;
  private storage: StorageService;
  private authenticationSource = new Subject<boolean>();
  authenticationChallenge = this.authenticationSource.asObservable();

  public IsAuthorized: boolean;
  public UserData: any;

  constructor(private http: Http, private router: Router, private route: ActivatedRoute, private configService: ConfigService, private storageService: StorageService) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
    this.storage = storageService;

    this.IsAuthorized = this.storage.IsAuthorized;
    this.authenticationSource.next(true);
    this.UserData = this.storage.UserData;
  }

  public GetToken(): any {
    return this.storage.AuthorizationData;
  }

  public ResetAuthorizationData() {
    this.storage.AuthorizationData = '';
    this.storage.AuthorizationDataIdToken = '';
    this.IsAuthorized = false;
    this.storage.IsAuthorized = false;
  }

  public SetAuthorizationData(token: any, id_token: any) {
    if (this.storage.AuthorizationData !== '') {
      this.storage.AuthorizationData = '';
    }

    this.storage.AuthorizationData = token;
    this.storage.AuthorizationDataIdToken = id_token;
    this.IsAuthorized = true;
    this.storage.IsAuthorized = true;

    this.getUserData()
        .subscribe(data => {
            this.UserData = data;
            this.storage.UserData = data;
            // emit observable
            this.authenticationSource.next(true);
            window.location.href = location.origin;
        },
        error => this.HandleError(error),
        () => {
            console.log(this.UserData);
        });
  }

  public Authorize() {
    this.ResetAuthorizationData();

    let authorizationUrl = this.storage.IdentityServiceUrl + '/connect/authorize';
    let client_id = 'api.client.spa';
    let redirect_uri = location.origin + '/';
    let response_type = 'id_token token';
    let scope = 'openid profile data';
    let nonce = 'N' + Math.random() + '' + Date.now();
    let state = Date.now() + '' + Math.random();

    this.storage.AuthStateControl = state;
    this.storage.AuthNonce = nonce;

    let url =
        authorizationUrl + '?' +
        'response_type=' + encodeURI(response_type) + '&' +
        'client_id=' + encodeURI(client_id) + '&' +
        'redirect_uri=' + encodeURI(redirect_uri) + '&' +
        'scope=' + encodeURI(scope) + '&' +
        'nonce=' + encodeURI(nonce) + '&' +
        'state=' + encodeURI(state);

    window.location.href = url;
  }

  public AuthorizedCallback() {
    this.ResetAuthorizationData();

    let hash = window.location.hash.substr(1);

    let result: any = hash.split('&').reduce(function (result: any, item: string) {
        let parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
    }, {});

    console.log(result);

    let token = '';
    let id_token = '';
    let authResponseIsValid = false;

    if (!result.error) {

        if (result.state !== this.storage.AuthStateControl) {
            console.log('AuthorizedCallback incorrect state');
        } else {

            token = result.access_token;
            id_token = result.id_token;

            let dataIdToken: any = this.getDataFromToken(id_token);
            console.log(dataIdToken);

            // validate nonce
            if (dataIdToken.nonce !== this.storage.AuthNonce) {
                console.log('AuthorizedCallback incorrect nonce');
            } else {
                this.storage.AuthNonce = '';
                this.storage.AuthStateControl = '';

                authResponseIsValid = true;
                console.log('AuthorizedCallback state and nonce validated, returning access token');
            }
        }
    }


    if (authResponseIsValid) {
        this.SetAuthorizationData(token, id_token);
    }
}

public Logoff() {
    let authorizationUrl = this.storage.IdentityServiceUrl + '/connect/endsession';
    let id_token_hint = this.storage.AuthorizationDataIdToken;
    let post_logout_redirect_uri = location.origin + '/';

    let url =
        authorizationUrl + '?' +
        'id_token_hint=' + encodeURI(id_token_hint) + '&' +
        'post_logout_redirect_uri=' + encodeURI(post_logout_redirect_uri);

    this.ResetAuthorizationData();

    // emit observable
    this.authenticationSource.next(false);
    window.location.href = url;
}

public HandleError(error: any) {
    console.log(error);
    if (error.status == 403) {
        this.router.navigate(['/Forbidden']);
    }
    else if (error.status == 401) {
        // this.ResetAuthorizationData();
        this.router.navigate(['/Unauthorized']);
    }
}

private urlBase64Decode(str: string) {
    let output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }

    return window.atob(output);
}

private getDataFromToken(token: any) {
    let data = {};
    if (typeof token !== 'undefined') {
        let encoded = token.split('.')[1];
        data = JSON.parse(this.urlBase64Decode(encoded));
    }

    return data;
}

private getUserData = (): Observable<string[]> => {
    this.setHeaders();
    return this.http.get(this.storage.IdentityServiceUrl + '/connect/userinfo', {
        headers: this.headers,
        body: ''
    }).pipe(map(res => res.json()));
}

private setHeaders() {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');

    let token = this.GetToken();

    if (token !== '') {
        this.headers.append('Authorization', 'Bearer ' + token);
    }
}
}
