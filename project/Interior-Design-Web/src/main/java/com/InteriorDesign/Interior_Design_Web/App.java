package com.InteriorDesign.Interior_Design_Web;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import service.Product;
import service.ScrapeService;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
public class App {

    public ScrapeService scrapeService;
    public final String ikeaURL = "https://www.ikea.com/gb/en/cat/products-products/";


    //http://localhost:8080/home
    @RequestMapping("/home")
    @ResponseBody   // will return whatever is in the return to the browser.
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


    @PostMapping("/scrapeMethod")
    public List<Product> ScrapeList(@RequestBody QueryClass searchJSON) throws IOException, InterruptedException {
        String searchQuery = searchJSON.getQuery();

        if (scrapeService == null) scrapeService = new ScrapeService();
        //scrapeService.Close();

        return scrapeService.NavigateAndExtract(ikeaURL, searchQuery);
    }

    @PostMapping("/scrapeContinue")
    public List<Product> ScrapeContinueList(@RequestBody QueryClass searchJSON) throws IOException, InterruptedException {

        List<Product> products = scrapeService.ExtractNextPage();
        scrapeService.Close();

        return products;
    }

}


/* this class defines the json that is sent from the front end. it correctly places all the values within the JSON
    to the class and matches them. */

class QueryClass {
    private String query;

    public void setQuery(String query) {
        this.query = query;
    }

    public String getQuery() {
        return query;
    }


}