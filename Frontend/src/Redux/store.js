

import { configureStore } from "@reduxjs/toolkit"
import userSliceReducer from "./userSlice";
import supplierSliceReducer from "./supplierSlice"
import OrderSliceReducer from "./orderSlice";
import ProductSliceReducer from "./productSlice"
import cartSliceReducer from "./cartSlice";
import categoriesSliceReducer from "./categoriesSlice";
const store = configureStore({
    reducer: {
        user: userSliceReducer,
        supplier: supplierSliceReducer,
        order: OrderSliceReducer,
        product: ProductSliceReducer,
        cart: cartSliceReducer,
        category: categoriesSliceReducer
    }
})
export default store;