import React, { useEffect } from 'react'
import ProductCard from '../Components/ProductCard'
import { fetchProducts } from '../Redux/productSlice'
import { useSelector, useDispatch } from "react-redux"
const Products = () => {
    const products = useSelector((state) => state.product.products)
    const dispatch = useDispatch();
    useEffect(() => {
        if (!products) {
            const check = async () => {
                await dispatch(fetchProducts());
            }
            check();
        }
    }, [])
    return (
        <div>
            <div className=" mx-auto   min-h-screen bg-bgWhite">

                <h1 className=" font-normal text-3xl py-4   text-center   mb-10">Available Products</h1>

                <div className="grid grid-cols-1  w-[95%] mx-auto sm:grid-cols-2 lg:grid-cols-4  md:grid-cols-2 gap-y-8">
                    {
                        products && (
                            products.map((product, key) => {
                                return (
                                    <div>
                                        <ProductCard name={product.name} price={product.price} qty={product.quantity} key={key} />
                                    </div>
                                )
                            })
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Products
