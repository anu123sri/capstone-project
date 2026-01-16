package com.example.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @RequestMapping(value = {
            "/",
            "/login",
            "/admin/**",
            "/rm/**",
            "/analyst/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}

