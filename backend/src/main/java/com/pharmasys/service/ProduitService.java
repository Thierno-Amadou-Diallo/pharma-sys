package com.pharmasys.service;

import com.pharmasys.model.Produit;
import com.pharmasys.model.Stock;
import com.pharmasys.repository.ProduitRepository;
import com.pharmasys.repository.StockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    @Autowired
    private StockRepository stockRepository;

    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    public Optional<Produit> getProduitById(String id) {
        return produitRepository.findById(id);
    }

    public Produit addProduit(Produit produit) {

        Produit produitEnregistree = produitRepository.save(produit);
        int seuilAuto;

        // Création automatique du stock

        if (produit.getQuantite() <= 20) {
            seuilAuto = 5;
        } else if (produit.getQuantite() <= 100) {
            seuilAuto = 10;
        } else {
            seuilAuto = 20;
        }

        Stock stock = new Stock(
                produitEnregistree,
                produit.getQuantite(),
                seuilAuto
        );
        stockRepository.save(stock);

        return produitEnregistree;
    }

    public Produit updateProduit(String id, Produit produitDetails) {
        return produitRepository.findById(id).map(p -> {
            p.setNom(produitDetails.getNom());
            p.setCode(produitDetails.getCode());
            p.setQuantite(produitDetails.getQuantite());
            p.setPrix(produitDetails.getPrix());
            p.setdate_expiration(produitDetails.getdate_expiration());
            p.setStatut(produitDetails.getStatut());

            p.setSeuilAlerte(produitDetails.getSeuilAlerte());
            Produit produitUpdated = produitRepository.save(p);

            // Recherche du stock lié
            Stock stock = stockRepository.findByProduitId(p.getId());

            if (stock != null) {

                stock.setQuantite(produitDetails.getQuantite());

                // Seuil automatique
                int seuilAuto;

                if (produitDetails.getQuantite() <= 20) {
                    seuilAuto = 5;
                } else if (produitDetails.getQuantite() <= 100) {
                    seuilAuto = 10;
                } else {
                    seuilAuto = 20;
                }

                stock.setSeuilAlerte(seuilAuto);

                // Mise à jour du statut
                stock.updateStatut();

                stockRepository.save(stock);
            }

            return produitUpdated;

        }).orElse(null);
    }

    public void deleteProduit(String id) {
        produitRepository.deleteById(id);
    }
}
