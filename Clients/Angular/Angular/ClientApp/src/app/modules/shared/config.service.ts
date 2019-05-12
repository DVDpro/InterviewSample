import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';
import { IConfig } from '../../models/config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  serverSettings: IConfig;

  private settingsLoadedSource = new Subject();
  settingsLoaded = this.settingsLoadedSource.asObservable();
  isReady: boolean = false;

  constructor(private http: HttpClient, private storage: StorageService) { }

  load() {
    const baseURI = document.baseURI.endsWith('/') ? document.baseURI : `${document.baseURI}/`;
    let url = `${baseURI}Api/Configuration`;
    this.http.get(url).subscribe((response) => {
      console.log('server settings loaded');
      this.serverSettings = response as IConfig;
      console.log(this.serverSettings);
      this.storage.IdentityServiceUrl = this.serverSettings.identityServiceUrl;
      this.storage.GateUrl = this.serverSettings.gateUrl;
      this.isReady = true;
      this.settingsLoadedSource.next();
    });
  }
}
