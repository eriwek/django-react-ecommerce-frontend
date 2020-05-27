import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import CartPage from './pages/cart/CartPage';
import LoginPage from './pages/authorization/login/LoginPage';
import RegisterPage from './pages/authorization/register/RegisterPage';
import ProductListPage from './pages/product/list/ProductList';
import ProductDetailPage from './pages/product/detail/ProductDetail';
import CheckoutPage from './pages/checkout/CheckoutPage';
import ProfileSelector from './pages/checkout/ProfileSelector';
import {
	Container,
	withStyles,
	createStyles,
	CircularProgress,
} from '@material-ui/core';
import ProtectedRoute from './components/ProtectedRoute';
import { auth } from './auth';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
const styles = (theme) =>
	createStyles({
		root: {
			backgroundColor: theme.palette.background.default,
			minHeight: '100vh',
		},
		loaderContainer: {
			verticalAlign: 'middle',
			height: '100vh',
			width: '100vw',
			display: 'table-cell',
			textAlign: 'center',
		},
	});

class App extends React.Component {
	state = {
		loading: true,
	};

	async componentDidMount() {
		await auth.getAccessToken();
		this.setState({ loading: false });
	}

	render() {
		const { classes } = this.props;
		const { loading } = this.state;

		return loading ? (
			<div className={classes.loaderContainer}>
				<CircularProgress color='secondary' />
				<div>Loading...</div>
			</div>
		) : (
			<Router history={history}>
				<div className={`App ${classes.root}`}>
					<Navbar />
					<Container className='container'>
						<Switch>
							<Route path='/' exact component={ProductListPage} />
							<Route
								path='/products/:slug'
								exact
								component={ProductDetailPage}
							/>
							<ProtectedRoute path='/cart' exact component={CartPage} />
							<ProtectedRoute
								path='/checkout'
								exact
								component={ProfileSelector}
							/>
							<ProtectedRoute
								path='/checkout/:profileId'
								exact
								component={CheckoutPage}
							/>
							<Route
								path='/login'
								exact
								render={(props) => {
									if (auth.refreshExp < new Date())
										return <LoginPage {...props} />;
									else return <Redirect to='/' />;
								}}
							/>
							<Route path='/register' exact component={RegisterPage} />
						</Switch>
					</Container>
				</div>
			</Router>
		);
	}
}

export default withStyles(styles)(App);
