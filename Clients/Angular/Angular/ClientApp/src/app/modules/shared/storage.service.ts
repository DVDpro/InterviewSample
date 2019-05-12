import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage;

  constructor() {
      this.storage = sessionStorage;
  }

  private retrieveValue<TValue>(key: string): TValue {
      let item = this.storage.getItem(key);

      if (item && item !== 'undefined') {
          return JSON.parse(this.storage.getItem(key));
      }
      return;
  }

  private storeValue<TValue>(key: string, value: TValue) {
      this.storage.setItem(key, JSON.stringify(value));
  }

  get GateUrl(): string
  {
    return this.retrieveValue<string>('gateUrl');
  }
  set GateUrl(value: string)
  {
    this.storeValue('gateUrl', value);
  }

  get IdentityServiceUrl(): string
  {
    return this.retrieveValue<string>('identityServiceUrl');
  }
  set IdentityServiceUrl(value: string)
  {
    this.storeValue('identityServiceUrl', value);
  }

  get IsAuthorized(): boolean
  {
    return this.retrieveValue<any>("isAuthorized");
  }

  set IsAuthorized(value: boolean)
  {
    this.storeValue("isAuthorized", value);
  }

  get UserData(): any
  {
    return this.retrieveValue<any>("userData");
  }
  set UserData(value: any)
  {
    this.storeValue<any>("userData", value);
  }
  
  get AuthorizationData(): any
  {
    return this.retrieveValue<any>("authorizationData");
  }
  set AuthorizationData(value: any)
  {
    this.storeValue<any>("authorizationData", value);
  }

  get AuthorizationDataIdToken(): any
  {
    return this.retrieveValue<any>("authorizationDataIdToken");
  }
  set AuthorizationDataIdToken(value:any) 
  {
    this.storeValue<any>("authorizationDataIdToken", value);
  }

  get AuthStateControl(): string
  {
    return this.retrieveValue<string>("authStateControl");
  }
  set AuthStateControl(value:string) 
  {
    this.storeValue<string>("authStateControl", value);
  }

  get AuthNonce(): string
  {
    return this.retrieveValue<string>("authNonce");
  }
  set AuthNonce(value:string) 
  {
    this.storeValue<string>("authNonce", value);
  }
  
  
  
}
