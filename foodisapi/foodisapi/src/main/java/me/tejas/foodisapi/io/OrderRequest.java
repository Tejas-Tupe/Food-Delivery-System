package me.tejas.foodisapi.io;

import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderRequest {
    private List<OrderItem> orderItems;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private double amount;
    private String orderStatus;
    private String imgurl;
}
