import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { fetchFoodList } from "../service/FoodService";

import {
  fetchActiveCart,
  mergeGuestCart,
  syncAddToCart,
  syncDecreaseQty,
  syncRemoveFromCart,
} from "../service/CartService";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {
  const [foodList, setFoodList] = useState([])
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState(
    () =>
      localStorage.getItem("token") ||
      sessionStorage.getItem("token") ||
      ""
  );

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const foods = await fetchFoodList();
        setFoodList(foods);
      } catch (error) {
        console.error(error);
      }
    };

    loadFoods();
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);

      try {
        if (token) {
          const cart = await fetchActiveCart();
          setQuantities(cart.items || {});
        } else {
          const savedCart = localStorage.getItem("cart");

          setQuantities(
            savedCart ? JSON.parse(savedCart) : {}
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [token]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem(
        "cart",
        JSON.stringify(quantities)
      );
    }
  }, [quantities, token]);

  const loginUser = async (
    jwtToken,
    rememberMe = false
  ) => {
    const guestCart =
      JSON.parse(localStorage.getItem("cart")) || {};

    if (rememberMe) {
      localStorage.setItem("token", jwtToken);
    } else {
      sessionStorage.setItem("token", jwtToken);
    }

    setToken(jwtToken);

    if (Object.keys(guestCart).length > 0) {
      try {
        await mergeGuestCart(guestCart);
        localStorage.removeItem("cart");
      } catch (error) {
        console.error(error);
      }
    }

    const backendCart = await fetchActiveCart();

    setQuantities(backendCart.items || {});
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("cart");

    setQuantities({});
    setToken("");
  };

  const increaseQty = async (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + 1,
    }));

    if (!token) return;

    try {
      await syncAddToCart(foodId);
    } catch (error) {
      console.error(error);

      setQuantities((prev) => {
        const updated = { ...prev };

        if (updated[foodId] <= 1) {
          delete updated[foodId];
        } else {
          updated[foodId] -= 1;
        }

        return updated;
      });
    }
  };

  const clearCart = () => {
    setQuantities({});
    if (!token) {
      localStorage.removeItem("cart");
    }
  };

  const decreaseQty = async (foodId) => {
    const previousQty = quantities[foodId];

    if (!previousQty) return;

    setQuantities((prev) => {
      const updated = { ...prev };

      if (updated[foodId] > 1) {
        updated[foodId] -= 1;
      } else {
        delete updated[foodId];
      }

      return updated;
    });

    if (!token) return;

    try {
      await syncDecreaseQty(foodId);
    } catch (error) {
      console.error(error);

      setQuantities((prev) => ({
        ...prev,
        [foodId]: previousQty,
      }));
    }
  };

  const removeFromCart = async (foodId) => {
    const previousQty = quantities[foodId];

    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[foodId];
      return updated;
    });

    if (!token) return;

    try {
      await syncRemoveFromCart(foodId);
    } catch (error) {
      console.error(error);

      if (previousQty) {
        setQuantities((prev) => ({
          ...prev,
          [foodId]: previousQty,
        }));
      }
    }
  };

  const cartItems = useMemo(() => {
    return foodList
      .filter((food) => quantities[food.id] > 0)
      .map((food) => ({
        ...food,
        quantity: quantities[food.id],
      }));
  }, [foodList, quantities]);

  const totalCartCount = useMemo(() => {
    return Object.values(quantities).reduce(
      (sum, qty) => sum + qty,
      0
    );
  }, [quantities]);

  const totalUniqueItems = useMemo(() => {
    return Object.keys(quantities).length;
  }, [quantities]);

  const contextValue = {
    foodList,
    quantities,
    cartItems,

    totalCartCount,
    totalUniqueItems,

    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,

    token,
    setToken,

    loginUser,
    logoutUser,

    loading,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};