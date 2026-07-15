package me.tejas.foodisapi.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.tejas.foodisapi.io.OrderItem;

@Document(collection = "orders")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderEntity {
    @Id
    private String id;
    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private List<OrderItem> orderitems;
    private double amount;
    private String paymentStatus;
    private String orderStatus;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
}
