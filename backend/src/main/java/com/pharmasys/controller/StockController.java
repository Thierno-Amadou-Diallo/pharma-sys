package com.pharmasys.controller;

import com.pharmasys.model.Produit;
import com.pharmasys.model.Stock;
import com.pharmasys.service.ProduitService;
import com.pharmasys.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/stocks")
public class StockController {
    private final StockService stockService;
    private final ProduitService produitService;

    public StockController(StockService stockService, ProduitService produitService) {
        this.stockService = stockService;
        this.produitService = produitService;
    }

    @PostMapping
    public ResponseEntity<Stock> creerStock(
            @RequestParam String produitId,
            @RequestParam int quantite,
            @RequestParam int seuilAlerte) {
        
        Optional<Produit> optionalProduit = produitService.getProduitById(produitId);
        if (optionalProduit.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Produit produit = optionalProduit.get();
        Stock nouveauStock = stockService.creerStock(produit, quantite, seuilAlerte);
        return ResponseEntity.ok(nouveauStock);
    }

    @PutMapping("/{produitId}")
    public ResponseEntity<Stock> mettreAJourStock(
            @PathVariable String produitId,
            @RequestParam int quantite) {
        
        Stock stock = stockService.ajusterStock(produitId, quantite);
        return stock != null 
                ? ResponseEntity.ok(stock) 
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/alertes")
    public ResponseEntity<List<Stock>> getAlertes() {
        return ResponseEntity.ok(stockService.getStocksEnAlerte());
    }

    @GetMapping("/produits/{produitId}")
    public ResponseEntity<Stock> getStockByProduit(@PathVariable String produitId) {
        Stock stock = stockService.getStockByProduit(produitId);
        return stock != null 
                ? ResponseEntity.ok(stock) 
                : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks() {
        return ResponseEntity.ok(stockService.getAllStocks());
    }
}
