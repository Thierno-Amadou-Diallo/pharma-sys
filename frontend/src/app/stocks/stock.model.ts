export interface Produit {
  id: string;
  nom: string;
  code: string;
  prix: number;
  dateExpiration: string;
}

export interface Stock {
  id?: string;
  produit: Produit;
  quantite: number;
  seuilAlerte: number;
  dateMiseAJour: string;
  statut: 'NORMAL' | 'ALERTE' | 'RUPTURE';
}