package me.tejas.foodisapi.service;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import me.tejas.foodisapi.Respository.CartRepository;
import me.tejas.foodisapi.Respository.OrderRepository;
import me.tejas.foodisapi.entity.OrderEntity;
import me.tejas.foodisapi.io.OrderRequest;
import me.tejas.foodisapi.io.OrderResponse;
import com.razorpay.Utils;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    private final UserService userService;

    private final CartRepository cartRepository;

    @Value("${razorpay.test.api.key}")
    private String RazorPay_Key;
    @Value("${razorpay.test.api.key.secret}")
    private String RazorPay_Secret;

    @Override
    public OrderResponse createOrderWithPayment(OrderRequest request) throws RazorpayException {
        
        OrderEntity newOrder = convertToEntity(request);
        newOrder = orderRepository.save(newOrder);

        // Razorpay Client Gateway Component
        RazorpayClient razorpayClient = new RazorpayClient(RazorPay_Key, RazorPay_Secret);

        JSONObject orderRequest = new JSONObject();

        // Converting standard double currency amount into integer Paise
        int amountInPaise = (int) Math.round(newOrder.getAmount() * 100);
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");

        orderRequest.put("payment_capture", 1);

        // Create the order intent in Razorpay's systems
        Order razorPayOrder = razorpayClient.orders.create(orderRequest);

        // Save Razorpay's official "order_XXXXXX" identifier token to the entity record
        newOrder.setRazorpayOrderId(razorPayOrder.get("id"));
        newOrder.setUserId(userService.findByUserId());
        newOrder = orderRepository.save(newOrder);

        // Return response wrapper
        return convertToResponse(newOrder);
    }

    @Override
    @Transactional
    public OrderResponse verifyPayment(Map<String, String> paymentData) {

        // Validate mandatory fields
        if (paymentData.get("razorpay_order_id") == null
                || paymentData.get("razorpay_payment_id") == null
                || paymentData.get("razorpay_signature") == null) {

            throw new IllegalArgumentException("Missing payment details.");
        }

        try {

            JSONObject attributes = new JSONObject();

            attributes.put(
                    "razorpay_order_id",
                    paymentData.get("razorpay_order_id"));

            attributes.put(
                    "razorpay_payment_id",
                    paymentData.get("razorpay_payment_id"));

            attributes.put(
                    "razorpay_signature",
                    paymentData.get("razorpay_signature"));

            // Verify payment signature using Razorpay Secret
            boolean isValid = Utils.verifyPaymentSignature(
                    attributes,
                    RazorPay_Secret);

            if (!isValid) {
                throw new RuntimeException(
                        "Invalid Razorpay payment signature.");
            }

            String razorpayOrderId = paymentData.get("razorpay_order_id");

            OrderEntity order = orderRepository
                    .findByRazorpayOrderId(razorpayOrderId)
                    .orElseThrow(() -> new RuntimeException("Order not found."));

            if ("paid".equalsIgnoreCase(order.getPaymentStatus())) {
                return convertToResponse(order);
            }

            order.setPaymentStatus("Paid");

            order.setRazorpayPaymentId(
                    paymentData.get("razorpay_payment_id"));

            order.setRazorpaySignature(
                    paymentData.get("razorpay_signature"));

            order = orderRepository.save(order);

            cartRepository.deleteByUserId(order.getUserId());

            return convertToResponse(order);

        } catch (Exception e) {

            System.err.println("Payment verification failed.");
            e.printStackTrace();

            throw new RuntimeException(
                    "Payment verification failed.", e);
        }
    }

    @Transactional
    public OrderResponse handlePaymentFailure(Map<String, String> failureData) {
        String razorpayOrderId = failureData.get("razorpay_order_id");
        if (razorpayOrderId == null) {
            throw new IllegalArgumentException("Missing Razorpay Order ID.");
        }

        OrderEntity order = orderRepository
                .findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found."));

        order.setPaymentStatus("Failed");
        order.setOrderStatus("Rejected");
        
        order = orderRepository.save(order);    
        return convertToResponse(order);
    }

    @Override
    public List<OrderResponse> getUserOrders() {
        List<OrderEntity> list = orderRepository.findByUserId(userService.findByUserId());
        return list.stream().map(entity -> convertToResponse(entity)).collect(Collectors.toList());
    }

    @Override
    public void removeOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }

    @Override
    @Transactional
    public void updateOrderStatus(String orderId, String status) {
        // Fetch the existing entity
        OrderEntity entity = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Strict Security Guard: Prevent modifying unpaid or failed orders
        if (!"Paid".equalsIgnoreCase(entity.getPaymentStatus())) {
            throw new IllegalStateException("Unauthorized: Cannot update status for an unpaid or failed order.");
        }

        // String formatting
        if (status != null && !status.trim().isEmpty()) {
            String trimmed = status.trim();
            String formattedStatus = trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1).toLowerCase();
            entity.setOrderStatus(formattedStatus);
        } else {
            throw new IllegalArgumentException("Order status value cannot be empty.");
        }

        orderRepository.save(entity);
    }

    @Override
    public List<OrderResponse> getValidAdminOrders(String status) {
        List<OrderEntity> incomingOrders = orderRepository
                .findByPaymentStatusIgnoreCaseAndOrderStatusIgnoreCase("Paid",status);

        return incomingOrders.stream()
                .map(entity -> convertToResponse(entity))
                .collect(Collectors.toList());
    }

    private OrderEntity convertToEntity(OrderRequest request) {
        return OrderEntity.builder()
                .userId(userService.findByUserId())
                .userAddress(request.getUserAddress())
                .amount(request.getAmount())
                .orderitems(request.getOrderItems())
                .orderStatus(request.getOrderStatus())
                .phoneNumber(request.getPhoneNumber())
                .email(request.getEmail())
                .build();
    }

    private OrderResponse convertToResponse(OrderEntity entity) {
        return OrderResponse.builder()
                .id(entity.getId())
                .razorpayOrderId(entity.getRazorpayOrderId())
                .userId(entity.getUserId())
                .userAddress(entity.getUserAddress())
                .phoneNumber(entity.getPhoneNumber())
                .email(entity.getEmail())
                .orderitems(entity.getOrderitems())
                .amount(entity.getAmount())
                .paymentStatus(entity.getPaymentStatus())
                .orderStatus(entity.getOrderStatus()).build();
    }
}
