package com.InteriorDesign.Interior_Design_Web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@RestController
public class APIAccess {

    @Value("${restapi.key}")
    private String apiKey;

    @GetMapping("/rapidAPI")
    public String GetRapidAPI(RequestParam data) throws IOException, InterruptedException {

        System.out.println(data.toString());

//        HttpRequest request = HttpRequest.newBuilder()
//                .uri(URI.create("https://real-time-amazon-data.p.rapidapi.com/search?query=Phone&page=1&country=GB&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE"))
//                .header("x-rapidapi-key", apiKey)
//                .header("x-rapidapi-host", "real-time-amazon-data.p.rapidapi.com")
//                .method("GET", HttpRequest.BodyPublishers.noBody())
//                .build();
//        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
//        return(response.body());
          return("f");
    }



}
