import Head from 'next/head';
import Link from 'next/link';
import Router from 'next/router';
import NProgress from 'nprogress';
import React from 'react';

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
                crossorigin="anonymous">
            </link>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css"
                integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ=="
                crossorigin="anonymous"
                referrerpolicy="no-referrer"
            />
        </React.Fragment>
    );

    const nav = () => (
        <ul className="nav nav-tabs bg-success">
            <li className="nav-item">
                <Link href="/">
                    <a className="nav-link text-white">
                        Home
                    </a>
                </Link>
            </li>
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
        </ul>
    );

    return <React.Fragment>
        {head()} {nav()} <div className='container pt-5 pb-5'>{children}</div>
    </React.Fragment>;
};

export default Layout;