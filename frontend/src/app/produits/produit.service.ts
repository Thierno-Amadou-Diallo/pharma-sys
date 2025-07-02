import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produit {
  id?: string;
  nom: string;
  code: string;
  quantite: number;
  prix: number;
  date_expiration: string;
  statut: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8080/api/produits';

  constructor(private http: HttpClient) {}

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  getProduit(id: string): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  ajouterProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

  modifierProduit(id: string, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
  }

  supprimerProduit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
