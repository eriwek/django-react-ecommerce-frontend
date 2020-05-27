import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
	Typography,
	Box,
	AppBar,
	Grid,
	TextField,
	Button,
	FormControl,
	InputLabel,
	CircularProgress,
	NativeSelect,
} from '@material-ui/core';
import {
	fetchBillingProfiles,
	createBillingProfile,
} from '../../services/billing-profile';
import { fetchCountries } from '../../services/autocomplete';
import { withRouter } from 'react-router';

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={2}>{children}</Box>}
		</div>
	);
}

class ProfileCreateForm extends React.Component {
	state = {
		profile: {
			name: '',
			email: '',
			address_line_1: '',
			address_line_2: '',
			city: '',
			state: '',
			country: '',
			pincode: '',
		},
		countries: [],
	};

	async componentDidMount() {
		const countries = await fetchCountries();
		this.setState({ countries });
	}

	updateField = (data) => {
		this.setState({ profile: { ...this.state.profile, ...data } });
	};

	formSubmit = async (event) => {
		event.preventDefault();
		const { id } = await createBillingProfile(this.state.profile);
		this.props.selectBillingProfile(id);
	};

	render() {
		const { profile, countries } = this.state;
		return (
			<form onSubmit={this.formSubmit}>
				<Grid container spacing={1}>
					<Grid item sm={12} md={6}>
						<TextField
							id='name-input'
							label='Full Name'
							fullWidth
							required
							value={profile.name}
							onChange={(e) => this.updateField({ name: e.target.value })}
						/>
					</Grid>
					<Grid item sm={12} md={6}>
						<TextField
							id='email-input'
							label='Email'
							fullWidth
							required
							value={profile.email}
							onChange={(e) => this.updateField({ email: e.target.value })}
						/>
					</Grid>
					<Grid item sm={12}>
						<TextField
							id='address-1-input'
							label='Address Line 1'
							fullWidth
							required
							value={profile.address_line_1}
							onChange={(e) =>
								this.updateField({ address_line_1: e.target.value })
							}
						/>
					</Grid>
					<Grid item sm={12}>
						<TextField
							id='address-2-input'
							label='Address Line 2'
							fullWidth
							value={profile.address_line_2}
							onChange={(e) =>
								this.updateField({ address_line_2: e.target.value })
							}
						/>
					</Grid>
					<Grid item sm={12} md={6}>
						<TextField
							id='city-input'
							label='City'
							fullWidth
							required
							value={profile.city}
							onChange={(e) => this.updateField({ city: e.target.value })}
						/>
					</Grid>
					<Grid item sm={12} md={6}>
						<TextField
							id='state-input'
							label='State'
							fullWidth
							required
							value={profile.state}
							onChange={(e) => this.updateField({ state: e.target.value })}
						/>
					</Grid>
					<Grid item sm={12} md={6}>
						<FormControl fullWidth>
							<InputLabel htmlFor='country-select'>Country</InputLabel>
							<NativeSelect
								value={profile.country}
								inputProps={{
									id: 'country-select',
									name: 'country',
								}}
								onChange={(e) => this.updateField({ country: e.target.value })}
							>
								<option value=''></option>
								{countries.map((country) => (
									<option value={country[0]} key={country[0]}>
										{country[1]}
									</option>
								))}
							</NativeSelect>
						</FormControl>
					</Grid>
					<Grid item sm={12} md={6}>
						<TextField
							id='pincode-input'
							label='Pincode'
							fullWidth
							required
							value={profile.pincode}
							onChange={(e) => this.updateField({ pincode: e.target.value })}
						/>
					</Grid>
					<Grid item sm={12}>
						<Button variant='contained' type='submit' color='primary'>
							Create Billing Profile
						</Button>
					</Grid>
				</Grid>
			</form>
		);
	}
}

class ProfileSelector extends React.Component {
	state = {
		loading: true,
		value: 0,
		profiles: [],
	};

	componentDidMount() {
		this.updateBillingProfiles();
	}

	updateBillingProfiles = async () => {
		this.setState({ loading: true });
		const profiles = await fetchBillingProfiles();
		this.setState({ profiles, loading: false });
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	selectBillingProfile = (id) => {
		this.props.history.push(`/checkout/${id}`);
	};

	render() {
		const { value, profiles, loading } = this.state;
		return (
			<Paper style={{ padding: '15px 25px' }}>
				{loading ? (
					<CircularProgress />
				) : profiles.length === 0 ? (
					<ProfileCreateForm selectBillingProfile={this.selectBillingProfile} />
				) : (
					<React.Fragment>
						<Typography variant='h5'>Choose A Billing Profile</Typography>
						<Paper elevation={3} square style={{ margin: '10px 0' }}>
							<AppBar position='static' color='primary'>
								<Tabs
									value={value}
									indicatorColor='secondary'
									onChange={this.handleChange}
									aria-label='Select Profile'
								>
									<Tab label='Choose From Existing Profile' {...a11yProps(0)} />
									<Tab label='Create A New Billing Profile' {...a11yProps(1)} />
								</Tabs>
							</AppBar>
							<TabPanel value={value} index={0}>
								<Grid container spacing={3}>
									{profiles.map((profile) => (
										<Grid
											item
											sm={6}
											key={profile.id}
											style={{ cursor: 'pointer' }}
										>
											<Paper
												style={{ padding: '5px' }}
												square
												elevation={5}
												onClick={() => this.selectBillingProfile(profile.id)}
											>
												<Typography>{profile.name}</Typography>
												<Typography>{profile.email}</Typography>
												<Typography>{profile.address_line_1}</Typography>
												{profile.address_line_2 && (
													<Typography>{profile.address_line_1}</Typography>
												)}
												<Typography>
													{profile.city}, {profile.state}
												</Typography>
												<Typography>
													{profile.country} - {profile.pincode}
												</Typography>
											</Paper>
										</Grid>
									))}
								</Grid>
							</TabPanel>
							<TabPanel value={value} index={1}>
								<ProfileCreateForm
									selectBillingProfile={this.selectBillingProfile}
								/>
							</TabPanel>
						</Paper>
					</React.Fragment>
				)}
			</Paper>
		);
	}
}

export default withRouter(ProfileSelector);
