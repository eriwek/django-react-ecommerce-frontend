import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { theme } from '../../index';
import { Button } from '@material-ui/core';

const CheckoutForm = ({ secret }) => {
	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!stripe || !elements) return;

		// Get a reference to a mounted CardElement. Elements knows how
		// to find your CardElement because there can only ever be one of
		// each type of element.
		const card = elements.getElement(CardElement);

		// Use your card Element with other Stripe.js APIs
		const data = await stripe.confirmCardPayment(secret, {
			payment_method: { card },
		});

		console.log(data);
		const { error, paymentMethod } = data;

		if (error) console.log('[error]', error);
		else console.log('[PaymentMethod]', paymentMethod);
	};

	return (
		<form onSubmit={handleSubmit}>
			<CardElement
				options={{
					style: {
						base: {
							color: theme.palette.text.primary,
							fontSize: theme.typography.fontSize,
						},
					},
				}}
			/>
			<Button
				type='submit'
				variant='contained'
				color='primary'
				fullWidth
				disabled={!stripe}
				style={{ margin: '10px auto 0', display: 'block' }}
			>
				Pay
			</Button>
		</form>
	);
};

export default CheckoutForm;
