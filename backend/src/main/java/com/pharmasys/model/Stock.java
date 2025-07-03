package com.pharmasys.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import java.time.LocalDateTime;

@Document(collection = "stocks")
public class Stock {
    @Id
    private String id;
    
    @DBRef(lazy = false)
    private Produit produit;
    
    private int quantite;
    private int seuilAlerte;
    private LocalDateTime dateMiseAJour;
    private String statut; // "NORMAL", "ALERTE", "RUPTURE"

    public Stock() {
        this.dateMiseAJour = LocalDateTime.now();
        this.statut = "NORMAL";
    }

    public Stock(Produit produit, int quantite, int seuilAlerte) {
        this();
        this.produit = produit;
        this.quantite = quantite;
        this.seuilAlerte = seuilAlerte;
        updateStatut();
    }

    // Méthode pour mettre à jour le statut
    public void updateStatut() {
        if (quantite <= 0) {
            this.statut = "RUPTURE";
        } else if (quantite <= seuilAlerte) {
            this.statut = "ALERTE";
        } else {
            this.statut = "NORMAL";
        }
        this.dateMiseAJour = LocalDateTime.now();
    }

    // Getters et Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Produit getProduit() { return produit; }
    public void setProduit(Produit produit) { this.produit = produit; }
    
    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { 
        this.quantite = quantite; 
        updateStatut();
    }
    
    public int getSeuilAlerte() { return seuilAlerte; }
    public void setSeuilAlerte(int seuilAlerte) { 
        this.seuilAlerte = seuilAlerte;
        updateStatut();
    }
    
    public LocalDateTime getDateMiseAJour() { return dateMiseAJour; }
    public void setDateMiseAJour(LocalDateTime dateMiseAJour) { this.dateMiseAJour = dateMiseAJour; }
    
    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}