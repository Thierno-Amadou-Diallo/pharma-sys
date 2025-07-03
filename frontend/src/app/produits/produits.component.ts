import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Produit, ProduitService } from '../produits/produit.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];
  afficherFormulaire = false;
  produitEnEdition: Produit | null = null;
  formulaireProduit: FormGroup;
  envoiEnCours = false;

  // 🔥 Boîte de dialogue de suppression
  produitASupprimer: Produit | null = null;

  // 🔽 Référence au formulaire pour scroll
  @ViewChild('formulaireProduitRef') formulaireProduitElement!: ElementRef;

  constructor(
    private produitService: ProduitService,
    private fb: FormBuilder
  ) {
    this.formulaireProduit = this.fb.group({
      nom: ['', Validators.required],
      code: ['', Validators.required],
      quantite: [1, [Validators.required, Validators.min(0)]],
      prix: [null, [Validators.required, Validators.min(0)]],
      date_expiration: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.chargerProduits();
  }

  chargerProduits() {
    this.produitService.getProduits().subscribe(data => {
      this.produits = data;
    });
  }

  get currentStatut() {
    const quantite = this.formulaireProduit.get('quantite')?.value || 0;
    if (quantite === 0) {
      return {
        text: 'Indisponible',
        class: 'bg-red-100 text-red-800',
        icon: 'ri-close-line text-red-600'
      };
    } else if (quantite <= 5) {
      return {
        text: 'Rupture',
        class: 'bg-amber-100 text-amber-800',
        icon: 'ri-alert-line text-amber-600'
      };
    } else {
      return {
        text: 'En stock',
        class: 'bg-green-100 text-green-800',
        icon: 'ri-check-line text-green-600'
      };
    }
  }

  ouvrirFormulaireAjout() {
    this.produitEnEdition = null;
    this.formulaireProduit.reset({
      quantite: 1
    });
    this.afficherFormulaire = true;
  }

  commencerModification(produit: Produit) {
    this.produitEnEdition = produit;
    this.formulaireProduit.patchValue({
      nom: produit.nom,
      code: produit.code,
      quantite: produit.quantite,
      prix: produit.prix,
      date_expiration: produit.date_expiration.split('T')[0] // Format pour input date
    });
    this.afficherFormulaire = true;

    // 🔽 Scroll vers le formulaire après affichage
    setTimeout(() => {
      this.formulaireProduitElement?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  onSubmit() {
    if (this.formulaireProduit.invalid) return;

    this.envoiEnCours = true;
    const produitData = {
      ...this.formulaireProduit.value,
      statut: this.currentStatut.text
    };

    if (this.produitEnEdition) {
      this.produitService.modifierProduit(this.produitEnEdition.id, produitData)
        .subscribe({
          next: (produit) => {
            const index = this.produits.findIndex(p => p.id === produit.id);
            if (index !== -1) this.produits[index] = produit;
            this.fermerFormulaire();
          },
          error: (err) => console.error(err),
          complete: () => this.envoiEnCours = false
        });
    } else {
      this.produitService.ajouterProduit(produitData)
        .subscribe({
          next: (produit) => {
            this.produits.unshift(produit);
            this.fermerFormulaire();
          },
          error: (err) => console.error(err),
          complete: () => this.envoiEnCours = false
        });
    }
  }

  // 🆕 Ouvre la boîte de confirmation
  demanderSuppression(produit: Produit) {
    this.produitASupprimer = produit;
  }

  // 🆕 Annule la boîte de confirmation
  annulerSuppression() {
    this.produitASupprimer = null;
  }

  // 🆕 Confirme et exécute la suppression
  confirmerSuppression() {
    if (this.produitASupprimer) {
      this.produitService.supprimerProduit(this.produitASupprimer.id).subscribe({
        next: () => {
          this.produits = this.produits.filter(p => p.id !== this.produitASupprimer!.id);
          this.produitASupprimer = null;
        },
        error: (err) => console.error(err)
      });
    }
  }

  fermerFormulaire() {
    this.afficherFormulaire = false;
    this.produitEnEdition = null;
    this.envoiEnCours = false;
  }
}
