import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: { main: '#2196f3' },
		secondary: { main: '#ff3d00' },
		text: {
			danger: '#e91e63',
		},
	},
});

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<App />
	</MuiThemeProvider>,
	document.getElementById('root')
);

serviceWorker.register();
