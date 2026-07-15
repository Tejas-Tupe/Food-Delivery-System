package me.tejas.foodisapi.service;

import java.util.Map;

import me.tejas.foodisapi.io.CartRequest;
import me.tejas.foodisapi.io.CartResponse;

public interface CartService{

    void mergeCart(Map<String,Integer> items);

    public CartResponse addToCart(CartRequest request);

    public CartResponse getCart();

    public void clearCart();

    public void clearCartItem(String itemId);

    public void decreseCartItem(String itemId);

    public void increseCartItem(String itemId);
    
}
