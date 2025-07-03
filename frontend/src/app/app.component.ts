import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  produits: any[] = [];
  currentDate: string;
  activeMenu: string = ''; // Nouvelle propriété pour suivre le menu actif


  constructor(private http: HttpClient) {
    this.currentDate = this.getFormattedDate();
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:8080/api/produits').subscribe(data => {
      this.produits = data;
    });
  }

  private getFormattedDate(): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date().toLocaleDateString('fr-FR', options);
  }

   // Nouvelle méthode pour gérer la sélection du menu
  setActiveMenu(menu: string) {
    this.activeMenu = menu;
  }
}