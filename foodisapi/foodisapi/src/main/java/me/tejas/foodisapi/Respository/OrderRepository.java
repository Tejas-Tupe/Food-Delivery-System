package me.tejas.foodisapi.Respository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import me.tejas.foodisapi.entity.OrderEntity;

public interface OrderRepository extends MongoRepository<OrderEntity, String>{
    List<OrderEntity> findByUserId(String userId);
    Optional<OrderEntity> findByRazorpayOrderId(String razorpayOrderId);
    List<OrderEntity> findByPaymentStatusIgnoreCaseAndOrderStatusIgnoreCase(String paymentStatus, String orderStatus);   
}
