import React, { useContext, useState, useEffect } from 'react'
import './Signup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
    const { setToken, url, loadCartData } = useContext(StoreContext)
    const navigate = useNavigate()

    // Add console logging to debug
    useEffect(() => {
        console.log('Signup component mounted')
        console.log('StoreContext url:', url)
        console.log('Assets logo:', assets.logo)
    }, [url])

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const [isLoading, setIsLoading] = useState(false)

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onSignup = async (e) => {
        e.preventDefault()
        
        console.log('Signup attempt with data:', data)
        
        // Validate passwords match
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match!")
            return
        }

        // Validate password strength
        if (data.password.length < 6) {
            toast.error("Password must be at least 6 characters long!")
            return
        }

        setIsLoading(true)

        try {
            console.log('Making API call to:', `${url}/api/user/register`)
            const response = await axios.post(`${url}/api/user/register`, {
                name: data.name,
                email: data.email,
                password: data.password
            })

            console.log('API response:', response.data)

            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem("token", response.data.token)
                loadCartData({ token: response.data.token })
                toast.success("Account created successfully!")
                navigate('/')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.error('Signup error:', error)
            toast.error(error.response?.data?.message || "Something went wrong!")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='signup-page'>
            <div className="signup-container">
                <div className="signup-header">
                    <Link to="/" className="logo-link">
                        <img className='logo' src={assets.logo} alt="Tomato Logo" />
                    </Link>
                    <h1>Create Your Account</h1>
                    <p>Join Tomato Food Delivery and start ordering delicious meals!</p>
                </div>

                <form onSubmit={onSignup} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name='name'
                            onChange={onChangeHandler}
                            value={data.name}
                            type="text"
                            placeholder='Enter your full name'
                            required
                        />
                    </div>

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
                            placeholder='Create a password'
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            name='confirmPassword'
                            onChange={onChangeHandler}
                            value={data.confirmPassword}
                            type="password"
                            placeholder='Confirm your password'
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">
                            I agree to the <a href="#" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                        </label>
                    </div>

                    <button type="submit" className="signup-button" disabled={isLoading}>
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="signup-footer">
                    <p>Already have an account? <Link to="/login">Sign in here</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Signup 