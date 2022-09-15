import Layout from '../../components/Layout';
import Link from 'next/link';
import axios from 'axios';
import {API} from '../../config';

const Links = ({query, category, links, totalLinks, linksLimit, linksSkip}) => {
    return (
        <Layout>
            <div className='row'>
                <div className='col-md-8'>
                    {JSON.stringify(links)}
                </div>
                <div className='col-md-4'>
                    right sidebar
                </div>
            </div>
        </Layout>
    );
};

Links.getInitialProps = async ({query, req}) => {
    let skip = 0;
    let limit = 2;

    const response = await axios.post(`${API}/category/${query.slug}`, {skip, limit});

    return {
        query,
        category: response.data.category,
        links: response.data.links,
        totalLinks: response.data.links.length,
        linksLimit: limit,
        linksSkip: skip
    };
};

export default Links;
