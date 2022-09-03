import { useState } from "react";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import Layout from "../../../components/Layout";

const ForgotPassword = () => {
    const [state, setState] = useState({
        email: '',
        buttonText: 'Submit',
        success: '',
        error: ''
    });

    const { email, buttonText, success, error } = state;

    const handleChange = (event) => {
        setState({...state, email: event.target.value, success: '', error: ''});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //console.log('Post email to', email);
        try {
            const response = await axios.put(`${API}/forgot-password`, {email});
            //console.log('FORGOT PASSWORD', response);
            setState({
                ...state, email: '', buttonText: 'Done', success: response.data.message
            });
        } catch (err) {
            console.log('FORGOT PASSWORD', err);
            setState({
                ...state, error: err.response.data.error
            });
        };
    };

    const forgotPasswordForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input 
                    type="email"
                    className="form-control"
                    onChange={handleChange}
                    value={email}
                    placeholder="Enter your email here"
                    required
                />
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
                    <h1>Forgot Password</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {forgotPasswordForm()}
                </div>
            </div>
        </Layout>
    );
};

export default ForgotPassword;
