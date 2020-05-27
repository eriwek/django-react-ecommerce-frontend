import React from 'react';
import { Grid, Card, CardContent, Typography, Slider } from '@material-ui/core';
import ProductCard from '../card/ProductCard';
import { fetchProducts } from '../../../services/products';
import Skeleton from '@material-ui/lab/Skeleton';
import qs from 'qs';
import { getCurrencyFormat, Cash } from '../../../config';
import { withRouter } from 'react-router';

const marks = [
	{
		value: 0,
		label: `${Cash.symbol}0`,
	},
	{
		value: 10000,
		label: `${Cash.symbol}10000`,
	},
];

class ProductListPage extends React.Component {
	state = {
		products: [],
		loading: true,
		sort: null,
		keyword: null,
		price: [0, 10000],
	};

	updateProducts = async () => {
		const { sort, keyword, price } = this.state;
		const data = { min_price: price[0], max_price: price[1] };
		if (sort && sort !== 'None') data.sort = sort;
		if (keyword) data.keyword = keyword;
		const products = await fetchProducts(data);
		this.setState({ products, loading: false });
	};

	componentDidMount() {
		const changed = this.updateKeyword();
		if (!changed) {
			this.updateProducts();
		}
	}

	redirect = (url) => {
		this.props.history.push(url);
	};

	sortProducts = (e) => {
		const sort = e.target.value;
		this.setState({ sort }, async () => {
			await this.updateProducts();
		});
	};

	updateKeyword = async () => {
		const { keyword } = qs.parse(this.props.location.search.slice(1));
		console.log(keyword);
		if (keyword !== this.state.keyword) {
			this.setState({ keyword }, async () => {
				await this.updateProducts();
			});
			return true;
		}
		return false;
	};

	componentWillUpdate() {
		this.updateKeyword();
	}

	render() {
		// this.updateKeyword();
		const { products, loading, price } = this.state;

		return (
			<Grid container spacing={2}>
				<Grid item xs={12} md={3}>
					<Typography
						variant='h5'
						color='textPrimary'
						style={{ textDecoration: 'underline', marginBottom: '10px' }}
					>
						Filters
					</Typography>
					<div style={{ width: '90%' }}>
						<Typography id='range-slider' gutterBottom color='textPrimary'>
							Product Price range
						</Typography>
						<Slider
							value={price}
							onChange={(e, newValue) => {
								this.setState({ price: newValue });
							}}
							onChangeCommitted={this.updateProducts}
							min={0}
							max={10000}
							valueLabelDisplay='auto'
							aria-labelledby='range-getCurrencyFormater'
							getAriaValueText={getCurrencyFormat}
							marks={marks}
						/>
					</div>
				</Grid>
				<Grid item xs={12} md={9} container spacing={2}>
					<Grid item xs={12}>
						<div style={{ display: 'flex' }}>
							<div style={{ flex: '1 1 auto' }} />
							<Typography variant='body1' color='textPrimary'>
								Sort by:-
							</Typography>
							<select
								onChange={this.sortProducts}
								style={{ marginLeft: '5px' }}
							>
								<option value={null}>None</option>
								<option value={1}>Price Low To High</option>
								<option value={2}>Price High To Low</option>
							</select>
						</div>
					</Grid>
					{(loading ? Array.from(new Array(3)) : products).map((product, id) =>
						product ? (
							<Grid item sm={12} md={6} lg={4} xl={3} key={product.id}>
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
			</Grid>
		);
	}
}

export default withRouter(ProductListPage);
