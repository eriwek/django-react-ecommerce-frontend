import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import { getCurrencyFormat } from '../../../config';
import {
	updateCartProductQuantity,
	checkProductInCart,
} from '../../../services/cart';
import { auth } from '../../../auth';

const styles = (theme) =>
	createStyles({
		root: {
			maxWidth: 345,
		},
		media: {
			height: 140,
		},
	});

class ProductCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = { inCart: false, showAlert: false };
		this.addToCart = this.addToCart.bind(this);
	}

	async componentDidMount() {
		const { product } = this.props;
		this.setState({ inCart: await checkProductInCart(product.id) });
	}

	async addToCart() {
		const { product } = this.props;
		if (!(await auth.isLoggedIn())) {
			this.props.history.push({
				pathname: '/login',
				state: { from: `/products/${product.slug}` },
			});
			return;
		}
		await updateCartProductQuantity(product.id);
		this.setState({ showAlert: true, inCart: true });
	}

	render() {
		const { inCart } = this.state;
		const { classes, product } = this.props;

		return (
			<Card className={classes.root}>
				<CardActionArea onClick={this.props.onClick}>
					<CardMedia
						className={classes.media}
						image={product.image}
						title='Contemplative Reptile'
					/>
					<CardContent>
						<Typography gutterBottom variant='h5' component='h2'>
							{product.title}
						</Typography>
						<Typography variant='body1' color='textSecondary' component='p'>
							<span style={{ textDecoration: 'line-through' }}>
								{getCurrencyFormat(product.original_price)}
							</span>{' '}
							{getCurrencyFormat(product.price)}
						</Typography>
					</CardContent>
				</CardActionArea>
				<CardActions>
					<Button size='small' color='secondary' onClick={this.props.onClick}>
						View
					</Button>
					<Button
						size='small'
						color='primary'
						disabled={inCart}
						onClick={this.addToCart}
					>
						{inCart ? 'Added To Cart' : 'Add To Cart'}
					</Button>
				</CardActions>
			</Card>
		);
	}
}

export default withStyles(styles)(withRouter(ProductCard));
