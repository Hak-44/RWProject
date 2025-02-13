package com.InteriorDesign.Interior_Design_Web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@RestController
public class APIAccess {

    /* The API uses an environment variable to access the rapidAPI*/
    @Value("${restapi.key}")
    private String apiKey;

    /* The post mapping allows the front end to send data and process whatever it is, in this case it passes a JSON string.
        this json string is then mapped to the class "QueryClass", both requiring the data to be in the exact order as each other.
         */
    @PostMapping("/rapidAPI")
    public String GetRapidAPI(@RequestBody QueryClass searchJSON) throws IOException, InterruptedException {
        // need to convert the spaces within the query strings to either %20 or + depending on the API rules

        System.out.println(searchJSON.getQuery());

//        HttpRequest request = HttpRequest.newBuilder()
//                .uri(URI.create("https://real-time-amazon-data.p.rapidapi.com/search?query=Phone&page=1&country=GB&sort_by=RELEVANCE&product_condition=ALL&is_prime=false&deals_and_discounts=NONE"))
//                .header("x-rapidapi-key", apiKey)
//                .header("x-rapidapi-host", "real-time-amazon-data.p.rapidapi.com")
//                .method("GET", HttpRequest.BodyPublishers.noBody())
//                .build();
//        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        return("f");

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