import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule} from '@angular/common';
import { SecurityService } from './security.service';
import { ConfigService } from './config.service';
import { StorageService } from './storage.service';
import { AuthComponent } from './auth/auth.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [AuthComponent],
  exports: [AuthComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
      return {
          ngModule: SharedModule,
          providers: [
              SecurityService, 
              ConfigService, 
              StorageService,
          ]
      };
  }
}