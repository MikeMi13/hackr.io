import Layout from '../../components/Layout';
import withUser from '../withUser';

const User = ({user, userLinks}) => <Layout>{JSON.stringify(userLinks)}</Layout>;

export default withUser(User);
