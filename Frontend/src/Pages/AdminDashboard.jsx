import React, { useEffect } from 'react'
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StoreIcon from '@mui/icons-material/Store';
import LineChart from "../Components/LineChart"
import BarChart from '../Components/BarChart';
import SuppliersTable from '../Components/SuppliersTable';
import OrdersList from '../Components/OrdersList';
import ProductCard from '../Components/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCount, fetchUserDetails } from '../Redux/userSlice';
import { fetchProducts } from '../Redux/productSlice';
import { fetchOrders, fetchTotalSales } from '../Redux/orderSlice';
import ErrorPage from "../Pages/ErrorPage"
const AdminDashboard = () => {
    const { userCount, role } = useSelector((state) => state.user)
    const { products } = useSelector((state) => state.product)
    const totalSales = useSelector((state) => state.order.totalSales)
    const totalOrders = useSelector((state) => state.order.orders)
    const dispatch = useDispatch();
    useEffect(() => {
        if (!role) {
            dispatch(fetchUserDetails());
        }

        if (role === 'admin' || role === 'manager') {
            if (!userCount) {
                dispatch(fetchUserCount());
            }
            if (!products) {
                dispatch(fetchProducts());
            }
            if (!totalSales) {
                dispatch((fetchTotalSales()))
            }
            if (!totalOrders) {
                dispatch((fetchOrders()))
            }
        }
    }, [])

    return (
        <>
            {
                role === 'admin' || role === 'manager' && (
                    <div className='h-fit w-[100%] bg-bgWhite flex  '>
                        <div className='w-[95%] mx-auto flex-col  mt-10 '>
                            {/* First Row */}



                            <div className='flex flex-col   md:flex-row justify-between flex-wrap items-center'>
                                <div className="h-44  mb-4 w-full md:w-[23%]  bg-white border shadow-lg">


                                    <div className='  mx-auto relative h-full '>

                                        <div className='rounded-full h-12 w-12 flex items-center justify-center absolute top-[15%] left-[5%] bg-slate-200'>
                                            <ProductionQuantityLimitsIcon style={{ fontSize: 23, color: "#3c50e0", }} />
                                        </div>
                                        <div className='absolute top-[52%] left-[5%]'>
                                            <h1 className=' text-2xl font-normal '>
                                                {products && products.length}
                                            </h1>
                                            <span className='text-xs text-slate-500'>
                                                Total Products
                                            </span>
                                        </div>
                                    </div>

                                </div>
                                <div className="h-44 mb-4 w-full md:w-[23%] bg-white border shadow-lg">


                                    <div className='  mx-auto relative h-full '>

                                        <div className='rounded-full h-12 w-12 flex items-center justify-center absolute top-[15%] left-[5%] bg-slate-200'>
                                            < AttachMoneyIcon style={{ fontSize: 23, color: "#3c50e0", }} />
                                        </div>
                                        <div className='absolute top-[52%] left-[5%]'>
                                            <h1 className=' text-2xl font-normal '>
                                                {
                                                    totalSales
                                                }
                                            </h1>
                                            <span className='text-xs text-slate-500'>
                                                Total Sales
                                            </span>
                                        </div>
                                    </div>

                                </div>
                                <div className="h-44 mb-4 w-full md:w-[23%] bg-white border shadow-lg">


                                    <div className='  mx-auto relative h-full '>

                                        <div className='rounded-full h-12 w-12 flex items-center justify-center absolute top-[15%] left-[5%] bg-slate-200'>
                                            < PeopleOutlineIcon style={{ fontSize: 23, color: "#3c50e0", }} />
                                        </div>
                                        <div className='absolute top-[52%] left-[5%]'>
                                            <h1 className=' text-2xl font-normal '>
                                                {userCount}
                                            </h1>
                                            <span className='text-xs text-slate-500'>
                                                Total Users
                                            </span>
                                        </div>
                                    </div>

                                </div>
                                <div className="h-44  mb-4 w-full md:w-[23%] bg-white border shadow-lg">


                                    <div className='  mx-auto relative h-full '>

                                        <div className='rounded-full h-12 w-12 flex items-center justify-center absolute top-[15%] left-[5%] bg-slate-200'>
                                            <StoreIcon style={{ fontSize: 23, color: "#3c50e0", }} />
                                        </div>
                                        <div className='absolute top-[52%] left-[5%]'>
                                            <h1 className=' text-2xl font-normal '>
                                                {
                                                    totalOrders && totalOrders.length
                                                }
                                            </h1>
                                            <span className='text-xs text-slate-500'>
                                                Total Orders
                                            </span>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className='w-[100%] flex md:flex-row flex-col   justify-between mt-10    '>

                                <div className='w-[48%] rounded-md bg-white   shadow-xl  flex items-center hover:scale-105 transition-all delay-100   ' >
                                    <div className=' w-[90%] mx-auto  '>
                                        <BarChart />
                                    </div>

                                </div>
                                <div className='w-[48%] rounded-md bg-white   shadow-xl  flex items-center hover:scale-105 transition-all delay-100   ' >
                                    <div className=' w-[90%] mx-auto  '>
                                        <LineChart />
                                    </div>

                                </div>


                            </div>

                            {/* //Suppliers Table */}
                            <div className='mt-16 max-h-[40vh] overflow-y-auto'>
                                <SuppliersTable />
                            </div>

                            <div>
                                <OrdersList />
                            </div>






                        </div>


                    </div>
                )
            }
            {
                role === "customer" && (
                    <ErrorPage />
                )
            }

        </>
    )
}

export default AdminDashboard
