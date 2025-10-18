import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../App.css';

const Navbar = () => {
  return (
    <>
        <nav>
            <div className='start'>
                <Link to="/"><img src={logo} alt="HackHive Logo" /></Link>
            </div>
            <div className='navbar'>
                <div className='navoptions'>
                    <div className='center'>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/courses">Courses</Link></li>
                        <li><Link to="/workshops">Workshops</Link></li>
                        <li><Link to="/faqs">FAQs</Link></li>
                    </div>
                    <div className='last'>
                        <li className='login'><Link to="/login">Login</Link></li>
                        <li className='register'><Link to="/register">Register</Link></li>
                    </div>
                </div>
                <p>Hammburgur</p>
            </div>
        </nav>
    </>
  )
}

export default Navbar