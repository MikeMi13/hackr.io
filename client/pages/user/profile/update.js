import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import withUser from '../../withUser';

const Profile = ({user, token}) => {
    const[state, setState] = useState({
        name: user.name,
        email: user.email,
        password: '',
        error: '',
        success: '',
        buttonText: 'Update',
        categories: user.categories,
        loadedCategories: []
    });

    const { name, email, password, error, success, buttonText, categories, loadedCategories } = state;

    useEffect(() => {
        loadCategories();
    }, [success]);

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
                <input checked={categories.includes(c._id)} type="checkbox" onChange={handleToggle(c._id)} className="mr-2" />
                <label className="form-check-label" >{c.name}</label>
            </li>
        ));
    };

    // this function returns another arrow function
    const handleChange = (field) => (event) => {
        setState({...state, [field]: event.target.value, error: '', success: '', buttonText: 'Update'})
    };

    const handleSubmit = async (event) => {
        // prevent page from reloading
        event.preventDefault();
        setState({...state, buttonText: 'Updating...'});
        try {
            const response = await axios.put(`${API}/user`, {
                name,
                password,
                categories
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response);
            setState({
                ...state,
                buttonText: 'Updated',
                success: 'Profile updated successfully.',
            });
        } catch (error) {
            console.log(error);
            setState({
                ...state,
                buttonText: 'Update',
                error: error.response.data.error
            });
        }
    };

    const updateForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input value={name} onChange={handleChange('name')} type="text" className="form-control" placeholder="Enter your name here" required />
            </div>
            <div className="form-group">
                <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Enter your email here" required disabled/>
            </div>
            <div className="form-group">
                <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Enter your password here" />
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
            <h1>Update Profile</h1>
            <br />
            {success && showSuccessMessage(success)}
            {error && showErrorMessage(error)}
            {updateForm()}
        </div>
    </Layout>;
};

export default withUser(Profile);