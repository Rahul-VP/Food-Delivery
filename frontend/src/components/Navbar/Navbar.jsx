import React, { useContext, useEffect, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getTotalCartAmount, token ,setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate('/')
  }

  return (
    <div className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
      
      {/* Mobile menu button */}
      <div 
        className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <ul className={`navbar-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/" onClick={() => {setMenu("home"); setIsMobileMenuOpen(false);}} className={`${menu === "home" ? "active" : ""}`}>home</Link>
        <a href='#explore-menu' onClick={() => {setMenu("menu"); setIsMobileMenuOpen(false);}} className={`${menu === "menu" ? "active" : ""}`}>menu</a>
        <a href='#app-download' onClick={() => {setMenu("mob-app"); setIsMobileMenuOpen(false);}} className={`${menu === "mob-app" ? "active" : ""}`}>mobile app</a>
        <a href='#footer' onClick={() => {setMenu("contact"); setIsMobileMenuOpen(false);}} className={`${menu === "contact" ? "active" : ""}`}>contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!token ? (
          <div className='navbar-auth-buttons'>
            <Link to="/login" className="auth-link">Sign In</Link>
            <Link to="/signup" className="auth-link signup-link">Sign Up</Link>
          </div>
        ) : (
          <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className='navbar-profile-dropdown'>
              <li onClick={()=>navigate('/myorders')}> <img src={assets.bag_icon} alt="" /> <p>Orders</p></li>
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li> 
            </ul>
          </div>
        )}

      </div>
    </div>
  )
}

export default Navbar
