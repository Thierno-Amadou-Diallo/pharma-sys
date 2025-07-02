package com.pharmasys.repository;

import com.pharmasys.model.Produit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProduitRepository extends MongoRepository<Produit, String> {}
