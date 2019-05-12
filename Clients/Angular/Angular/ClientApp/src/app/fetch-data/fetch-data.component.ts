import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../modules/shared/config.service';
import { StorageService} from '../modules/shared/storage.service';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent implements OnInit {
  public values: string[];
  public valuesLoadingMessage: string;

  constructor(private http: HttpClient, private configService:ConfigService, private storageService: StorageService) {     
  }
  
  ngOnInit() {
    if (this.configService.isReady)
    {
      this.loadData();
    }      
    else
    {
      this.configService.settingsLoaded.subscribe(x => {
        this.loadData();
      });
    }      
  }   

  private loadData()
  {
    this.http.get<string[]>(this.storageService.GateUrl + '/api/Data/Values').subscribe(result => {
      this.values = result;
    }, error =>{
      console.error(error);
      this.valuesLoadingMessage = error.message
    });
  }
}
