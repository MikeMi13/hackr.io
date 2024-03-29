import React, { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import axios from 'axios';
import withUser from '../../withUser';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts'
import { getCookie, isAuth } from "../../../helpers/auth";

const Update = ({oldLink, token}) => {
    const [state, setState] = useState({
        title: oldLink.title,
        url: oldLink.url,
        categories: oldLink.categories,
        loadedCategories: [],
        success: '',
        error: '',
        type: oldLink.type,
        medium: oldLink.medium
    });

    const { title, url, categories, loadedCategories, success, error, type, medium } = state;

    // load categories when component mounts using useEffect
    useEffect(() => {
        loadCategories();
    }, [success]);

    const loadCategories = async () => {
        const response = await axios.get(`${API}/categories`);
        setState({ ...state, loadedCategories: response.data });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let dynamicUpdateURL;
        // check logged-in user's role
        if (isAuth() && isAuth().role === 'admin') {
            dynamicUpdateURL = `${API}/link/admin/${oldLink._id}`;
        } else {
            dynamicUpdateURL = `${API}/link/${oldLink._id}`;
        }

        try {
            const response = await axios.put(dynamicUpdateURL, {title, url, categories, type, medium}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setState({...state,
                success: 'Link is updated!',
                error: '',
            });
        } catch (err) {
            console.log('LINK UPDATE ERROR:', err);
            setState({...state, error: err.response.data.error});
        }
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
                <input type="checkbox" checked={categories.includes(c._id)} onChange={handleToggle(c._id)} className="mr-2" />
                <label className="form-check-label" >{c.name}</label>
            </li>
        ));
    };

    const handleTypeClick = (e) => {
        setState({ ...state, type: e.target.value, success: '', error: '' });
    };

    // show types using radio button
    const showTypes = () => (
        <React.Fragment>
            <div className="form-check pl-5 ml-3">
                <label className="form-check-label">
                    <input type="radio" onClick={handleTypeClick} checked={type === 'free'} value='free' className="form-check-input" />
                    Free
                </label>
            </div>
            <div className="form-check pl-5 ml-3">
                <label className="form-check-label">
                    <input type="radio" onClick={handleTypeClick} checked={type === 'paid'} value='paid' className="form-check-input" />
                    Paid
                </label>
            </div>
        </React.Fragment>
    );


    const handleMediumClick = (e) => {
        setState({ ...state, medium: e.target.value, success: '', error: '' });
    };

    // show medium using radio button
    const showMedium = () => (
        <React.Fragment>
            <div className="form-check pl-5 ml-3">
                <label className="form-check-label">
                    <input type="radio" onClick={handleMediumClick} checked={medium === 'video'} value='video' className="form-check-input" />
                    Video
                </label>
            </div>
            <div className="form-check pl-5 ml-3">
                <label className="form-check-label">
                    <input type="radio" onClick={handleMediumClick} checked={medium === 'book'} value='book' className="form-check-input" />
                    Book
                </label>
            </div>
        </React.Fragment>
    );

    const handleTitleChange = (e) => {
        setState({ ...state, title: e.target.value, success: '', error: '' });
    };

    const handleURLChange = (e) => {
        setState({ ...state, url: e.target.value, success: '', error: '' });
    };

    // link create form
    const submitLinkForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input type="text" className="form-control" onChange={handleTitleChange} value={title} />
            </div>
            <div className="form-group">
                <label className="text-muted">URL</label>
                <input type="url" className="form-control" onChange={handleURLChange} value={url} />
            </div>
            <div>
                <button disabled={!token} className="btn btn-outline-primary" type="submit">
                    {isAuth() || token ? 'Update' : 'Login To Post'}
                </button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="row">
                <div className="col-md-12">
                    <h1>Update Link/URL</h1>
                    <br />
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="text-muted ml-4">Category</label>
                        <ul style={{maxHeight: '100px', overflowY: 'scroll'}}>
                            {showCategories()}
                        </ul>
                    </div>
                    <div className="form-group">
                        <label className="text-muted ml-4">Type</label>
                        {showTypes()}
                    </div>
                    <div className="form-group">
                        <label className="text-muted ml-4">Medium</label>
                        {showMedium()}
                    </div>
                </div>
                <div className="col-md-8">
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {submitLinkForm()}
                </div>
            </div>
        </Layout>
    )
};

Update.getInitialProps = async ({req, token, query}) => {
    const response = await axios.get(`${API}/link/${query.id}`);
    return {oldLink: response.data, token};
}

export default withUser(Update);

