import React from 'react';
import { Grid, Card, CardContent } from '@material-ui/core';
import ProductCard from '../card/ProductCard';
import { fetchProducts } from '../../../services/products';
import Skeleton from '@material-ui/lab/Skeleton';

export default class ProductListPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			loading: true,
		};
		this.redirect = this.redirect.bind(this);
	}

	async componentDidMount() {
		const products = await fetchProducts();
		this.setState({ products, loading: false });
	}

	redirect(url) {
		this.props.history.push(url);
	}

	render() {
		const { products, loading } = this.state;
		return (
			<Grid container spacing={2}>
				{(loading ? Array.from(new Array(3)) : products).map((product, id) =>
					product ? (
						<Grid item sm={4} key={product.id}>
							<ProductCard
								product={product}
								onClick={() => this.redirect(`/products/${product.slug}`)}
							/>
						</Grid>
					) : (
						<Grid item sm={4} key={id} style={{ width: '100%' }}>
							<Card>
								<Skeleton
									animation='wave'
									variant='rect'
									style={{ height: '190px' }}
								/>
								<CardContent>
									<React.Fragment>
										<Skeleton
											animation='wave'
											height={10}
											style={{ marginBottom: 6 }}
										/>
										<Skeleton
											animation='wave'
											height={10}
											style={{ marginBottom: 6 }}
										/>
										<Skeleton
											animation='wave'
											height={10}
											width='80%'
											style={{ marginBottom: 10 }}
										/>
										<Grid container spacing={2}>
											<Grid item sm={3}>
												<Skeleton animation='wave' height={10} width='100%' />
												<Skeleton animation='wave' height={10} width='100%' />
											</Grid>
											<Grid item sm={3}>
												<Skeleton animation='wave' height={10} width='100%' />
												<Skeleton animation='wave' height={10} width='100%' />
											</Grid>
										</Grid>
									</React.Fragment>
								</CardContent>
							</Card>
						</Grid>
					)
				)}
			</Grid>
		);
	}
}
