import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../shared/security.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  authenticated: boolean = false;
  private subscription: Subscription;
  private userName: string = '';

  constructor(private security: SecurityService) { 
    
  }

  ngOnInit() {
    this.subscription = this.security.authenticationChallenge.subscribe(res => {
      this.authenticated = res;
      this.userName = this.security.UserData.email;
    });

    if (window.location.hash) {
      this.security.AuthorizedCallback();
    }

    this.authenticated = this.security.IsAuthorized;
    if (this.authenticated) {
      if (this.security.UserData)
          this.userName = this.security.UserData.name;
    }
  }

  logoutClicked(event: any) {
    event.preventDefault();
    this.logout();
  }

  login() {
    this.security.Authorize();
  }

  logout() {
    this.security.Logoff();
  }

}
