import React from 'react'

function Login() {
    return (
        <div>
           <form>
                <div>
                    <p>Sign In</p>
                    <p>Sign in to view open orders, update billing information and view past order details.</p>
                    <label>Email</label>
                    <input type='text' name='email' placeholder='Enter your Email'/>
                    <label>Password</label>
                    <input type='password' name='email' placeholder='Enter your Password'/>
                </div>
           </form>
        </div>
    )
}

export default Login
