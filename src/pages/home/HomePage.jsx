import React from 'react';

export default class HomePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
		};
	}

	render() {
		return <div>Home Page</div>;
	}
}
