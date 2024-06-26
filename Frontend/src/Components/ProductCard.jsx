import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItemToCart } from '../Redux/cartSlice';
import toast from 'react-hot-toast';
import { fetchUserDetails } from '../Redux/userSlice';

const ProductCard = ({ id, name, price, url = "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg", qty = null, supplier_NTN = null }) => {
    const dispatch = useDispatch();
    const role = useSelector(state => state.user.role);
    useEffect(() => {
        if (!role) {
            dispatch(fetchUserDetails());
        }
    }, [dispatch])

    const handleAddToCart = (e) => {
        toast.success("Added to cart");
        e.preventDefault();
        dispatch(addItemToCart({ id, name, price, quantity: 1, url }));
    };

    return (

        <div className="sm:w-[75%] w-[100%] min-h-[44vh] bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
            <Link to="#">
                <img
                    src={url}
                    alt="Product"
                    className=" object-fill w-[100%] h-[32vh] rounded-t-xl"
                />
                <div className="px-4 py-3 w-72">
                    <p className="text-xl font-bold text-black truncate block capitalize">{name}</p>
                    <div className="flex items-center">
                        <p className="text-lg text-black cursor-auto">Price : ${price}</p>
                    </div>
                    {qty != null && supplier_NTN != null && role === "admin" && (
                        <div className='flex flex-col'>
                            <span>
                                Quantity : {qty}
                            </span>
                            <span>
                                Supplier : {supplier_NTN}
                            </span>
                        </div>
                    )}

                    <button
                        onClick={handleAddToCart}
                        className="mt-2 bg-darkModeColor text-white w-full py-1 px-4 rounded hover:bg-[black]"
                    >
                        Add to Cart
                    </button>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
