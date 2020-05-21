import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { auth } from '../auth';

class ProtectedRouteComponent extends React.Component {
	state = {
		isLoggedIn: auth.refreshExp > new Date(),
	};

	render() {
		const { location, component: Component } = this.props;
		return this.state.isLoggedIn ? (
			<Component />
		) : (
			<Redirect
				to={{
					pathname: '/login',
					state: { from: location },
				}}
			/>
		);
	}
}

export default ({ component, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => (
				<ProtectedRouteComponent component={component} {...props} />
			)}
		/>
	);
};
