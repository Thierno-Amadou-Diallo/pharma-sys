import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitService, Produit } from '../produits/produit.service';

const SEUIL_RUPTURE = 5; // Définissez votre seuil ici

@Component({
  selector: 'app-ajouter-produit',
  templateUrl: './ajouter-produit.component.html',
})
export class AjouterProduitComponent {
  formulaireProduit: FormGroup;
  envoiEnCours = false;
  messageSucces = '';
  messageErreur = '';

  @Output() produitAjoute = new EventEmitter<Produit>();
  @Output() fermer = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private produitService: ProduitService) {
    this.formulaireProduit = this.fb.group({
      nom: ['', Validators.required],
      code: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(0)]],
      prix: [null, [Validators.required, Validators.min(0)]],
      date_expiration: ['', Validators.required],
      // Le champ statut a été retiré car calculé automatiquement
    });
  }

  // Méthode pour déterminer le statut
  getStatut(quantite: number): string {
    if (quantite === 0) return 'Indisponible';
    if (quantite <= SEUIL_RUPTURE) return 'Rupture';
    return 'En stock';
  }

  // Propriété calculée pour optimiser le template
  get currentStatut() {
    const quantite = this.formulaireProduit.get('quantite')?.value ?? 0;
    return {
      text: this.getStatut(quantite),
      class: this.getStatutClass(quantite),
      icon: this.getStatutIcon(quantite)
    };
  }

  private getStatutClass(quantite: number): string {
    const statut = this.getStatut(quantite);
    return {
      'En stock': 'bg-green-50 text-green-800',
      'Rupture': 'bg-amber-50 text-amber-800',
      'Indisponible': 'bg-red-50 text-red-800'
    }[statut];
  }

  private getStatutIcon(quantite: number): string {
    const statut = this.getStatut(quantite);
    return {
      'En stock': 'ri-checkbox-circle-line text-green-500',
      'Rupture': 'ri-alert-line text-amber-500',
      'Indisponible': 'ri-close-circle-line text-red-500'
    }[statut];
  }

  envoyer() {
    if (this.formulaireProduit.invalid) {
      this.formulaireProduit.markAllAsTouched();
      return;
    }

    this.envoiEnCours = true;
    this.messageSucces = '';
    this.messageErreur = '';

    const formValue = this.formulaireProduit.value;
    const produit: Produit = {
      ...formValue,
      statut: this.getStatut(formValue.quantite) // Ajout du statut calculé
    };

    this.produitService.ajouterProduit(produit).subscribe({
      next: (produitAjoute) => {
        this.messageSucces = 'Produit ajouté avec succès !';
        this.produitAjoute.emit(produitAjoute);
        this.formulaireProduit.reset({ quantite: 1 });
        this.envoiEnCours = false;
      },
      error: () => {
        this.messageErreur = "Erreur lors de l'ajout du produit.";
        this.envoiEnCours = false;
      }
    });
  }
}