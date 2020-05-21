import React from 'react';
import {
	fetchCart,
	updateCartProductQuantity,
	removeProductFromCart,
} from '../../services/cart';
import MaterialTable from 'material-table';
import { Button, Paper, Typography } from '@material-ui/core';
import { Link, withRouter } from 'react-router-dom';
import { Cash } from '../../config';

class CartPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{ title: 'Name', field: 'title', editable: 'never' },
				{ title: 'Quantity', field: 'quantity', type: 'numeric' },
				{
					title: 'Unit Cost',
					field: 'price',
					type: 'numeric',
					editable: 'never',
				},
				{ title: 'Total', field: 'total', type: 'numeric', editable: 'never' },
			],
			data: [],
			loading: true,
			total: 0,
		};
		this.updateProductQuantity = this.updateProductQuantity.bind(this);
		this.deleteProduct = this.deleteProduct.bind(this);
		this.updateCart = this.updateCart.bind(this);
	}

	async componentDidMount() {
		this.setState({ loading: true });
		const data = await fetchCart();
		this.updateCart(data);
	}

	updateCart(cart) {
		this.setState({
			data: cart.products.map((cartItem) => {
				const { quantity, product } = cartItem;
				const { id, title, price, slug } = product;
				const total = price * quantity;
				return {
					id,
					title,
					quantity,
					price: `${Cash.symbol}${price * 1}`,
					total: `${Cash.symbol}${total}`,
					slug,
				};
			}),
			total: cart.total,
			loading: false,
		});
	}

	async updateProductQuantity(newData, oldData) {
		const { id, quantity } = newData;
		this.setState({ loading: true });
		const cart = await updateCartProductQuantity(id, quantity);
		this.updateCart(cart);
	}

	async deleteProduct(oldData) {
		const { id } = oldData;
		this.setState({ loading: true });
		const cart = await removeProductFromCart(id);
		this.updateCart(cart);
	}

	render() {
		const { columns, data, loading, total } = this.state;
		return (
			<React.Fragment>
				<MaterialTable
					title='Cart'
					columns={columns}
					data={data}
					editable={{
						onRowUpdate: this.updateProductQuantity,
						onRowDelete: this.deleteProduct,
					}}
					options={{
						emptyRowsWhenPaging: false,
						exportButton: true,
					}}
					isLoading={loading}
					onRowClick={(_e, product) =>
						this.props.history.push(`/products/${product.slug}`)
					}
				/>
				{data.length !== 0 && (
					<Paper className='text-right' style={{ padding: '15px 30px' }}>
						<Typography variant='h5' style={{ padding: '0 0 5px 0' }}>
							Total: {Cash.symbol}
							{total}
						</Typography>
						<Button
							variant='contained'
							color='secondary'
							component={Link}
							to='/checkout'
						>
							Checkout
						</Button>
					</Paper>
				)}
			</React.Fragment>
		);
	}
}

export default withRouter(CartPage);
