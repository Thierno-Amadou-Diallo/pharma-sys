import { Component, OnInit } from '@angular/core';
import { StockService } from './stock.service';
import { Stock } from './stock.model';

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html'
})
export class StocksComponent implements OnInit {
  stocks: Stock[] = [];
  chargement = true;

  constructor(private stockService: StockService) {}

 ngOnInit(): void {
  this.stockService.getAll().subscribe({
    next: data => {
      console.log('Stocks reçus:', data);
      this.stocks = data;
    },
    error: err => console.error('Erreur chargement stocks:', err),
    complete: () => this.chargement = false
  });
}

  getClasseStatut(statut: string): string {
    switch (statut) {
      case 'RUPTURE': return 'bg-red-100 text-red-700';
      case 'ALERTE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-700';
    }
  }
}