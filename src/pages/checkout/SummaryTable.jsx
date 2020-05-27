import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { getCurrencyFormat } from '../../config';

const TAX_RATE = 0.07;

const styles = makeStyles({
	table: {
		minWidth: 700,
	},
});

class SummaryTable extends React.Component {
	constructor(props) {
		super(props);
		const { order } = props;
		const subTotal = parseFloat(order.cart.total);
		const tax = TAX_RATE * parseFloat(order.cart.total);
		const shippingCost = parseFloat(order.shipping_total);
		const total = subTotal + tax + shippingCost;
		this.state = {
			products: order.cart.products.map((item) => ({
				id: item.id,
				qty: item.quantity,
				total: item.quantity * item.product.price,
				unit: parseFloat(item.product.price),
				title: item.product.title,
			})),
			subTotal,
			shippingCost,
			tax,
			total,
		};
	}
	render() {
		const { classes } = this.props;
		const { products, subTotal, shippingCost, tax, total } = this.state;

		return (
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label='spanning table'>
					<TableHead>
						<TableRow>
							<TableCell align='center' colSpan={4}>
								Order Summary
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Desc</TableCell>
							<TableCell align='right'>Qty.</TableCell>
							<TableCell align='right'>Unit</TableCell>
							<TableCell align='right'>Price</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{products.map((product) => (
							<TableRow key={product.id}>
								<TableCell>{product.title}</TableCell>
								<TableCell align='right'>{product.qty}</TableCell>
								<TableCell align='right'>
									{getCurrencyFormat(product.unit)}
								</TableCell>
								<TableCell align='right'>
									{getCurrencyFormat(product.total)}
								</TableCell>
							</TableRow>
						))}

						<TableRow>
							<TableCell rowSpan={4} />
							<TableCell colSpan={2}>Subtotal</TableCell>
							<TableCell align='right'>{getCurrencyFormat(subTotal)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Tax</TableCell>
							<TableCell align='right'>{`${(TAX_RATE * 100).toFixed(
								0
							)} %`}</TableCell>
							<TableCell align='right'>{getCurrencyFormat(tax)}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={2}>Shipping Cost</TableCell>
							<TableCell align='right'>
								{getCurrencyFormat(shippingCost)}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={2}>Total</TableCell>
							<TableCell align='right'>{getCurrencyFormat(total)}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		);
	}
}

export default withStyles(styles)(SummaryTable);
