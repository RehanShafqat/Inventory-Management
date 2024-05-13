import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchSuppliers } from '../Redux/supplierSlice';
const SuppliersTable = () => {
    const suppliers = useSelector((state) => state.supplier.suppliers);
    const error = useSelector((state) => state.error);
    const dispatch = useDispatch();
    if (!suppliers && !error) {
        dispatch(fetchSuppliers());
    }

    return (
        <>
            <div >
                <h1 className='text-2xl mb-4 font-bold  mt-4'>
                    Suppliers
                </h1>
                {/* <table className="sm:w-[95%] w-full mx-auto  leading-normal"> */}
                <table className="min-w-full sm:w-[95%] mx-auto   divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm text-darkModeColor font-bold  uppercase tracking-wider">
                                Id
                            </th>
                            <th className="px-6 py-3 text-left text-sm text-darkModeColor font-bold  uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-sm text-darkModeColor font-bold  uppercase tracking-wider">
                                NTN
                            </th>
                            <th className="px-6 py-3 text-left text-sm text-darkModeColor font-bold  uppercase tracking-wider">
                                Categories
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {suppliers ? (

                            suppliers.map((supplier, index) => (
                                <tr key={index} className='hover:bg-slate-500 transition-all delay-100 ease-in-out     '>
                                    <td className="px-6 py-4 border-b border-gray-200  bg-white  sm:text-[1rem] text-sm font-normal">{index + 1}</td>
                                    <td className="px-6 py-4 border-b border-gray-200  bg-white  sm:text-[1rem] text-sm font-normal">{supplier.supplier_name.replace(/^\w/, (c) => c.toUpperCase())}</td>
                                    <td className="px-6 py-4 border-b border-gray-200  bg-white  sm:text-[1rem] text-sm font-normal">{supplier.NTN_number}</td>
                                    <td className="px-6 py-4 border-b border-gray-200  bg-white  sm:text-[1rem] text-sm font-normal">
                                        {supplier.categories_supplied.join(` , `)}
                                    </td>
                                </tr>
                            ))
                        ) : null}
                    </tbody>
                </table>
            </div >

        </>
    );
}

export default SuppliersTable;