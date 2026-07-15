package me.tejas.foodisapi.controller;

import lombok.AllArgsConstructor;
import me.tejas.foodisapi.io.CartMergeRequest;
import me.tejas.foodisapi.io.CartRequest;
import me.tejas.foodisapi.io.CartResponse;
import me.tejas.foodisapi.service.CartService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@AllArgsConstructor
@RequestMapping("api/cart")
public class CartController {

    private final CartService cartService;

    @PostMapping
    public CartResponse addToCart(@RequestBody CartRequest request) {
        if (request.getFoodId() == null || request.getFoodId().strip().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payload missing validation property: foodId");
        }
        return cartService.addToCart(request);
    }

    @GetMapping
    public CartResponse getCart() {
        return cartService.getCart();
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart() {
        cartService.clearCart();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCartItem(@PathVariable String id) {
        cartService.clearCartItem(id);
    }

    @PatchMapping("/increase/{itemId}")
    @ResponseStatus(HttpStatus.OK)
    public void increaseCartItem(@PathVariable String itemId) {
        cartService.increseCartItem(itemId);
    }

    @PatchMapping("/decrease/{itemId}")
    @ResponseStatus(HttpStatus.OK)
    public void decreaseCartItem(@PathVariable String itemId) {
        cartService.decreseCartItem(itemId);
    }

    @PostMapping("/merge")
    @ResponseStatus(HttpStatus.OK)
    public void mergeCart(
            @RequestBody CartMergeRequest request) {
        cartService.mergeCart(request.getItems());
    }
}