package com.dreamfrag.dreamfrag.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import javax.validation.Valid;

@Controller
public class MainController {
    @Value("${spring.profiles.active:prod}")
    private String profile;

    @GetMapping("/")
    public String greeting(Model model) {
        model.addAttribute("isDevMode", "dev".equals(profile));

        return "main";
    }

}
