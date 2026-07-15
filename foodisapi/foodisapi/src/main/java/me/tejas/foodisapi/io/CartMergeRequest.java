package me.tejas.foodisapi.io;

import lombok.Data;
import java.util.Map;

@Data
public class CartMergeRequest {
    private Map<String,Integer> items;
}