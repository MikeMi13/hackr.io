import axios from 'axios';
import {API} from '../config';
import { getCookie } from '../helpers/auth';

const withAdmin = (Page) => {
    const withAdminUser = (props) => <Page {...props} />;
    withAdminUser.getInitialProps = async (context) => {
        const token = getCookie('token', context.req);
        let user = null;
        let userLinks = [];
        
        if (token) {
            try {
                const response = await axios.get(`${API}/admin`, {
                    headers: {
                        authorization: `Bearer ${token}`,
                        contentType: 'application/json'
                    }
                });
                user = response.data.user;
                userLinks = response.data.links;
            } catch (err) {
                if (err.response.status === 401) {
                    user = null;
                    userLinks = [];
                }
            }
        }

        if (user === null) {
            // redirect to home page
            context.res.writeHead(302, {
                Location: '/'
            });
            context.res.end();
        } else {
            return {
                // Not all pages use getInitialProps.
                // If a page is using getInitialProps, then wait for that to resolve (fetching data etc) and return.
                // Otherwise just return without waiting for getInitialProps.
                ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
                user,
                userLinks,
                token
            };
        }
    };
    return withAdminUser;
};

export default withAdmin;
