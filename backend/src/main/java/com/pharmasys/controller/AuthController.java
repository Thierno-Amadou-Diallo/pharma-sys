package com.pharmasys.controller;

import com.pharmasys.model.User;
import com.pharmasys.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public User login(@RequestBody User loginRequest) {

        return authService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );
    }
}