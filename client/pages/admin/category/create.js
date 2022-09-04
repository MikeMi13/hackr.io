import { useState, useEffect } from "react";
import axios from 'axios';
import { API } from "../../../config";
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";

const Create = ({user, token}) => {
    const [state, setState] = useState({
        name: '',
        content: '',
        error: '',
        success: '',
        formData: process.browser && new FormData(), //browser API
        buttonText: 'Create',
        imageUploadText: 'Upload Image'
    });

    const {name, content, error, success, formData, buttonText, imageUploadText} = state;

    const handleChange = (field) => (event) => {
        const value = field === 'image' ? event.target.files[0] : event.target.value;
        const imageName = field === 'image' ? event.target.files[0].name : 'Upload Image';
        formData.set(field, value);
        setState({...state, [field]: value, error: '', success: '', imageUploadText: imageName});
    };

    const handleSubmit = async (event) => {
        // prevent page from reloading
        event.preventDefault();
        setState({...state, buttonText: 'Creating...'});
        //console.log(...formData);
        try {
            const response = await axios.post(`${API}/category`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('CATEGORY CREATE RESPONSE:', response);
            setState({
                ...state,
                name:'',
                content:'',
                formData: '',
                buttonText: 'Created',
                imageUploadText: 'Upload Image',
                success: `${response.data.name} is created!`
            });
        } catch (error) {
            console.log('CATEGORY CREATE ERROR:', error);
            setState({
                ...state,
                name: '',
                buttonText: 'Create',
                error: error.response.data.error
            });
        }
    };

    const createCategoryForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" required />
            </div>
            <div className="form-group">
                <label className="text-muted">Content</label>
                <textarea onChange={handleChange('content')} value={content} className="form-control" required />
            </div>
            <div className="form-group">
                <label className="btn btn-outline-secondary">
                    {imageUploadText}
                    <input onChange={handleChange('image')} type="file" accept="image/*" className="form-control" hidden />
                </label>
            </div>
            <div>
                <button className="btn btn-outline-primary">
                    {buttonText}
                </button>
            </div>
        </form>
    );

    return (
        <Layout>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h1>Create Category</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {createCategoryForm()}
                </div>
            </div>
        </Layout>
    );
};

export default withAdmin(Create);
