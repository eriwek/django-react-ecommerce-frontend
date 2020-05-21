import React from 'react';
import { fetchProduct, fetchRelatedProducts } from '../../../services/products';
import {
	Grid,
	Typography,
	Button,
	Snackbar,
	Paper,
	createStyles,
	withStyles,
} from '@material-ui/core';
import ProductCard from '../card/ProductCard';
import {
	updateCartProductQuantity,
	checkProductInCart,
} from '../../../services/cart';
import { Alert, Skeleton } from '@material-ui/lab';
import { auth } from '../../../auth';
import { Cash } from '../../../config';

const styles = (theme) =>
	createStyles({
		text: {
			color: theme.palette.text.primary,
		},
	});

class ProductDetailPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			product: null,
			loading: true,
			relatedProducts: [],
			inCart: false,
		};
		this.loadProduct = this.loadProduct.bind(this);
		this.addProductToCart = this.addProductToCart.bind(this);
		this.checkout = this.checkout.bind(this);
	}

	async componentDidMount() {
		const { slug } = this.props.match.params;
		await this.loadProduct(slug);
	}

	async loadProduct(slug) {
		this.setState({ loading: true, product: null });
		const product = await fetchProduct(slug);
		const relatedProducts = await fetchRelatedProducts(product.id);
		const inCart = await checkProductInCart(product.id);
		this.setState({ product, relatedProducts, inCart, loading: false });
	}

	async addProductToCart() {
		if (!(await auth.isLoggedIn())) {
			this.props.history.push({
				pathname: '/login',
				state: { from: this.props.location },
			});
			return;
		}
		await updateCartProductQuantity(this.state.product.id);
		this.setState({ showAlert: true, inCart: true });
	}

	async checkout() {
		if (!(await auth.isLoggedIn())) {
			this.props.history.push({
				pathname: '/login',
				state: { from: this.props.location },
			});
			return;
		}
		if (!this.state.inCart) {
			await this.addProductToCart();
		}
		this.props.history.push('/checkout');
	}

	render() {
		const { product, showAlert, inCart, loading } = this.state;
		return (
			<Paper style={{ padding: '20px' }}>
				{!loading ? (
					<React.Fragment>
						<Snackbar
							open={showAlert}
							autoHideDuration={3000}
							onClose={() => this.setState({ showAlert: false })}
						>
							<Alert
								variant='filled'
								severity='success'
								onClose={() => this.setState({ showAlert: false })}
							>
								Product Added To Cart
							</Alert>
						</Snackbar>
						<Grid container spacing={2}>
							<Grid item sm={4}>
								<img
									src={product.image}
									className='product-image'
									alt={product.title}
								/>
							</Grid>
							<Grid item sm={8}>
								<Typography color='textPrimary' variant='h4'>
									{product.title}
								</Typography>
								<Typography color='textPrimary' variant='h6'>
									<span
										style={{ textDecoration: 'line-through', color: '#aaa' }}
									>
										{Cash.symbol}
										{product.original_price}
									</span>{' '}
									{Cash.symbol}
									{product.price}
								</Typography>
								<div className='action-panel'>
									<Button
										variant='contained'
										color='primary'
										id='add-to-cart-button'
										onClick={this.addProductToCart}
										disabled={inCart}
									>
										{inCart ? 'Added To Cart' : 'Add To Cart'}
									</Button>
									<Button
										variant='contained'
										color='secondary'
										id='checkout-button'
										onClick={this.checkout}
									>
										Checkout
									</Button>
								</div>
							</Grid>
							<Grid item sm={12}>
								<div
									className={this.props.classes.text}
									style={{ fontSize: '1.1rem' }}
									dangerouslySetInnerHTML={{ __html: product.description }}
								></div>
							</Grid>
							{this.state.relatedProducts.length !== 0 && (
								<Grid item container sm={12} spacing={2}>
									<Grid item sm={12}>
										<Typography
											variant='h4'
											color='textPrimary'
											style={{
												borderBottom: 'solid 1px #fff',
												display: 'inline-block',
											}}
										>
											Related Product
										</Typography>
									</Grid>
									{this.state.relatedProducts.map((product) => (
										<Grid item sm={4} key={product.id}>
											<ProductCard
												product={product}
												onClick={() => {
													this.loadProduct(product.slug);
													this.props.history.push(`/products/${product.slug}`);
												}}
											/>
										</Grid>
									))}
								</Grid>
							)}
						</Grid>
					</React.Fragment>
				) : (
					<React.Fragment>
						<Grid container spacing={2}>
							<Grid item sm={4}>
								<Skeleton
									variant='rect'
									animation='wave'
									style={{ height: '190px' }}
								/>
							</Grid>
							<Grid item sm={8}>
								<Grid container>
									<Grid container>
										<Grid item sm={5}>
											<Skeleton animation='wave' height={60} />
										</Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item sm={4}>
											<Skeleton animation='wave' height={40} />
										</Grid>
										<Grid item sm={4}>
											<Skeleton animation='wave' height={40} />
										</Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item sm={4}>
											<Skeleton animation='wave' height={40} />
										</Grid>
										<Grid item sm={4}>
											<Skeleton animation='wave' height={40} />
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							<Grid item sm={12}>
								<Skeleton
									animation='wave'
									height={50}
									style={{ marginBottom: 1, width: '300px' }}
								/>
								<Skeleton animation='wave' height={20} />
								<Skeleton animation='wave' height={20} />
								<Skeleton animation='wave' height={20} />
								<Skeleton animation='wave' height={20} />
								<Skeleton animation='wave' height={20} />
							</Grid>
						</Grid>
					</React.Fragment>
				)}
			</Paper>
		);
	}
}

export default withStyles(styles)(ProductDetailPage);
