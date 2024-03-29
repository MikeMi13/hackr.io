import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});
import 'react-quill/dist/quill.snow.css';
import { API } from "../../../config";
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";


const Create = ({ user, token }) => {
    const [state, setState] = useState({
        name: '',
        error: '',
        success: '',
        buttonText: 'Create',
        image: ''
    });

    const [content, setContent] = useState('');
    const [imageUploadText, setImageUploadText] = useState('Upload Image');

    const { name, error, success, buttonText, image } = state;

    const handleChange = (field) => (event) => {
        setState({ ...state, [field]: event.target.value, error: '', success: '' });
    };

    const handleContent = (event) => {
        setContent(event);
        setState({...state, success: '', error: ''});
    };

    const handleImage = (event) => {
        let fileInput = false;
        if (event.target.files[0]) {
            fileInput = true;
        }
        setImageUploadText(event.target.files[0].name);
        if (fileInput) {
            try {
                Resizer.imageFileResizer(
                    event.target.files[0],
                    300,
                    300,
                    "JPEG",
                    100,
                    0,
                    (uri) => {
                        //console.log(uri);
                        setState({...state, image: uri, success: '', error: ''});
                    },
                    "base64"
                );
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleSubmit = async (event) => {
        // prevent page from reloading
        event.preventDefault();
        setState({ ...state, buttonText: 'Creating...' });
        //console.log(...formData);
        try {
            const response = await axios.post(`${API}/category`, {name, content, image}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('CATEGORY CREATE RESPONSE:', response);
            setContent('');
            setState({
                ...state,
                name: '',
                buttonText: 'Created',
                image: '',
                success: `${response.data.name} is created!`
            });
            //console.log(state);
            setImageUploadText('Upload Image');
        } catch (error) {
            console.log('CATEGORY CREATE ERROR:', error);
            setState({
                ...state,
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
                <ReactQuill
                    value={content}
                    onChange={handleContent}
                    placeholder="Write something here..."
                    theme='snow'
                    className='pb-5 mb-3'
                    style={{border: '1px solid #666'}}
                />
            </div>
            <div className="form-group">
                <label className="btn btn-outline-secondary">
                    {imageUploadText}
                    <input onChange={handleImage} type="file" accept="image/*" className="form-control" hidden />
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
