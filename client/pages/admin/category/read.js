import { useState, useEffect } from "react";
import axios from 'axios';
import { API } from "../../../config";
import Link from 'next/link';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Layout from "../../../components/Layout";
import withAdmin from "../../withAdmin";

const Read = ({user, token}) => {
    const [state, setState] = useState({
        error: '',
        success: '',
        categories: []
    });

    const {error, success, categories} = state;

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const response = await axios.get(`${API}/categories`);
        setState({...state, categories: response.data});
    };

    const listCategories = () => categories.map((c, i) => (
        <Link href={`/links/${c.slug}`}>
            <a style={{border: '1px solid grey'}} className="bg-light p-3 col-md-6" >
                <div>
                    <div className='row'>
                        <div className='col-md-4'>
                            <img src={c.image && c.image.url} alt={c.name} style={{width: '100px', height: 'auto'}} className="pr-3"/>
                        </div>
                        <div className='col-md-8'>
                            <h3>{c.name}</h3>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    ));

    return (
        <Layout>
            <div className="row">
                <div className="col-md-12">
                    <h1>List of Categories</h1>
                    <br />
                </div>
            </div>

            <div className="row">{listCategories()}</div>
        </Layout>
    )

};

export default withAdmin(Read);
