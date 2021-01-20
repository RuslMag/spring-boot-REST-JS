package web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @GetMapping()
    public ModelAndView index() {
        return new ModelAndView("admin/index");
    }
}