import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  username: string;
  isAuth = false;
  
  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      if (user) {
        this.isAuth = true;
        this.username = user.username;
      } else {
        this.isAuth = false;
      }
    });
  }

}
