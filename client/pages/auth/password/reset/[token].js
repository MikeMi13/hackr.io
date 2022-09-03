import { useState, useEffect } from "react";
import axios from "axios";
import { showSuccessMessage, showErrorMessage } from '../../../../helpers/alerts';
import { API } from '../../../../config';
import Router, {withRouter} from "next/router";
import jwt from 'jsonwebtoken';
import Layout from "../../../../components/Layout";

const ResetPassword = ({router}) => {
    const [state, setState] = useState({
        name: '',
        token: '',
        newPassword: '',
        buttonText: 'Submit',
        success: '',
        error: ''
    });

    const { name, token, newPassword, buttonText, success, error } = state;

    useEffect(() => {
        const decoded = jwt.decode(router.query.token);
        if (decoded) {
            setState({...state, name: decoded.name, token: router.query.token});
        }
    }, [router]);

    const handleChange = (event) => {
        setState({...state, newPassword: event.target.value, success: '', error: ''});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        //console.log('Post email to', email);
        setState({...state, buttonText: 'Sending...'});
        try {
            const response = await axios.put(`${API}/reset-password`, {resetPasswordLink: token, newPassword});
            //console.log('RESET PASSWORD', response);
            setState({
                ...state, newPassword: '', buttonText: 'Done', success: response.data.message
            });
        } catch (err) {
            console.log('RESET PASSWORD', err);
            setState({
                ...state, error: err.response.data.error
            });
        };
    };

    const resetPasswordForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input 
                    type="password"
                    className="form-control"
                    onChange={handleChange}
                    value={newPassword}
                    placeholder="Enter your new password here"
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
                    <h1>Hi {name}, ready to reset your password?</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    {resetPasswordForm()}
                </div>
            </div>
        </Layout>
    );
};

export default withRouter(ResetPassword);
