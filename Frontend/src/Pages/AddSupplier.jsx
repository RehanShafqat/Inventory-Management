import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../Redux/categoriesSlice';
import toast from 'react-hot-toast';
import { addSupplier, fetchSuppliers } from '../Redux/supplierSlice';
const AddSupplier = () => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const error = useSelector(state => state.supplier.error);
    const [formData, setFormData] = useState({
        NTN_number: '',
        email: '',
        name: '',
        categories_supplied: [],
    });

    useEffect(() => {
        if (!categories) {
            dispatch(fetchCategories());
        }
    }, [dispatch, categories]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCategoryChange = (categoryId) => {
        setFormData((prevFormData) => {
            const categories_supplied = [...prevFormData.categories_supplied];
            if (categories_supplied.includes(categoryId)) {
                const index = categories_supplied.indexOf(categoryId);
                categories_supplied.splice(index, 1);
            } else {
                categories_supplied.push(categoryId);
            }
            return { ...prevFormData, categories_supplied };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const add = await dispatch(addSupplier(formData));
        const againAdd = await dispatch(fetchSuppliers());
    };
    return (
        <div className='min-w-screen min-h-screen bg-bgWhite'>
            <div className='mb-3 sm:w-[95%] flex flex-col mx-auto'>
                <h2 className="text-4xl font-medium mt-4 sm:text-left text-center mx-auto">Add Supplier</h2>
                <span className='mx-auto text-sm text-slate-500'>
                    Add suppliers to your inventory
                </span>
            </div>
            <div className="sm:min-w-[75vw] min-w-screen p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Section 1: Supplier Information */}
                    <div className="border mb-10 min-h-[45vh] rounded-lg bg-white">
                        <div className='sm:w-[96%] mx-auto mt-2  '>
                            <h1 className='text-2xl mb-4 mt-6 ml-5'>Supplier Information</h1>
                            {/* Form Group: Supplier NTN and name */}
                            <div className='border rounded-lg h-[19rem] w-[98%] mx-auto my-auto '>
                                <div className='w-[95%] mx-auto'>
                                    <div className="form-group">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700   mt-4 ">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full p-3 outline-none shadow-sm sm:text-sm border-gray-300 resize-none  border rounded-lg focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400"
                                        />
                                    </div>


                                    <div className="form-group">
                                        <label htmlFor="NTN_number" className="block text-sm font-medium text-gray-700 mt-4 ">Supplier NTN</label>
                                        <input
                                            type="text"
                                            id="NTN_number"
                                            name="NTN_number"
                                            value={formData.NTN_number}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full border p-3 rounded-md outline-none shadow-sm sm:text-sm focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400 border-gray-300"
                                        />
                                    </div>


                                    {/* Form Group: Email */}
                                    <div className="form-group">
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700  mt-4 ">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="mt-2 block w-full p-3 outline-none shadow-sm sm:text-sm border-gray-300 resize-none border rounded-lg focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40 focus:border-blue-400"
                                        />
                                    </div>


                                    {/* Form Group: Name */}

                                </div>
                            </div>
                            <div className="bg-white border mt-10 w-[98%] min-h-[40vh] mb-10  mx-auto my-auto   rounded-lg">

                                <div className='sm:w-[96%] mx-auto mt-4'>
                                    <h1 className='text-2xl mb-8'>Categories Supplied</h1>
                                    <div className='border rounded-lg  w-[95%] py-3'>
                                        <div className='w-[95%] mx-auto'>
                                            {categories && categories.map((category) => (
                                                <div key={category.category_id} className="form-group mb-3">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        <input
                                                            type="checkbox"
                                                            className="mr-2"
                                                            value={category.category_id}
                                                            checked={formData.categories_supplied.includes(category.category_id)}
                                                            onChange={() => handleCategoryChange(category.category_id)}
                                                        />
                                                        {category.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Section 2: Categories Supplied */}

                    {/* Submit Button */}
                    <button type="submit" className="w-full py-2 px-4 bg-darkModeColor hover:bg-black text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Add Supplier
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSupplier;
