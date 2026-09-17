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

  nombreFiltresActifs = 0;

  produitsFiltres: Produit[] = [];
  produitsParPage = 8;
  pageActuelle = 1;
  rechercheProduit = '';
  filtreStatut = 'Tous';
  filtreStock = 'Tous';
  filtreExpiration = 'Tous';


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
      this.produitsFiltres = [...this.produits];
    });
  }

  get produitsAffiches(): Produit[] {
    const debut = (this.pageActuelle - 1) * this.produitsParPage;
    const fin = debut + this.produitsParPage;

    return this.produitsFiltres.slice(debut, fin);
  }

  get nombrePages(): number {
    return Math.ceil(this.produitsFiltres.length / this.produitsParPage);
  }

  changerPage(page: number): void {
    if (page < 1 || page > this.nombrePages) {
      return;
    }

    this.pageActuelle = page;
  }

  filtrerProduits(): void {

    this.nombreFiltresActifs = 0;

    if (this.rechercheProduit.trim() !== '') {
      this.nombreFiltresActifs++;
    }

    if (this.filtreStatut !== 'Tous') {
      this.nombreFiltresActifs++;
    }

    if (this.filtreStock !== 'Tous') {
      this.nombreFiltresActifs++;
    }

    if (this.filtreExpiration !== 'Tous') {
      this.nombreFiltresActifs++;
    }

    const recherche = this.rechercheProduit.toLowerCase().trim();

    this.produitsFiltres = this.produits.filter(produit => {

      // Recherche par nom ou code
      const correspondRecherche =
          !recherche ||
          produit.nom.toLowerCase().includes(recherche) ||
          produit.code.toLowerCase().includes(recherche);

      // Filtre statut
      const correspondStatut =
          this.filtreStatut === 'Tous' ||
          produit.statut === this.filtreStatut;

      // Filtre stock
      let correspondStock = true;

      if (this.filtreStock === 'Faible') {
        correspondStock =
            produit.quantite > 0 && produit.quantite <= 5;
      }

      if (this.filtreStock === 'Rupture') {
        correspondStock = produit.quantite <= 0;
      }

      // Filtre expiration
      let correspondExpiration = true;

      if (this.filtreExpiration === 'Proche') {
        correspondExpiration = this.estExpirationProche(
            produit.date_expiration
        );
      }

      return (
          correspondRecherche &&
          correspondStatut &&
          correspondStock &&
          correspondExpiration
      );
    });
  }

  estExpirationProche(dateExpiration: string): boolean {
    if (!dateExpiration) {
      return false;
    }

    let dateExp: Date;

    if (dateExpiration.includes('/')) {
      const [jour, mois, annee] =
          dateExpiration.split('/').map(Number);

      dateExp = new Date(annee, mois - 1, jour);
    } else {
      const [annee, mois, jour] =
          dateExpiration.split('-').map(Number);

      dateExp = new Date(annee, mois - 1, jour);
    }

    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);
    dateExp.setHours(0, 0, 0, 0);

    const diffTime =
        dateExp.getTime() - aujourdHui.getTime();

    const diffJours =
        Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffJours >= 0 && diffJours <= 30;
  }

  reinitialiserFiltres(): void {
    this.rechercheProduit = '';
    this.filtreStatut = 'Tous';
    this.filtreStock = 'Tous';
    this.filtreExpiration = 'Tous';
    this.nombreFiltresActifs = 0;

    this.produitsFiltres = [...this.produits];
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

      // MODIFICATION
      this.produitService
          .modifierProduit(this.produitEnEdition.id, produitData)
          .subscribe({
            next: (produit) => {

              const index = this.produits.findIndex(
                  p => p.id === produit.id
              );

              if (index !== -1) {
                this.produits[index] = produit;
              }

              // Met à jour les résultats filtrés
              this.filtrerProduits();

              this.fermerFormulaire();
            },

            error: (err) => {
              console.error(err);
              this.envoiEnCours = false;
            },

            complete: () => {
              this.envoiEnCours = false;
            }
          });

    } else {

      // AJOUT
      this.produitService
          .ajouterProduit(produitData)
          .subscribe({
            next: (produit) => {

              this.produits.unshift(produit);

              // Très important :
              // met à jour la liste affichée
              this.filtrerProduits();

              this.fermerFormulaire();
            },

            error: (err) => {
              console.error(err);
              this.envoiEnCours = false;
            },

            complete: () => {
              this.envoiEnCours = false;
            }
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

  exporterProduits(): void {
    const produitsAExporter = this.produitsFiltres;

    if (produitsAExporter.length === 0) {
      return;
    }

    const lignes = produitsAExporter.map(produit => ({
      Nom: produit.nom,
      Code: produit.code,
      Quantite: produit.quantite,
      Prix: produit.prix,
      Expiration: produit.date_expiration,
      Statut: produit.statut
    }));

    const csv = [
      Object.keys(lignes[0]).join(';'),
      ...lignes.map(ligne =>
          Object.values(ligne)
              .map(value => `"${value ?? ''}"`)
              .join(';')
      )
    ].join('\n');

    const blob = new Blob(
        ['\ufeff' + csv],
        { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const lien = document.createElement('a');

    lien.href = url;
    lien.download = 'medicaments.csv';
    lien.click();

    URL.revokeObjectURL(url);
  }
}
