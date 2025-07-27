import React, { useContext, useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const { setToken, url, loadCartData } = useContext(StoreContext)
    const navigate = useNavigate()

    const [data, setData] = useState({
        email: "",
        password: ""
    })

    const [isLoading, setIsLoading] = useState(false)

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await axios.post(`${url}/api/user/login`, data)

            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem("token", response.data.token)
                loadCartData({ token: response.data.token })
                toast.success("Login successful!")
                navigate('/')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='login-page'>
            <div className="login-container">
                <div className="login-header">
                    <Link to="/" className="logo-link">
                        <img className='logo' src={assets.logo} alt="Tomato Logo" />
                    </Link>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your Tomato Food Delivery account</p>
                </div>

                <form onSubmit={onLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name='email'
                            onChange={onChangeHandler}
                            value={data.email}
                            type="email"
                            placeholder='Enter your email address'
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name='password'
                            onChange={onChangeHandler}
                            value={data.password}
                            type="password"
                            placeholder='Enter your password'
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                    </div>

                    <button type="submit" className="login-button" disabled={isLoading}>
                        {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login 