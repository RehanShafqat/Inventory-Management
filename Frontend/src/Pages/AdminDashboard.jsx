import React from 'react'
import Navbar from '../Components/Navbar'
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StoreIcon from '@mui/icons-material/Store'; import { BarChart } from '@mui/icons-material';
const AdminDashboard = () => {
    return (
        <>
            <div className='h-[100vh] w-[100%] bg-bgWhite flex  '>
                <div className='w-[95%] mx-auto flex-col  mt-10 '>
                    {/* First Row */}



                    <div className='flex flex-col   md:flex-row justify-between flex-wrap items-center'>
                        <div className="h-44  mb-4 w-full md:w-[23%]  bg-white border shadow-xl">


                            <div className='  mx-auto relative h-full '>

                                <div className='rounded-full h-12 w-12 flex items-center justify-center absolute top-[15%] left-[5%] bg-slate-200'>
                                    <ProductionQuantityLimitsIcon style={{ fontSize: 23, color: "#3c50e0", }} />
                                </div>
                                <div className='absolute top-[52%] left-[5%]'>
                                    <h1 className=' text-2xl font-normal '>
                                        4325
                                    </h1>
                                    <span className='text-xs text-slate-500'>
                                        Total Products
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div className="h-44 mb-4 w-full md:w-[23%] bg-white border shadow-xl">


                            <div className='  mx-auto relative h-full '>

                                <div className='rounded-full h-12 w-12 flex items-center justify-center absolute top-[15%] left-[5%] bg-slate-200'>
                                    < AttachMoneyIcon style={{ fontSize: 23, color: "#3c50e0", }} />
                                </div>
                                <div className='absolute top-[52%] left-[5%]'>
                                    <h1 className=' text-2xl font-normal '>
                                        $4325
                                    </h1>
                                    <span className='text-xs text-slate-500'>
                                        Total Sales
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div className="h-44 mb-4 w-full md:w-[23%] bg-white border shadow-xl">


                            <div className='  mx-auto relative h-full '>

                                <div className='rounded-full h-12 w-12 flex items-center justify-center absolute top-[15%] left-[5%] bg-slate-200'>
                                    < PeopleOutlineIcon style={{ fontSize: 23, color: "#3c50e0", }} />
                                </div>
                                <div className='absolute top-[52%] left-[5%]'>
                                    <h1 className=' text-2xl font-normal '>
                                        4325
                                    </h1>
                                    <span className='text-xs text-slate-500'>
                                        Total Users
                                    </span>
                                </div>
                            </div>

                        </div>
                        <div className="h-44  mb-4 w-full md:w-[23%] bg-white border shadow-xl">


                            <div className='  mx-auto relative h-full '>

                                <div className='rounded-full h-12 w-12 flex items-center justify-center absolute top-[15%] left-[5%] bg-slate-200'>
                                    <StoreIcon style={{ fontSize: 23, color: "#3c50e0", }} />
                                </div>
                                <div className='absolute top-[52%] left-[5%]'>
                                    <h1 className=' text-2xl font-normal '>
                                        4325
                                    </h1>
                                    <span className='text-xs text-slate-500'>
                                        Total Orders
                                    </span>
                                </div>
                            </div>

                        </div>

                    </div>






               

                </div>


            </div>
        </>
    )
}

export default AdminDashboard
