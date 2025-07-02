import { Component, OnInit } from '@angular/core';
import { Produit, ProduitService } from '../produits/produit.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];
  afficherFormulaire = false;

  constructor(private produitService: ProduitService) {}

  ngOnInit() {
    this.chargerProduits();
  }

  chargerProduits() {
    this.produitService.getProduits().subscribe(data => {
      this.produits = data;
    });
  }

  ouvrirFormulaire() {
    this.afficherFormulaire = true;
  }

  fermerFormulaire() {
    this.afficherFormulaire = false;
  }

  ajouterProduitLocalement(produit: Produit) {
  this.produits.unshift(produit); // ajoute en haut du tableau
  this.fermerFormulaire();        // ferme le formulaire
}
}
