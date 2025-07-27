import { createContext, useEffect, useState } from "react";
import { food_list, menu_list } from "../assets/assets";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    // Use environment variable for API URL, with fallback logic for production
    const getApiUrl = () => {
        const envUrl = import.meta.env.VITE_API_URL;
        if (envUrl) return envUrl;
        
        // Fallback for production - replace with your actual Render backend URL
        if (import.meta.env.PROD) {
            return "https://foodiee-backend.onrender.com"; // Your Render backend URL
        }
        
        return "http://localhost:4000";
    };
    
    const url = getApiUrl();
    const [food_list, setFoodList] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [token, setToken] = useState("")


    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
        }
    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    }

    const fetchFoodList = async () => {
        try {
            console.log("Fetching food list from:", url + "/api/food/list");
        const response = await axios.get(url + "/api/food/list");
            console.log("API response:", response.data);
            
            if (response.data.success && response.data.data.length > 0) {
                console.log("Using API food data:", response.data.data.length, "items");
                setFoodList(response.data.data);
            } else {
                // Fallback to local food data if API returns empty or fails
                console.log("API returned empty data, using local food data as fallback");
                console.log("Local food data:", food_list.length, "items");
                setFoodList(food_list);
            }
        } catch (error) {
            console.log("API call failed, using local food data:", error.message);
            // Fallback to local food data if API fails
            console.log("Local food data:", food_list.length, "items");
            setFoodList(food_list);
        }
    }

    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: token });
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData({ token: localStorage.getItem("token") })
            }
        }
        loadData()
    }, [])

    const contextValue = {
        url,
        food_list,
        menu_list,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        token,
        setToken,
        loadCartData,
        setCartItems
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;
