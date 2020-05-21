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
	Select,
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

class ProfileSelector extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			value: 0,
			profiles: [],
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
			cities: {
				options: [],
				getOptionLabel: (option) => option.city_name,
			},
			states: {
				options: [{ state_name: 'up' }],
				getOptionLabel: (option) => option.state_name,
			},
			countries: [],
		};
		this.handleChange = this.handleChange.bind(this);
		this.updateBillingProfiles = this.updateBillingProfiles.bind(this);
		this.updateField = this.updateField.bind(this);
		this.formSubmit = this.formSubmit.bind(this);
	}

	async componentDidMount() {
		this.updateBillingProfiles();
		const countries = await fetchCountries();
		this.setState({ countries });
	}

	async updateBillingProfiles() {
		this.setState({ loading: true });
		const profiles = await fetchBillingProfiles();
		this.setState({ profiles, loading: false });
	}

	handleChange(event, value) {
		this.setState({ value });
	}

	selectBillingProfile(id) {
		this.props.history.push(`/checkout/${id}`);
	}

	async formSubmit(event) {
		event.preventDefault();
		const { id } = await createBillingProfile(this.state.profile);
		this.selectBillingProfile(id);
	}

	updateField(data) {
		this.setState({ profile: { ...this.state.profile, ...data } });
	}

	render() {
		const { value, profiles } = this.state;
		return (
			<Paper style={{ padding: '15px 25px' }}>
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
						<form onSubmit={this.formSubmit}>
							<Grid container spacing={1}>
								<Grid item sm={12} md={6}>
									<TextField
										id='name-input'
										label='Full Name'
										fullWidth
										required
										value={this.state.profile.name}
										onChange={(e) => this.updateField({ name: e.target.value })}
									/>
								</Grid>
								<Grid item sm={12} md={6}>
									<TextField
										id='email-input'
										label='Email'
										fullWidth
										required
										value={this.state.profile.email}
										onChange={(e) =>
											this.updateField({ email: e.target.value })
										}
									/>
								</Grid>
								<Grid item sm={12}>
									<TextField
										id='address-1-input'
										label='Address Line 1'
										fullWidth
										required
										value={this.state.profile.address_line_1}
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
										value={this.state.profile.address_line_2}
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
										value={this.state.profile.city}
										onChange={(e) => this.updateField({ city: e.target.value })}
									/>
								</Grid>
								<Grid item sm={12} md={6}>
									<TextField
										id='state-input'
										label='State'
										fullWidth
										required
										value={this.state.profile.state}
										onChange={(e) =>
											this.updateField({ state: e.target.value })
										}
									/>
								</Grid>
								<Grid item sm={12} md={6}>
									<FormControl fullWidth>
										<InputLabel htmlFor='country-select'>Country</InputLabel>
										<Select
											native
											id='country-select'
											value={this.state.profile.country}
											onChange={(e) =>
												this.updateField({ country: e.target.value })
											}
										>
											{this.state.countries.map((country) => (
												<option value={country[0]} key={country[0]}>
													{country[1]}
												</option>
											))}
										</Select>
									</FormControl>
								</Grid>
								<Grid item sm={12} md={6}>
									<TextField
										id='pincode-input'
										label='Pincode'
										fullWidth
										required
										value={this.state.profile.pincode}
										onChange={(e) =>
											this.updateField({ pincode: e.target.value })
										}
									/>
								</Grid>
								<Grid item sm={12}>
									<Button variant='contained' type='submit' color='primary'>
										Create Billing Profile
									</Button>
								</Grid>
							</Grid>
						</form>
					</TabPanel>
				</Paper>
			</Paper>
		);
	}
}

export default withRouter(ProfileSelector);
