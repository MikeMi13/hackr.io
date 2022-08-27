import Head from 'next/head';
import Link from 'next/link';

const Layout = ({ children }) => {

    const head = () => (
        //  append elements to the <head> element in document
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
            integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
            crossOrigin="anonymous">
        </link>
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