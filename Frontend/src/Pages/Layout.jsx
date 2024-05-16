import React, { useState } from 'react'
import AdminSideBar from '../Components/AdminSideBar'
import Navbar from '../Components/Navbar'
const Layout = ({ routes, children }) => {

    const [width, setInnerWidth] = useState(window.innerWidth);
    window.addEventListener('resize', () => {
        setInnerWidth(window.innerWidth)
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    })
    return (
        <div className='flex'>

            <div>
                <Navbar routes={routes} />
            </div>

            <div className={`relative h-fit  top-[5rem] w-[100vw]    `} >
                <div className={`${width > 1100 ? "ml-[19rem]" : ""}    `}>
                    {children}
                </div>
            </div>



        </div>
    )
}

export default Layout
