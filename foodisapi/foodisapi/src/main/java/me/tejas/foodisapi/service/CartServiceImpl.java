package me.tejas.foodisapi.service;

import lombok.AllArgsConstructor;
import me.tejas.foodisapi.Respository.CartRepository;
import me.tejas.foodisapi.entity.CartEntity;
import me.tejas.foodisapi.io.CartRequest;
import me.tejas.foodisapi.io.CartResponse;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserService userService; 

    @Override
    public CartResponse addToCart(CartRequest request) {
        String loggedInUserId = userService.findByUserId();

        CartEntity cart = cartRepository.findByUserId(loggedInUserId)
                .orElseGet(() -> new CartEntity(loggedInUserId, new HashMap<>()));

        Map<String, Integer> cartItems = cart.getItems();
        cartItems.put(request.getFoodId(), cartItems.getOrDefault(request.getFoodId(), 0) + 1);

        cartRepository.save(cart);
        return convertToResponse(cart);
    }

    @Override
    public CartResponse getCart() {
        String loggedInUserId = userService.findByUserId();
        CartEntity cartEntity = cartRepository.findByUserId(loggedInUserId)
                .orElseGet(() -> new CartEntity(loggedInUserId, new HashMap<>()));
        return convertToResponse(cartEntity);
    }

    @Override
    public void clearCart() {
        String loggedInUserId = userService.findByUserId();
        cartRepository.deleteByUserId(loggedInUserId);
    }

    @Override
    public void clearCartItem(String itemId) {
        String loggedInUserId = userService.findByUserId();
        cartRepository.findByUserId(loggedInUserId).ifPresent(cart -> {
            Map<String, Integer> items = cart.getItems();
            if (items.containsKey(itemId)) {
                items.remove(itemId);
                cartRepository.save(cart);
            }
        });
    }

    @Override
    public void decreseCartItem(String itemId) {
        String loggedInUserId = userService.findByUserId();
        cartRepository.findByUserId(loggedInUserId).ifPresent(cart -> {
            Map<String, Integer> items = cart.getItems();
            if (items.containsKey(itemId)) {
                int currentQty = items.get(itemId);
                if (currentQty <= 1) {
                    items.remove(itemId);
                } else {
                    items.put(itemId, currentQty - 1);
                }
                cartRepository.save(cart);
            }
        });
    }

    @Override
    public void increseCartItem(String itemId) {
        String loggedInUserId = userService.findByUserId();
        cartRepository.findByUserId(loggedInUserId).ifPresent(cart -> {
            Map<String, Integer> items = cart.getItems();
            if (items.containsKey(itemId)) {
                items.put(itemId, items.get(itemId) + 1);
                cartRepository.save(cart);
            }
        });
    }

    private CartResponse convertToResponse(CartEntity cartEntity) {
        return CartResponse.builder()
                .id(cartEntity.getId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems())
                .build();
    }

    @Override
    public void mergeCart(Map<String, Integer> guestItems) {

        String loggedInUserId = userService.findByUserId();

        CartEntity cart = cartRepository
                .findByUserId(loggedInUserId)
                .orElseGet(() -> new CartEntity(loggedInUserId, new HashMap<>()));

        Map<String, Integer> existingItems = cart.getItems();

        guestItems.forEach((foodId, qty) -> {
            existingItems.put(
                    foodId,
                    existingItems.getOrDefault(foodId, 0) + qty);
        });
        cartRepository.save(cart);
    }
}