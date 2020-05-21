import React from 'react';
import Typography from '@material-ui/core/Typography';
import { TextField, Button, Grid, Container, Paper } from '@material-ui/core';
import { auth } from '../../../auth';

export default class RegisterPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fullname: '',
			email: '',
			phone: '',
			password: '',
			confirmPassword: '',
		};
		this.formSubmit = this.formSubmit.bind(this);
	}

	async formSubmit(event) {
		event.preventDefault();
		const { fullname, email, phone, password } = this.state;
		await auth.register({ fullname, email, phone, password });
		this.props.history.push('/');
	}

	render() {
		return (
			<Container maxWidth='sm'>
				<Paper style={{ padding: '15px' }} className='text-center'>
					<Typography variant='h4' color='textPrimary'>
						Register
					</Typography>
					<form noValidate autoComplete='off' onSubmit={this.formSubmit}>
						<div className=''>
							<TextField
								id='name-input'
								label='Full Name'
								fullWidth
								required
								onChange={(e) => this.setState({ fullname: e.target.value })}
							/>
							<TextField
								id='email-input'
								label='Email'
								fullWidth
								required
								onChange={(e) => this.setState({ email: e.target.value })}
							/>
							<TextField
								id='phone-input'
								label='Phone'
								fullWidth
								required
								onChange={(e) => this.setState({ phone: e.target.value })}
							/>
						</div>
						<Grid container>
							<Grid item sm={6}>
								<TextField
									id='password-input'
									label='Password'
									type='password'
									required
									style={{ width: 'calc(100% - 10px)', margin: '0 10px 0 0' }}
									onChange={(e) => this.setState({ password: e.target.value })}
								/>
							</Grid>
							<Grid item sm={6}>
								<TextField
									id='confirm-password-input'
									label='Confirm Password'
									type='password'
									fullWidth
									required
									onChange={(e) =>
										this.setState({ confirmPassword: e.target.value })
									}
								/>
							</Grid>
						</Grid>
						<Button
							type='submit'
							variant='contained'
							color='primary'
							size='medium'
							className='submit-button'
						>
							Register
						</Button>
						<br />
					</form>
				</Paper>
			</Container>
		);
	}
}
