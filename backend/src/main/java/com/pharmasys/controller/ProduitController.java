package com.pharmasys.controller;

import com.pharmasys.model.Produit;
import com.pharmasys.service.ProduitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = "*")
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    @GetMapping
    public List<Produit> getAllProduits() {
        return produitService.getAllProduits();
    }

    @GetMapping("/{id}")
    public Optional<Produit> getProduit(@PathVariable String id) {
        return produitService.getProduitById(id);
    }

    @PostMapping
    public Produit addProduit(@RequestBody Produit produit) {
        return produitService.addProduit(produit);
    }

    @PutMapping("/{id}")
    public Produit updateProduit(@PathVariable String id, @RequestBody Produit produit) {
        return produitService.updateProduit(id, produit);
    }

    @DeleteMapping("/{id}")
    public void deleteProduit(@PathVariable String id) {
        produitService.deleteProduit(id);
    }
}
