import React from 'react';
import { TextField, Button, Container, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { auth } from '../../../auth';

export default class LoginPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
		this.formSumit = this.formSumit.bind(this);
	}

	async formSumit(event) {
		event.preventDefault();
		const { email, password } = this.state;
		await auth.login(email, password);
		let redirectURL = '/';
		if (this.props.location.state && this.props.location.state.from) {
			redirectURL = this.props.location.state.from.pathname;
		}
		this.props.history.push(redirectURL);
	}

	render() {
		return (
			<Container maxWidth='sm'>
				<Paper className='text-center' style={{ padding: '15px' }}>
					<Typography variant='h4' color='textPrimary'>
						Login
					</Typography>
					<form autoComplete='off' onSubmit={this.formSumit}>
						<TextField
							id='email-input'
							label='Email'
							fullWidth
							required
							onChange={(e) => this.setState({ email: e.target.value })}
						/>
						<TextField
							id='password-input'
							label='Password'
							type='password'
							fullWidth
							required
							onChange={(e) => this.setState({ password: e.target.value })}
						/>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							size='medium'
							className='submit-button'
						>
							Login
						</Button>
						<br />
					</form>
				</Paper>
			</Container>
		);
	}
}
