package com.pharmasys.repository;

import com.pharmasys.model.Stock;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface StockRepository extends MongoRepository<Stock, String> {
    
    @Query("{ 'produit.$id': ?0 }")
    Stock findByProduitId(String produitId);
    
    @Query("{ $expr: { $lte: ['$quantite', '$seuilAlerte'] } }")
    List<Stock> findStocksEnAlerte();
    
    @Query("{ 'statut': ?0 }")
    List<Stock> findByStatut(String statut);
    
    @Query(value = "{}", sort = "{ 'dateMiseAJour': -1 }")
    List<Stock> findAllByDateDesc();
}