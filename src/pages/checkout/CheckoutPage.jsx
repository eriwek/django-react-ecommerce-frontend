import React from 'react';
import {
	Paper,
	CircularProgress,
	Container,
	Typography,
} from '@material-ui/core';
import SummaryTable from './SummaryTable';
import { fetchCheckoutData } from '../../services/checkout';
import { withRouter } from 'react-router';
import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_rZETqG9LSOjvfVW1EopCwKV7');

class CheckoutPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			profileId: props.match.params.profileId,
			order: null,
			loading: true,
			secret: '',
		};
	}

	async componentDidMount() {
		const { order, secret } = await fetchCheckoutData(this.state.profileId);
		this.setState({ order, loading: false, secret });
	}

	render() {
		const { order, loading, secret } = this.state;
		return (
			<React.Fragment>
				{loading ? (
					<Paper style={{ padding: '15px 30px' }}>
						<CircularProgress />
					</Paper>
				) : (
					<Paper>
						<SummaryTable order={order} />
						<Container
							className='text-center'
							maxWidth='xs'
							style={{ padding: '20px' }}
						>
							<Typography variant='h6' style={{ padding: '0 0 10px' }}>
								Checkout With Card
							</Typography>

							<Elements stripe={stripePromise}>
								<CheckoutForm secret={secret} />
							</Elements>
						</Container>
					</Paper>
				)}
			</React.Fragment>
		);
	}
}

export default withRouter(CheckoutPage);
