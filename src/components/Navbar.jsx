import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { fade, withStyles, createStyles } from '@material-ui/core/styles';
import { Menu, MenuItem, Badge, Button } from '@material-ui/core';
import {
	AccountCircle,
	MoreVert as MoreIcon,
	ShoppingBasket as CartIcon,
	Notifications as NotificationsIcon,
	Mail as MailIcon,
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { auth } from '../auth';
import logo from '../dark-icon.png';
import SearchForm from './SearchForm';

const styles = (theme) =>
	createStyles({
		grow: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			display: 'none',
			cursor: 'pointer',
			textDecoration: 'None',
			[theme.breakpoints.up('sm')]: {
				display: 'block',
			},
		},
		search: {
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
			backgroundColor: fade(theme.palette.common.white, 0.15),
			'&:hover': {
				backgroundColor: fade(theme.palette.common.white, 0.25),
			},
			marginRight: theme.spacing(2),
			marginLeft: 0,
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				marginLeft: theme.spacing(3),
				width: 'auto',
			},
		},
		searchIcon: {
			padding: theme.spacing(0, 2),
			height: '100%',
			position: 'absolute',
			pointerEvents: 'none',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		inputRoot: {
			color: 'inherit',
		},
		inputInput: {
			padding: theme.spacing(1, 1, 1, 0),
			paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
			transition: theme.transitions.create('width'),
			width: '100%',
			[theme.breakpoints.up('md')]: {
				width: '20ch',
			},
		},
		sectionDesktop: {
			display: 'none',
			[theme.breakpoints.up('md')]: {
				display: 'flex',
			},
		},
		sectionMobile: {
			display: 'flex',
			[theme.breakpoints.up('md')]: {
				display: 'none',
			},
		},
	});

class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			anchorEl: null,
			mobileMoreAnchorEl: null,
			isLoggedIn: false,
		};
		this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
		this.handleMenuClose = this.handleMenuClose.bind(this);
		this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
		this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
		this.updateLoginStatus = this.updateLoginStatus.bind(this);
	}

	componentDidMount() {
		this.updateLoginStatus();
		setInterval(this.updateLoginStatus, 2000);
	}

	async updateLoginStatus() {
		this.setState({ isLoggedIn: await auth.isLoggedIn() });
	}

	handleProfileMenuOpen(event) {
		this.setState({ anchorEl: event.currentTarget });
	}

	handleMobileMenuClose() {
		this.setState({ mobileMoreAnchorEl: null });
	}

	handleMenuClose() {
		this.setState({ anchorEl: null });
		this.handleMobileMenuClose();
	}

	handleMobileMenuOpen(event) {
		this.setState({ mobileMoreAnchorEl: event.currentTarget });
	}

	render() {
		const { classes } = this.props;
		const { anchorEl, mobileMoreAnchorEl, isLoggedIn } = this.state;

		const isMenuOpen = Boolean(anchorEl);
		const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

		const userMenuID = 'primary-search-account-menu';
		const userMenu = (
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				id={userMenuID}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClose={this.handleMenuClose}
			>
				<MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
				<MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
				<MenuItem
					onClick={() => {
						auth.logout();
						this.handleMenuClose();
					}}
				>
					Logout
				</MenuItem>
			</Menu>
		);

		const mobileMenuId = 'primary-search-account-menu-mobile';
		const renderMobileMenu = (
			<Menu
				anchorEl={mobileMoreAnchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				id={mobileMenuId}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMobileMenuOpen}
				onClose={this.handleMobileMenuClose}
			>
				<MenuItem>
					<IconButton aria-label='show 4 new mails' color='inherit'>
						<Badge badgeContent={4} color='secondary'>
							<MailIcon />
						</Badge>
					</IconButton>
					<p>Messages</p>
				</MenuItem>
				<MenuItem>
					<IconButton aria-label='show 11 new notifications' color='inherit'>
						<Badge badgeContent={11} color='secondary'>
							<NotificationsIcon />
						</Badge>
					</IconButton>
					<p>Notifications</p>
				</MenuItem>
				<MenuItem onClick={this.handleProfileMenuOpen}>
					<IconButton
						aria-label='account of current user'
						aria-controls='primary-search-account-menu'
						aria-haspopup='true'
						color='inherit'
					>
						<AccountCircle />
					</IconButton>
					<p>Profile</p>
				</MenuItem>
			</Menu>
		);

		return (
			<div className={classes.grow}>
				<AppBar color='primary' position='fixed'>
					<Toolbar>
						<Link to='/' className={classes.title}>
							<img src={logo} style={{ height: '60px' }} alt='' />
						</Link>
						<SearchForm />

						<div className={classes.grow} />
						<div className={classes.sectionDesktop}>
							<Button
								color='inherit'
								component={Link}
								to='/cart'
								startIcon={
									<Badge badgeContent={4} color='secondary'>
										<CartIcon />
									</Badge>
								}
							>
								Cart
							</Button>
							{!isLoggedIn ? (
								<span>
									<Button
										component={Link}
										to='/login'
										color='inherit'
										startIcon={<AccountCircle />}
									>
										Login
									</Button>
									<Button
										component={Link}
										to='/register'
										color='inherit'
										startIcon={<AccountCircle />}
									>
										Register
									</Button>
								</span>
							) : (
								<Button
									color='inherit'
									aria-controls={userMenuID}
									startIcon={<AccountCircle />}
									onClick={this.handleProfileMenuOpen}
								>
									Account
								</Button>
							)}
						</div>
						<div className={classes.sectionMobile}>
							<IconButton
								aria-label='show more'
								aria-controls={mobileMenuId}
								aria-haspopup='true'
								onClick={this.handleMobileMenuOpen}
								color='inherit'
							>
								<MoreIcon />
							</IconButton>
						</div>
					</Toolbar>
				</AppBar>
				<Toolbar />

				{renderMobileMenu}
				{userMenu}
			</div>
		);
	}
}

export default withStyles(styles)(Navbar);
