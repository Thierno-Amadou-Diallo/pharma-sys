package com.pharmasys.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "produits")
public class Produit {

    @Id
    private String id;
    private String nom;
    private String code;
    private int quantite;
    private double prix;
    private String date_expiration;
    private String statut;

    public Produit() {}

    public Produit(String nom, String code, int quantite, double prix, String date_expiration, String statut) {
        this.nom = nom;
        this.code = code;
        this.quantite = quantite;
        this.prix = prix;
        this.date_expiration = date_expiration;
        this.statut = statut;
    }

    // Getters et setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public int getQuantite() { return quantite; }
    public void setQuantite(int quantite) { this.quantite = quantite; }

    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }

    public String getdate_expiration() { return date_expiration; }
    public void setdate_expiration(String date_expiration) { this.date_expiration = date_expiration; }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }
}
