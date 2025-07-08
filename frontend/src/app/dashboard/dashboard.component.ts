import { Component, OnInit } from '@angular/core';
import { ProduitService, Produit } from '../produits/produit.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  produits: Produit[] = [];
  totalQuantite = 0;
  produitsRupture: Produit[] = [];
  produitsIndisponibles: Produit[] = [];

  chartData: number[] = [];
  chartLabels = ['En stock', 'Rupture', 'Indisponible'];
  chartColors = ['#22c55e', '#facc15', '#ef4444'];

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.produitService.getProduits().subscribe(data => {
      this.produits = data;

      this.totalQuantite = this.produits.reduce((total, p) => total + p.quantite, 0);
      this.produitsRupture = this.produits.filter(p => p.statut === 'Rupture');
      this.produitsIndisponibles = this.produits.filter(p => p.statut === 'Indisponible');

      const enStock = this.produits.filter(p => p.statut === 'En stock').length;
      const rupture = this.produitsRupture.length;
      const indispo = this.produitsIndisponibles.length;

      this.chartData = [enStock, rupture, indispo];
    });
  }
}
