import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Router from "next/router";
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { isAuth } from "../helpers/auth";

const Register = () => {
    const[state, setState] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Register',
        categories: [],
        loadedCategories: []
    });

    const { name, email, password, error, success, buttonText, categories, loadedCategories } = state;

    useEffect(() => {
        loadCategories();
    }, [success]);

    useEffect(() => {
        // if already logged in, don't want users to see the register page again
        isAuth() && Router.push('/');
    }, []);

    const loadCategories = async () => {
        const response = await axios.get(`${API}/categories`);
        setState({ ...state, loadedCategories: response.data });
    };

    const handleToggle = (c_id) => () => {
        const selectedCategory = categories.indexOf(c_id);
        const allSelected = [...categories];

        if (selectedCategory === -1) {
            // category not found, push
            allSelected.push(c_id);
        } else {
            // category found, remove
            allSelected.splice(selectedCategory, 1)
        }

        setState({...state, categories: allSelected, success: '', error: ''});
    };

    // show categories using checkbox
    const showCategories = () => {
        return loadedCategories && loadedCategories.map((c, i) => (
            <li className="list-unstyled" key={c._id}>
                <input type="checkbox" onChange={handleToggle(c._id)} className="mr-2" />
                <label className="form-check-label" >{c.name}</label>
            </li>
        ));
    };

    // this function returns another arrow function
    const handleChange = (field) => (event) => {
        setState({...state, [field]: event.target.value, error: '', success: '', buttonText: 'Register'})
    };

    const handleSubmit = async (event) => {
        // prevent page from reloading
        event.preventDefault();
        //console.table({name, email, password});
        setState({...state, buttonText: 'Registering...'});
        try {
            const response = await axios.post(`${API}/register`, {
                name,
                email,
                password,
                categories
            });
            console.log(response);
            setState({
                ...state,
                name: '',
                email: '',
                password: '',
                buttonText: 'Submitted',
                success: response.data.message,
                categories: []
            });
        } catch (error) {
            console.log(error);
            setState({
                ...state,
                buttonText: 'Register',
                error: error.response.data.error
            });
        }
    };

    // const handleSubmit = (event) => {
    //     // prevent page from reloading
    //     event.preventDefault();
    //     //console.table({name, email, password});
    //     setState({...state, buttonText: 'Registering...'});
    //     axios.post(`http://localhost:8000/api/register`, {
    //         name,
    //         email,
    //         password
    //     })
    //     .then(response => {
    //         console.log(response);
    //         setState({
    //             ...state,
    //             name: '',
    //             email: '',
    //             password: '',
    //             buttonText: 'Submitted',
    //             success: response.data.message
    //         });
    //     })
    //     .catch(error => {
    //         console.log(error);
    //         setState({
    //             ...state,
    //             buttonText: 'Register',
    //             error: error.response.data.error
    //         });
    //     });
    // };

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input value={name} onChange={handleChange('name')} type="text" className="form-control" placeholder="Enter your name here" required />
            </div>
            <div className="form-group">
                <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Enter your email here" required />
            </div>
            <div className="form-group">
                <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Enter your password here" required />
            </div>
            <div className="form-group">
                <label className="text-muted ml-4">Choose your favorite category</label>
                <ul style={{maxHeight: '100px', overflowY: 'scroll'}}>
                    {showCategories()}
                </ul>
            </div>
            <div className="form-group">
                <button className="btn btn-outline-primary">{buttonText}</button>
            </div>
        </form>
    );

    return <Layout>
        <div className="col-md-6 offset-md-3">
            <h1>Register</h1>
            <br />
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {registerForm()}
        </div>
    </Layout>;
};

export default Register;