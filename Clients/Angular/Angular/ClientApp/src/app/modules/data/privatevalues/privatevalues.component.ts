import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-privatevalues',
  templateUrl: './privatevalues.component.html',
  styleUrls: ['./privatevalues.component.css']
})
export class PrivatevaluesComponent implements OnInit {
  public values: string[];
  public valuesLoadingMessage: string;

  constructor(private dataService: DataService) { 
  }

  ngOnInit() {
    this.dataService.getPrivateValues().subscribe(values=>{
      this.values = values;
    }, error =>{
      console.error(error);
      this.valuesLoadingMessage = error.message
    });
  }

}
