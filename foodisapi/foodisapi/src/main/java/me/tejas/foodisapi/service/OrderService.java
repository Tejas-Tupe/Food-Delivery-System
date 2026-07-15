package me.tejas.foodisapi.service;
import java.util.List;
import java.util.Map;
import com.razorpay.RazorpayException;
import me.tejas.foodisapi.io.OrderRequest;
import me.tejas.foodisapi.io.OrderResponse;

public interface OrderService {
    OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException;

    OrderResponse verifyPayment(Map<String,String> paymentData);

    List<OrderResponse> getUserOrders();

    void removeOrder(String orderId);

    void updateOrderStatus(String orderId, String status);

    public OrderResponse handlePaymentFailure(Map<String, String> failureData);

    List<OrderResponse> getValidAdminOrders(String status);
 }