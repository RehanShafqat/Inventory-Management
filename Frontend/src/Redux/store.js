

import { configureStore } from "@reduxjs/toolkit"
import userSliceReducer from "./userSlice";
import supplierSliceReducer from "./supplierSlice"
import OrderSliceReducer from "./orderSlice";
import ProductSliceReducer from "./productSlice"
const store = configureStore({
    reducer: {
        user: userSliceReducer,
        supplier: supplierSliceReducer,
        order: OrderSliceReducer,
        product: ProductSliceReducer
    }
})
export default store;