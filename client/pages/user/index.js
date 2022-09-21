import Layout from '../../components/Layout';
import Link from 'next/link';
import moment from 'moment';
import withUser from '../withUser';
import Router from 'next/router';

const User = ({user, userLinks, token}) => {

    const confirmDelete = (e, id) => {
        e.preventDefault();
        let answer = window.confirm(`Are you sure you want to delete this link?`);
        if (answer) {
            handleDelete(id);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API}/link/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('LINK DELETE SUCCESS', response);
            Router.replace('/user');
        } catch (error) {
            console.log('LINK DELETE', error);
        }
    }

    const listOfLinks = () => userLinks.map((l, i) => (
        <div key={i} className='row alert alert-primary p-2'>
            <div className='col-md-8'>
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
                <span className='pull-right'>{moment(l.createdAt).fromNow()} by {l.postedBy.name}</span>
            </div>
            <div className='col-md-12'>
                <span className='badge text-dark'>
                    {l.type} {l.medium}
                </span>
                {l.categories.map((c, i) => (<span key={i} className="badge text-success">{c.name}</span>))}
                <span className='badge text-secondary'>
                    {l.clicks} clicks
                </span>
                <button onClick={(e) => confirmDelete(e, l._id)} className='btn btn-danger btn-sm float-right'>
                    Delete
                </button>
                <Link href={`/user/link/${l.slug}`}>
                    <button className='btn btn-success btn-sm float-right'>
                        Update
                    </button>
                </Link>
            </div>
        </div>
    ));

    return (
        <Layout>
            <h1>
                {user.name}'s Dashboard <span className='text-danger'>/{user.role}</span>
            </h1>
            <hr />
            <div className='row'>
                <div className='col-md-4'>
                    <ul className='nav flex-column'>
                        <li className='nav-item'>
                            <Link href="/user/link/create">
                                <a className='nav link'>Submit a Link</a>
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link href="/user/profile/update">
                                <a className='nav link'>Update Profile</a>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className='col-md-8'>
                    <h4>Your Links</h4>
                    {listOfLinks()}
                </div>
            </div>
        </Layout>
    );
};

export default withUser(User);
