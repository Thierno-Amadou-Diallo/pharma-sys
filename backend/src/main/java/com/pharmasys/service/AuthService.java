package com.pharmasys.service;

import com.pharmasys.model.User;
import com.pharmasys.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User login(String email, String password) {

        Optional<User> userOptional =
                userRepository.findByEmail(email);

        if (userOptional.isPresent()) {

            User user = userOptional.get();

            // Vérification mot de passe
            if (user.getPassword().equals(password)) {

                return user;
            }
        }

        return null;
    }
}