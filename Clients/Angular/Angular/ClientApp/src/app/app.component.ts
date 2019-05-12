import { Component } from '@angular/core';
import { ConfigService } from './modules/shared/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private configService: ConfigService) {
    configService.load();
  }
}
