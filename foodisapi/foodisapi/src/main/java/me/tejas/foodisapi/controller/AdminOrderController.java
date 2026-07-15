package me.tejas.foodisapi.controller;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.AllArgsConstructor;
import me.tejas.foodisapi.io.OrderResponse;
import me.tejas.foodisapi.service.OrderService;

@RestController
@RequestMapping("/api/admin-orders")
@AllArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping("/list/{status}")
    public ResponseEntity<List<OrderResponse>> getAdminDashboardOrders(@PathVariable String status) {
        List<OrderResponse> validOrders = orderService.getValidAdminOrders(status);
        return ResponseEntity.ok(validOrders);
    }

    @PatchMapping("/status/{orderId}")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> payload) {
        String incomingStatus = payload.get("orderStatus");

        orderService.updateOrderStatus(orderId, incomingStatus);

        return ResponseEntity.ok("Order status updated successfully.");
    }
}
