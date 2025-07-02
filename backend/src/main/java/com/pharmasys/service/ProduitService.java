package com.pharmasys.service;

import com.pharmasys.model.Produit;
import com.pharmasys.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    public Optional<Produit> getProduitById(String id) {
        return produitRepository.findById(id);
    }

    public Produit addProduit(Produit produit) {
        return produitRepository.save(produit);
    }

    public Produit updateProduit(String id, Produit produitDetails) {
        return produitRepository.findById(id).map(p -> {
            p.setNom(produitDetails.getNom());
            p.setCode(produitDetails.getCode());
            p.setQuantite(produitDetails.getQuantite());
            p.setPrix(produitDetails.getPrix());
            p.setdate_expiration(produitDetails.getdate_expiration());
            p.setStatut(produitDetails.getStatut());
            return produitRepository.save(p);
        }).orElse(null);
    }

    public void deleteProduit(String id) {
        produitRepository.deleteById(id);
    }
}
