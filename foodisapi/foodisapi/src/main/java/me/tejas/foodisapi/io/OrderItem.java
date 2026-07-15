package me.tejas.foodisapi.io;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItem {
    private String foodId;
    private double price;
    private String category;
    private String description;
    private String name;
    private int quantity;        
}
