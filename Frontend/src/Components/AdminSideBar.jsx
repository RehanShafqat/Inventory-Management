import { useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Person2Icon from '@mui/icons-material/Person2';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CategoryIcon from '@mui/icons-material/Category';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import New from "../assets/New.png"
import { Link } from 'react-router-dom';
import { Translate } from '@mui/icons-material';
import Navbar from './Navbar';
const AdminSidear = () => {
    const sideBarWidth = 288;
    const [isOpen, setIsOpen] = useState(null);
    const [width, setInnerWidth] = useState(window.innerWidth);
    const [TranslateValue, setTranslateValue] = useState(null);
    const handleClick = () => {
        setTranslateValue(50)
    }




    window.addEventListener('resize', () => {
        setInnerWidth(window.innerWidth)
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    })


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
        
        </>
    );
};

export default AdminSidear;
