import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  activeMenu = 'dashboard';

  currentDate = new Date().toLocaleDateString('fr-FR');

  // USER connecté
  currentUser: any;

  constructor(
      private authService: AuthService,
      private router: Router
  ) {
  }

  ngOnInit(): void {

    // récupère le user depuis le localStorage
    this.currentUser = this.authService.getUser();

  }

  logout(): void {

    const confirmation = confirm(
        'Voulez-vous vraiment vous déconnecter ?'
    );

    if (confirmation) {

      this.authService.logout();

      this.router.navigate(['/login']);
    }
  }

}