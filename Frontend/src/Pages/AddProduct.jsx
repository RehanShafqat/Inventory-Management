import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../Redux/categoriesSlice';
import { fetchSuppliers } from '../Redux/supplierSlice';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const { suppliers } = useSelector((state) => state.supplier);

    const [formData, setFormData] = useState({
        supplier_NTN: '',
        name: '',
        price: '',
        selling_price: '',
        category_name: '',
        description: '',
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (!categories) {
            dispatch(fetchCategories());
        }
        if (!suppliers) {
            dispatch(fetchSuppliers());
        }
    }, [dispatch, categories, suppliers]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview('');
        // Clear the input file value to allow selecting the same file again
        const fileInput = document.getElementById('image');
        if (fileInput) {
            fileInput.value = '';
        }
    };
    const uploadImageToCloudinary = async () => {
        try {
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', 'Inventory_management');
                const cloudName = 'driuxeclu';

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );
                const data = await response.json();
                // console.log(data.url);
                return data.url;
            }
            return null;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            return null;
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading("uploading product  ... ");
        var image_url;
        if (imageFile) {

            image_url = await uploadImageToCloudinary();
        }
        const formDataWithImage = { ...formData, image_url };
        console.log(formDataWithImage);
        const response = await fetch('http://localhost:5000/api/version1/inventory/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(formDataWithImage),
        });

        const Data = await response.json();
        if (response.ok) {
            toast.success(Data.message, {
                id: toastId,
            });
            console.log(Data);
        } else {
            console.log(Data);
            toast.error(`Error: ${Data.message}`, {
                id: toastId,
            });
        }

    };

    return (
        <div className='min-w-screen min-h-screen bg-bgWhite'>
            <div className='mb-6 sm:w-[95%] flex flex-col mx-auto'>
                <h2 className="text-4xl font-medium mt-4 sm:text-left text-center mx-auto ">Add Product</h2>
                <span className='mx-auto text-sm text-slate-500'>
                    Add products for your customers
                </span>
            </div>
            <div className="sm:min-w-[75vw] min-w-screen m-auto p-6 ">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Section 1: Product Name and Description */}
                    <div className="border mb-10 min-h-[40vh] rounded-lg bg-white">
                        <div className='sm:w-[96%] mx-auto mt-4'>
                            <h1 className='text-2xl mb-8'>
                                Basic Information
                            </h1>
                            {/* Form Group: Product Name */}
                            <div className='border rounded-lg h-64 w-[95%] py-3'>
                                <div className='w-[95%] mx-auto'>
                                    <div className="form-group">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full border p-3 rounded-md outline-none shadow-sm sm:text-sm focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400 border-gray-300"
                                        />
                                    </div>
                                    {/* Form Group: Description */}
                                    <div className="form-group">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mt-8">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full p-3 outline-none shadow-sm sm:text-sm border-gray-300 resize-none h-20 border rounded-lg focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Section 2: Supplier NTN, Price, Selling Price, Image, and Category */}
                    <div className="bg-white border mb-20 min-h-[72vh] max-h-fit rounded-lg">
                        <div className='sm:w-[96%] mx-auto mt-4'>
                            <h1 className='text-2xl mb-8'>
                                Details
                            </h1>
                            <div className='border rounded-lg min-h-[32rem] w-[95%] py-3'>
                                <div className='w-[95%] mx-auto'>
                                    <div className="form-group mb-3">
                                        <label htmlFor="supplier_NTN" className="block text-sm font-medium text-gray-700">Supplier NTN</label>
                                        <select
                                            id="supplier_NTN"
                                            name="supplier_NTN"
                                            value={formData.supplier_NTN}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full pl-3 pr-10 text-base border-gray-300 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400 sm:text-sm py-4 border rounded-lg"
                                        >
                                            <option value="">Select Supplier</option>
                                            {suppliers && suppliers.map((supplier) => (
                                                <option key={supplier.NTN_number} value={supplier.NTN_number}>
                                                    {supplier.NTN_number}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Form Group: Price */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (in $)</label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            className="py-3 border-b outline-none shadow-sm mt-2 block w-full pl-3 pr-10 text-base border-gray-300 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400 sm:text-sm border rounded-lg"
                                        />
                                    </div>
                                    {/* Form Group: Selling Price */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="selling_price" className="block text-sm font-medium text-gray-700">Selling Price</label>
                                        <input
                                            type="number"
                                            id="selling_price"
                                            name="selling_price"
                                            value={formData.selling_price}
                                            onChange={handleChange}
                                            required
                                            className="py-3 border-b outline-none shadow-sm mt-2 block w-full pl-3 pr-10 text-base border-gray-300 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400 sm:text-sm border rounded-lg"
                                        />
                                    </div>
                                    {/* Form Group: Image */}
                                    <div className="form-group mb-3">
                                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            required
                                            className="py-3 border-b outline-none shadow-sm mt-2 block w-full pl-3 pr-10 text-base border-gray-300 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400 sm:text-sm border rounded-lg"

                                        />
                                        {imagePreview && (
                                            <div className='ml-1 mt-1 relative'>
                                                <img src={imagePreview} alt="Selected" className="h-24 w-24 object-fit" />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="text-black absolute top-0 left-[6.4rem]"
                                                >
                                                    <CloseIcon />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {/* Form Group: Category */}
                                    <div className="form-group">
                                        <label htmlFor="category_name" className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            id="category_name"  // Changed from category_id
                                            name="category_name"  // Changed from category_id
                                            value={formData.category_name}  // Changed from formData.category_id
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full pl-3 pr-10 text-base border-gray-300 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400 sm:text-sm py-4 border rounded-lg"
                                        >
                                            <option value="">Select Category</option>
                                            {categories && categories.map((category) => (
                                                <option key={category.category_id} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <button type="submit" className="w-full py-2 px-4 bg-darkModeColor hover:bg-black text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
