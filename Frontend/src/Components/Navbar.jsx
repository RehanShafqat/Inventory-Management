import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Person2Icon from '@mui/icons-material/Person2';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CategoryIcon from '@mui/icons-material/Category';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import New from "../assets/New.png"
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close'; const Navbar = () => {

    //navbar functions
    const [isChecked, setIsChecked] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const handleToggle = () => {
        setIsChecked(!isChecked);
    };
    const handleAvatarClick = () => {
        setShowDropdown(!showDropdown); // Toggle dropdown visibility on avatar click
    };


    //sidebar functions
    const [isVisible, setIsVisible] = useState(null);
    const [width, setInnerWidth] = useState(window.innerWidth);
    const handleClick = () => {
        setIsVisible(!isVisible)
    }
    window.addEventListener('resize', () => {
        setInnerWidth(window.innerWidth)
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    })
    useEffect(() => {
        // Reset body overflow when sidebar is hidden
        if (!isVisible) {
            document.body.style.overflowY = 'auto';
        }
    }, [isVisible]);
    const routes = {
        dashboard: '/dashboard',
        profile: '/profile',
        products: '/products',
        orders: '/orders',
        addSupplier: '/add-supplier',
        addCategory: '/add-category',
        placeOrder: '/place-order'
    };

    return (
        <>

            {/* Navbar */}
            <div className=" absolute  border-b-2 flex items-center   justify-between  shadow-sm h-20 w-[100%]  ">

                <button className={`${isVisible ? "hidden" : "visible"}`} onClick={handleClick}>
                    <MenuIcon className='cursor-pointer ml-4 mr-4' style={{ fontSize: "30px" }} />
                </button>
                <div className="flex  items-center justify-between  w-[95%] mx-auto  h-full  ">

                    {/* search field */}
                    <div className='sm:w-[650px] w-[100%] md:ml-60  '>
                        {
                            width > 525 && (
                                <SearchIcon className='ml-1' />
                            )
                        }
                        {
                            width > 300 && (
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className={`text-black rounded-md py-2 px-4 border-none outline-none    ${width > 525 ? "w-[93%]" : "w-[100%]"} `}
                                />
                            )
                        }
                    </div>


                    <div className='flex items-center justify-between  '>
                        <div className="flex items-center m flex-col">
                            <input
                                type="checkbox"
                                id="toggle"
                                className="sr-only "
                                checked={isChecked}
                                onChange={handleToggle}
                            />
                            <label
                                htmlFor="toggle"
                                className="relative block w-14 h-8 rounded-full bg-slate-300 cursor-pointer"
                            >
                                <span
                                    className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white transition transform ${isChecked ? 'translate-x-full' : 'translate-x-0'
                                        }`}
                                ></span>
                            </label>
                        </div>
                        <div className="relative ml-4">
                            <div className="cursor-pointer w-12 h-12 mr-2 bg-cover bg-center " onClick={handleAvatarClick} style={
                                {
                                    backgroundImage: `url("https://react-demo.tailadmin.com/assets/user-01-b007ff3f.png")`
                                }

                            }  >



                            </div>
                            {showDropdown && (
                                <div className="absolute right-0 mt-2 z-20 w-48 bg-white rounded-md shadow-md">
                                    <ul className="py-2">
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                // Handle profile click
                                                setShowDropdown(false);
                                                // Navigate to profile page or show profile modal
                                            }}
                                        >
                                            My Profile
                                        </li>
                                        <li
                                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                // Handle logout click
                                                setShowDropdown(false);
                                                // Perform logout action (e.g., clear session)
                                            }}
                                        >
                                            Logout
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>




            {/* SideBar */}

            <div className={` ${width < 1100 ? "absolute" : "fixed"} left-0 z-50 h-screen  overflow-y-auto min-w-[200px]    sm:w-[300px] text-slate-400 shadow-2xl bg-darkModeColor transition-all delay-100 ease-in-out ${width > 1100 ? "-translate-x-0" : `${isVisible ? "-translate-x-0" : "-translate-x-full"}`}`} >
                {width < 1100 && (
                    <button className='absolute z-50  sm:top-[2%] left-[88%]' onClick={() => { setIsVisible(false) }}>
                        <CloseIcon className='w-[100%]' />
                    </button>

                )
                }


                {/* main div */}
                <div className='  ml-4 flex  h-[5%] items-center  '>

                    <img src={New} alt="LOGO" className=' w-56 mt-10 ' />


                </div>
                <div className='ml-4 mt-8 h-[85%] flex flex-col justify-between '>


                    <div className='h-[42%]  mt-10'>
                        <p className='ml-3 text-sm font-semibold  uppercase'>
                            Menu
                        </p>

                        <ul className='flex flex-col h-full ml-4 '>
                            <Link to={routes.dashboard} className='flex items-center transition-all ease-in-out delay-80   font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-3 h-10 w-[90%] hover:-translate-y-1 hover:scale-110 '> <DashboardIcon className='ml-3 ' />  <li className='ml-2 '>Dashboard</li></Link>

                            <Link to={routes.profile} className='flex    items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-3 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'><Person2Icon className='ml-3' /><li className='ml-2'>Profile</li></Link>
                            <Link to={routes.products} className='flex items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-3 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'><InventoryIcon className='ml-3' /><li className='ml-2'>Products</li></Link>
                            <Link to={routes.orders} className='flex   items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-3 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'><ShoppingCartCheckoutIcon className='ml-3' /><li className='ml-2'>Orders</li></Link>
                            <Link to={routes.addSupplier} className='flex   items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-3 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'><PersonAddIcon className='ml-3' /><li className='ml-2'>Add Supplier</li></Link>
                            <Link to={routes.addCategory} className='flex   items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-3 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'><CategoryIcon className='ml-3' /><li className='ml-2'>Add Category</li></Link>
                            <Link to={routes.placeOrder} className='flex   items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-3 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'><AddShoppingCartIcon className='ml-3' /><li className='ml-2'>Place Order</li></Link>
                        </ul>
                    </div>
                    <div className='h-[20%] mt-6  '>
                        <p className='ml-3 text-sm font-semibold  uppercase'>
                            Support
                        </p>

                        <ul className='flex flex-col mt-2  h-full ml-4 '>
                            <Link to={routes.dashboard} className='flex items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-1 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'> <DashboardIcon className='ml-2' />  <li className='ml-2'>Dashboard</li></Link>


                            <Link to={routes.profile} className='flex items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-1 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'><Person2Icon className='ml-2' /><li className='ml-2'>Profile</li></Link>
                            <Link to={routes.products} className='flex items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-1 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'><InventoryIcon className='ml-2' /><li className='ml-2'>Products</li></Link>

                        </ul>
                    </div>
                    <div className='h-[20%]  '>
                        <p className='ml-3 text-sm font-semibold  uppercase'>
                            Others
                        </p>

                        <ul className='flex flex-col mt-2  ml-4 '>
                            <Link to={routes.dashboard} className='flex items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-1 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'> <DashboardIcon className='ml-2' />  <li className='ml-2'>Dashboard</li></Link>

                            <Link to={routes.profile} className='flex items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-1 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'><Person2Icon className='ml-2' /><li className='ml-2'>Profile</li></Link>
                            <Link to={routes.products} className='flex items-center font-medium text-[15px]  text-slate-300 hover:bg-slate-700 mt-1 h-10 w-[90%] hover:-translate-y-1 hover:scale-110  transition-all ease-in-out delay-80'><InventoryIcon className='ml-2' /><li className='ml-2'>Products</li></Link>

                        </ul>
                    </div>
                </div>
            </div >

        </>

    );
};

export default Navbar;
