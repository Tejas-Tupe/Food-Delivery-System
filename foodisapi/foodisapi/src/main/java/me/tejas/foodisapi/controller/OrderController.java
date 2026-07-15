package me.tejas.foodisapi.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.razorpay.RazorpayException;
import lombok.AllArgsConstructor;
import me.tejas.foodisapi.io.OrderRequest;
import me.tejas.foodisapi.io.OrderResponse;
import me.tejas.foodisapi.service.OrderService;

@RestController
@RequestMapping("/api/orders")

@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrderWithPayment(@RequestBody OrderRequest request) throws RazorpayException {
        return orderService.createOrderWithPayment(request);
    }

    @PostMapping("/verify")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void verifyPayment(@RequestBody Map<String, String> paymentData) {
        orderService.verifyPayment(paymentData);
    }

    @DeleteMapping("/{orderId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOrder(@PathVariable String orderId) {
        orderService.removeOrder(orderId);
    }

    @GetMapping("/userorders")
    public List<OrderResponse> getOrders() {
        return orderService.getUserOrders();
    }

    @PostMapping("/payment-failed")
    public ResponseEntity<Map<String, Object>> cancelPaymentAndRejectOrder(
            @RequestBody Map<String, String> failureData) {
        Map<String, Object> response = new HashMap<>();
        try {
            OrderResponse rejectedOrder = orderService.handlePaymentFailure(failureData);

            response.put("success", true);
            response.put("message", "Order marked as REJECTED successfully.");
            response.put("order", rejectedOrder);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Could not process order rejection update: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
