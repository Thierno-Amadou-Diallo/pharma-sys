import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stock } from './stock.model';

@Injectable({ providedIn: 'root' })
export class StockService {
  private apiUrl = 'http://localhost:8080/api/stocks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Stock[]> {
    return this.http.get<Stock[]>(this.apiUrl);
  }

  getAlertes(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.apiUrl}/alertes`);
  }

  getByProduit(produitId: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.apiUrl}/produit/${produitId}`);
  }

  creer(produitId: string, quantite: number, seuilAlerte: number): Observable<Stock> {
    return this.http.post<Stock>(this.apiUrl, null, {
      params: {
        produitId,
        quantite: quantite.toString(),
        seuilAlerte: seuilAlerte.toString()
      }
    });
  }

  mettreAJour(produitId: string, quantite: number): Observable<Stock> {
    return this.http.put<Stock>(`${this.apiUrl}/${produitId}`, null, {
      params: { quantite: quantite.toString() }
    });
  }
}