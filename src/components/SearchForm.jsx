import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import PlayIcon from '@material-ui/icons/PlayArrow';
import { withRouter } from 'react-router';
import qs from 'qs';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 400,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
}));

const SearchForm = ({ history, location }) => {
	const params = qs.parse(location.search.slice(1));
	const [value, setValue] = React.useState(params.keyword || '');
	const classes = useStyles();

	const formSubmit = (e) => {
		e.preventDefault();
		const queryString = qs.stringify({ ...params, keyword: value });
		history.push(`/?${queryString}`);
		setTimeout(() => history.push(`/?${queryString}`), 50);
	};

	return (
		<Paper className={classes.root} component='form' onSubmit={formSubmit}>
			<IconButton className={classes.iconButton}>
				<SearchIcon />
			</IconButton>
			<Divider className={classes.divider} orientation='vertical' />
			<InputBase
				className={classes.input}
				placeholder='Search Hobby Duino'
				inputProps={{ 'aria-label': 'search google maps' }}
				onChange={(e) => setValue(e.target.value)}
				value={value}
			/>
			<IconButton
				type='submit'
				className={classes.iconButton}
				aria-label='search'
			>
				<PlayIcon />
			</IconButton>
		</Paper>
	);
};

export default withRouter(SearchForm);
