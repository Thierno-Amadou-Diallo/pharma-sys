package com.pharmasys.service;

import com.pharmasys.model.Produit;
import com.pharmasys.model.Stock;
import com.pharmasys.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {
    private final StockRepository stockRepository;

    public StockService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public Stock creerStock(Produit produit, int quantiteInitiale, int seuilAlerte) {
        Stock stock = new Stock(produit, quantiteInitiale, seuilAlerte);
        return stockRepository.save(stock);
    }

    public Stock ajusterStock(String produitId, int quantite) {
        Stock stock = stockRepository.findByProduitId(produitId);
        if (stock != null) {
            stock.setQuantite(quantite);
            return stockRepository.save(stock);
        }
        return null;
    }

    public List<Stock> getStocksEnAlerte() {
        return stockRepository.findStocksEnAlerte();
    }

    public Stock getStockByProduit(String produitId) {
        return stockRepository.findByProduitId(produitId);
    }

    public List<Stock> getAllStocks() {
        return stockRepository.findAllByDateDesc();
    }
}