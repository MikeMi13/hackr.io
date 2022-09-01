import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';

const Login = () => {
    const[state, setState] = useState({
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Login'
    });

    const { email, password, error, success, buttonText } = state;

    // this function returns another arrow function
    const handleChange = (field) => (event) => {
        setState({...state, [field]: event.target.value, error: '', success: '', buttonText: 'Login'})
    };

    const handleSubmit = async (event) => {
        // prevent page from reloading
        event.preventDefault();
        setState({...state, buttonText: 'Logging in...'});
        try {
            const response = await axios.post(`${API}/login`, {
                email,
                password
            });
            console.log(response);
        } catch (error) {
            console.log(error);
            setState({
                ...state,
                buttonText: 'Login',
                error: error.response.data.error
            });
        }
    };

    const loginForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Enter your email here" required />
            </div>
            <div className="form-group">
                <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Enter your password here" required />
            </div>
            <div className="form-group">
                <button className="btn btn-outline-primary">{buttonText}</button>
            </div>
        </form>
    );

    return <Layout>
        <div className="col-md-6 offset-md-3">
            <h1>Login</h1>
            <br />
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {loginForm()}
        </div>
    </Layout>;
};

export default Login;