import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import { isAuth, logout } from '../helpers/auth';
import NProgress from 'nprogress';
import React from 'react';
import 'nprogress/nprogress.css';

// show progress bar when page is loading
Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Layout = ({ children }) => {

    const head = () => (
        //  append elements to the <head> element in document
        <React.Fragment>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
                integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
                crossOrigin="anonymous">
            </link>
            <link rel='stylesheet' href='/static/css/styles.css' />
        </React.Fragment>
    );

    const nav = () => (
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link href="/">
                    <a className="nav-link text-white">
                        Home
                    </a>
                </Link>
            </li>

            <li className="nav-item mr-auto">
                <Link href="/user/link/create">
                    <a className="nav-link text-white btn btn-success" style={{borderRadius: '0px'}}>
                        Submit a Link
                    </a>
                </Link>
            </li>
            {
                !isAuth() && (
                    <React.Fragment>
                        <li className="nav-item">
                            <Link href="/login">
                                <a className="nav-link text-white">
                                    Login
                                </a>
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link href="/register">
                                <a className="nav-link text-white">
                                    Register
                                </a>
                            </Link>
                        </li>
                    </React.Fragment>
                )
            }
            {
                isAuth() && isAuth().role === 'admin' && (
                    <li className="nav-item ml-auto">
                        <Link href="/admin">
                            <a className="nav-link text-white">
                                {isAuth().name}
                            </a>
                        </Link>
                    </li>
                )
            }
            {
                isAuth() && isAuth().role === 'subscriber' && (
                    <li className="nav-item ml-auto">
                        <Link href="/user">
                            <a className="nav-link text-white">
                                {isAuth().name}
                            </a>
                        </Link>
                    </li>
                )
            }
            {
                isAuth() && (
                    <li className="nav-item">
                        <a onClick={logout} className="nav-link text-white">
                            Logout
                        </a>
                    </li>
                )
            }
        </ul>
    );

    return <React.Fragment>
        {head()} {nav()} <div className='container pt-5 pb-5'>{children}</div>
    </React.Fragment>;
};

export default Layout;