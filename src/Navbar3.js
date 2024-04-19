import React from 'react';
import Logo from './images/logo.png';
import './Navbar3.css'

export default function Navbar({responseData}){
    return(
        <>
        <div className='navbar-3'>
            <div className='left-section-3'>
                <div className='menu-name-literally-3'>
                    {responseData.newtitle}
                </div>
            </div>
            <div className='right-section-3'>
                <div className='logo-div-3'>
                    <img className='logo-3' src={Logo} alt="Logo"></img>
                </div>
            </div>
        </div>
        </>
    )
}