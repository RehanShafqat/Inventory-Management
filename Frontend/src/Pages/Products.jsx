import React, { useEffect } from 'react'
import ProductCard from '../Components/ProductCard'
import { fetchProducts } from '../Redux/productSlice'
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from 'react-router-dom'
const Products = () => {
    const products = useSelector((state) => state.product.products)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (!products) {
            const check = async () => {
                await dispatch(fetchProducts());
                console.log(products);
            }
            check();
        }
    }, [])
    const handleNavigate = () => {
        navigate("/Cart")
    }
    return (
        <div>
            <div className=" mx-auto   min-h-screen bg-bgWhite">

                <h1 className=" font-normal text-3xl py-4   text-center   mb-10">Available Products</h1>

                <div className="grid grid-cols-1  w-[95%] mx-auto sm:grid-cols-2 lg:grid-cols-4  md:grid-cols-2 gap-y-8">
                    {console.log(products)}
                    {
                        products && (
                            products.map((product, key) => {
                                return (
                                    <div key={key}>

                                        <ProductCard name={product.name} price={product.price} qty={product.quantity} key={key} id={product.product_id} url={product.image_url} supplier_NTN={product.supplier_NTN} />
                                    </div>
                                )
                            })
                        )
                    }
                </div>

                <div className='flex items-center justify-center  text-white '>
                    <button className='mx-auto bg-darkModeColor hover:bg-black px-12 py-2 my-8 ' onClick={handleNavigate} >
                        Go to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Products
