package com.InteriorDesign.Interior_Design_Web;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@RestController
public class App {

    //http://localhost:8080/home
    @RequestMapping("/home")
    @ResponseBody   // will return what ever is in the return to the browser.
    public String displayIndex() {
        // this will be looking for a view

        /*WHEN using Resources folder.....
          > for regular static views, you can place them in static.
          > if using thymeleaf, then you use templates */
        return "index";
    }

    /* sends a request to get the json file */
    @GetMapping("/json/interiorObjects")
    public String GetJSONInteriorObjects() throws IOException {
        System.out.println("[SERVER] - Requested JSON from folder. ");
        ClassPathResource resource = new ClassPathResource("objectsJSON/interiorObjects.json");

        // Open the file as InputStream
        InputStream inputStream = resource.getInputStream();
        return StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
    }

}
