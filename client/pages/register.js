import { useState } from "react";
import Layout from "../components/Layout";


const Register = () => {
    const[state, setState] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: '',
        buttonText: 'Register'
    });

    const { name, email, password, error, success, buttonText } = state;

    // this function returns another arrow function
    const handleChange = (field) => (event) => {
        setState({...state, [field]: event.target.value, error: '', success: '', buttonText: 'Register'})
    };

    const handleSubmit = (event) => {
        // prevent page from reloading
        event.preventDefault();
        console.table({name, email, password});
    };

    const registerForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input value={name} onChange={handleChange('name')} type="text" className="form-control" placeholder="Enter your name here" />
            </div>
            <div className="form-group">
                <input value={email} onChange={handleChange('email')} type="email" className="form-control" placeholder="Enter your email here" />
            </div>
            <div className="form-group">
                <input value={password} onChange={handleChange('password')} type="password" className="form-control" placeholder="Enter your password here" />
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
            {registerForm()}
            <hr />
            {JSON.stringify(state)}
        </div>
    </Layout>;
};

export default Register;