import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivatevaluesComponent } from './privatevalues/privatevalues.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [PrivatevaluesComponent]
})
export class DataModule { }
