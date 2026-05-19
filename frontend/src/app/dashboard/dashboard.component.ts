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

  // Produits en alerte
  alertStocks: Produit[] = [];

  chartData = {
    labels: ['En stock', 'Alerte', 'Rupture'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
        borderWidth: 0
      }
    ]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      }
    }
  };

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {

    this.produitService.getProduits().subscribe(data => {

      this.produits = data;

      // Quantité totale
      this.totalQuantite = this.produits.reduce(
          (total, p) => total + p.quantite,
          0
      );

      // Rupture
      this.produitsRupture = this.produits.filter(
          p => p.statut === 'Rupture'
      );

      // Indisponible
      this.produitsIndisponibles = this.produits.filter(
          p => p.statut === 'Indisponible'
      );

      // Alerte = quantité faible
      this.alertStocks = this.produits.filter(
          p => p.quantite > 0 && p.quantite <= 5
      );

      // En stock
      const enStock = this.produits.filter(
          p => p.statut === 'En stock'
      ).length;

      // Alertes
      const alerte = this.alertStocks.length;

      // Rupture
      const rupture = this.produitsRupture.length;

      // Mise à jour du graphique
      this.chartData = {
        labels: ['En stock', 'Alerte', 'Rupture'],
        datasets: [
          {
            data: [enStock, alerte, rupture],
            backgroundColor: ['#22c55e', '#facc15', '#ef4444'],
            borderWidth: 0
          }
        ]
      };
    });
  }
}