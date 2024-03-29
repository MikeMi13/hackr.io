import { useState, useEffect, Fragment } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Head from 'next/head';
import axios from 'axios';
import renderHTML from 'react-render-html';
import moment from 'moment';
import {API, APP_NAME} from '../../config';
import InfiniteScroll from 'react-infinite-scroller';

const Links = ({query, category, links, totalLinks, linksLimit, linksSkip}) => {

    const [allLinks, setAllLinks] = useState(links);
    const [limit, setLimit] = useState(linksLimit);
    const [skip, setSkip] = useState(linksSkip);
    const [size, setSize] = useState(totalLinks);
    const [popular, setPopular] = useState([]);

    const head = () => (
        <Head>
            <title>
                {category.name} | {APP_NAME}
            </title>
            <meta name='description' content={category.content.substring(0, 160)} />
            <meta property='og:title' content={category.name} />
            <meta property='og:image' content={category.image.url} />
        </Head>
    );

    useEffect(() => {
        loadPopularLinks();
    }, []);

    const loadPopularLinks = async () => {
        const response = await axios.get(`${API}/link/popular/${category.slug}`);
        setPopular(response.data);
    };

    const handleClick = async (linkId) => {
        const response = await axios.put(`${API}/click-count`, {linkId});
        loadUpdatedLinks();
        loadPopularLinks();
    }

    const loadUpdatedLinks = async () => {
        const response = await axios.post(`${API}/category/${query.slug}`);
        setAllLinks(response.data.links);
    };

    const listOfPopularLinks = () => (
        popular.map((l, i) => (
            <div key={i} className='row alert alert-secondary m-1 p-2'>
                <div className='col-md-8' onClick={() => handleClick(l._id)}>
                    <a href={l.url} target="_blank">
                        <h5 className='pt-2'>
                            {l.title}
                        </h5>
                        <h6 className='pt-2 text-danger' style={{fontSize: '12px'}}>
                            {l.url}
                        </h6>
                    </a>
                </div>
                <div className='col-md-4 pt-2'>
                    <span className='pull-right'>
                        {moment(l.createdAt).fromNow()} by {l.postedBy.name}
                    </span>
                </div>
                <div className='col-md-12'>
                    <span className='badge text-dark'>
                        {l.type} {l.medium}
                    </span>
                    {l.categories.map((c, i) => (<span key={i} className="badge text-success">{c.name}</span>))}
                    <span className='badge text-secondary float-right'>{l.clicks} clicks</span>
                </div>
            </div>
        ))
    );

    const listOfLinks = () => (
        allLinks.map((link, i) => (
            <div key={i} className='row alert alert-primary m-1 p-2'>
                <div className='col-md-8' onClick={() => handleClick(link._id)}>
                    <a href={link.url} target="_blank">
                        <h5 className='pt-2'>{link.title}</h5>
                        <h6 className='pt-2 text-danger' style={{fontSize: '12px'}}>{link.url}</h6>
                    </a>
                </div>
                <div className='col-md-4 pt-2'>
                    <span className='pull-right'>{moment(link.createdAt).fromNow()} by {link.postedBy.name}</span>
                    <br />
                    <span className='badge text-secondary pull-right'>{link.clicks} clicks</span>
                </div>
                <div className='col-md-12'>
                    <span className='badge text-dark'>{link.type} {link.medium}</span>
                    {link.categories.map((c, i) => (<span key={i} className='badge text-success'>{c.name}</span>))}
                </div>
            </div>
        ))
    );

    const loadMore = async () => {
        let toSkip = skip + limit;
        const response = await axios.post(`${API}/category/${query.slug}`, {skip: toSkip, limit});
        setAllLinks([...allLinks, ...response.data.links]);
        setSize(response.data.links.length);
        setSkip(toSkip);
    };

    return (
        <Fragment>
            {head()}
            <Layout>
                <div className='row'>
                    <div className='col-md-8'>
                        <h1 className='display-4 font-weight-bold'>{category.name} - URL/Links</h1>
                        <div className='lead alert alert-secondary pt-4'>{renderHTML(category.content)}</div>
                    </div>
                    <div className='col-md-4'>
                        <img src={category.image.url} alt={category.name} style={{width: 'auto', maxHeight: '200px'}} />
                    </div>
                </div>
                <br />
                
                <InfiniteScroll
                    pageStart={0}
                    loadMore={loadMore}
                    hasMore={size > 0 && size >= limit}
                    loader={<img key={0} src='/static/images/loading.gif' alt='loading' />}
                >
                    <div className='row'>
                        <div className='col-md-8'>
                            {listOfLinks()}  
                        </div>
                        <div className='col-md-4'>
                            <h2 className='lead'>Most Popular in {category.name}</h2>
                            {listOfPopularLinks()}
                        </div>
                    </div>
                </InfiniteScroll>

            </Layout>
        </Fragment>
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
