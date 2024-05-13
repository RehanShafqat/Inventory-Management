import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ name, price, url = "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" }) => {
    return (
        <div className="sm:w-[75%] w-[100% ] bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
            <Link to={'/AdminDashboard'}>
                <img
                    src={url}
                    alt="Product"
                    className="w-[100%] object-cover rounded-t-xl"
                />
                <div className="px-4 py-3 w-72">
                    <p className="text-xl font-bold text-black truncate block capitalize">{name}</p>
                    <div className="flex items-center">
                        <p className="text-lg  text-black cursor-auto my-3">Price : ${price}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
