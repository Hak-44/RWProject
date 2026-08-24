package service;

import com.microsoft.playwright.*;
import com.microsoft.playwright.options.AriaRole;
import com.microsoft.playwright.options.LoadState;
import com.microsoft.playwright.options.WaitForSelectorState;
import jakarta.annotation.PreDestroy;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.lang.Double.parseDouble;

@Service
public class ScrapeService {


    private final Playwright playwright;
    private final Browser browser;

    Page page;

    private int pageNumber = 1;
    private int cardCount;

    public ScrapeService(){
        this.playwright = Playwright.create();
        this.browser = playwright.chromium().launch(
                new BrowserType.LaunchOptions().setHeadless(true)
        );

        page = browser.newPage();
    }


    public List<Product> NavigateAndExtract(String url, String searchQueryText){

        List<Product> products = new ArrayList<>();
        try{

            // creating a new page for the scrape

            page.navigate(url);
            page.waitForLoadState(LoadState.DOMCONTENTLOADED);

            String title = page.title();
            System.out.println("Page title: " + title);
            System.out.println("Search query: " + searchQueryText);

            // the placeholder on websites differ, so for other stores will need the inspect element to find what it is
            page.getByPlaceholder("What are you looking for?").fill(searchQueryText);
            page.getByPlaceholder("What are you looking for?").press("Enter");

            // waiting for the DOM gets all the information once everything is loaded.
            page.waitForLoadState(LoadState.DOMCONTENTLOADED);


            try {
                page.locator(".plp-loading__text")
                        .waitFor(new Locator.WaitForOptions()
                                .setState(WaitForSelectorState.HIDDEN)
                                .setTimeout(15000));
            } catch (TimeoutError e) {
                System.out.println("Taking longer than 15 seconds, still must be loading.");
            }



            System.out.println("URL after search: " + page.url());



            page.waitForSelector("[data-testid='plp-product-card']");

            // the section that contains the product details that IKEA uses
            Locator cards = page.locator("[data-testid='plp-product-card']");
            int count = cards.count();
            System.out.println("Found " + count + " product cards");

            List<Map<String, String>> items = new ArrayList<>();


            String productSeries;
            String productName;
            String productImage;
            String productPrice;
            String productLink;

            for (int i = 0; i < count; i++) {
                Locator card = cards.nth(i);
                Map<String, String> item = new HashMap<>();

                productSeries = card.locator(".plp-price-module__product-name").first().textContent();
                productName = card.locator(".plp-price-module__description").first().textContent();
                productImage = card.locator("img").first().getAttribute("src");
                productPrice = card.locator(".plp-price-module__current-price [aria-hidden='true']").first().textContent(); // [content] targets the specific span that is needed
                String cleanedPrice = productPrice.replaceAll("[^0-9.]", ""); // clearing the price as it will return an exception, need to remove the £ sign and elements that may

                // NOTE: A better way to do this is to make a POUND and pence section for the number

                productLink = card.locator(".plp-price-module__product-link").first().getAttribute("href");


                products.add(new Product(productSeries, productName, productImage, parseDouble(cleanedPrice), productLink));

                item.put("name", card.locator(".plp-price-module__product-name").first().textContent());
                item.put("price", card.locator(".plp-price-module__current-price").first().textContent());
                item.put("link", card.locator(".plp-price-module__product-link").first().getAttribute("href"));
                item.put("image", card.locator("img").first().getAttribute("src"));

                items.add(item);

                
            }

            System.out.println("Extracted " + products.size() + " products");
            cardCount = products.size();


            page.screenshot(new Page.ScreenshotOptions()
                    .setPath(Paths.get("E:\\zHouseDesignScreenShot\\search-results.png"))
                    .setFullPage(true));

            String html = page.content();
            Files.writeString(Paths.get("E:\\zHouseDesignScreenShot\\results.html"), html);

            return products;


        }catch(Exception e){
            System.out.println("Error:" + e);
            return null;
        }

    }


    // https://nodemaven.com/blog/java-web-scraping-guide/
    public List<Product> ExtractNextPage(){

        List<Product> products = new ArrayList<>();
        try{

            //https://playwright.dev/docs/api/class-page#page-get-by-role
            page.getByRole(AriaRole.LINK, new Page.GetByRoleOptions().setName("Show more")).click();
            page.waitForLoadState(LoadState.DOMCONTENTLOADED);


            // -1 is needed here as it's a value that is not possible to achieve, that way it won't skip over the while loop
            int previousCount = -1;
            int currentCount = page.locator("[data-testid='plp-product-card']").count();

            while (currentCount != previousCount) {
                previousCount = currentCount;

                /* pauses the check, meaning each time after the new check the value will be different, if the value is the same after the check
                    it will then confirm its complete
                 */
                page.waitForTimeout(300);

                currentCount = page.locator("[data-testid='plp-product-card']").count();
            }

            System.out.println("Count stabilized at: " + currentCount);

            // the section that contains the product details that IKEA uses
            Locator cards = page.locator("[data-testid='plp-product-card']");
            int count = cards.count();
            System.out.println("Found " + count + " product cards");

            List<Map<String, String>> items = new ArrayList<>();


            String productSeries;
            String productName;
            String productImage;
            String productPrice;
            String productLink;

            for (int i = cardCount; i < count; i++) {
                Locator card = cards.nth(i);
                Map<String, String> item = new HashMap<>();

                productSeries = card.locator(".plp-price-module__product-name").first().textContent();
                productName = card.locator(".plp-price-module__description").first().textContent();
                productImage = card.locator("img").first().getAttribute("src");
                productPrice = card.locator(".plp-price-module__current-price [aria-hidden='true']").first().textContent(); // [content] targets the specific span that is needed
                String cleanedPrice = productPrice.replaceAll("[^0-9.]", ""); // clearing the price as it will return an exception, need to remove the £ sign and elements that may

                // NOTE: A better way to do this is to make a POUND and pence section for the number

                productLink = card.locator(".plp-price-module__product-link").first().getAttribute("href");


                products.add(new Product(productSeries, productName, productImage, parseDouble(cleanedPrice), productLink));

                item.put("name", card.locator(".plp-price-module__product-name").first().textContent());
                item.put("price", card.locator(".plp-price-module__current-price").first().textContent());
                item.put("link", card.locator(".plp-price-module__product-link").first().getAttribute("href"));
                item.put("image", card.locator("img").first().getAttribute("src"));

                items.add(item);


            }

            System.out.println("Extracted " + products.size() + " products");

            System.out.println("URL after search: " + page.url());

            pageNumber++;
            return products;


        }catch(Exception e){
            System.out.println("Error:" + e);
            return null;
        }

    }



    public Browser GetBrowser(){
        return this.browser;
    }

    @PreDestroy
    public void Close(){
        browser.close();
        playwright.close();
    }

    private void ResetPageNumber(){
        pageNumber = 0;
    }


}



