import { accountsURL } from './config';
import axios from 'axios';

import JWTDecode from 'jwt-decode';

function timeFromSeconds(secondString) {
	const seconds = parseInt(secondString);
	return new Date(seconds * 1000);
}

class Authentication {
	constructor() {
		this.access = '';
		this.refresh = '';
		this.accessExp = new Date(0);
		this.refreshExp = new Date(0);
		this.updateRefresh(localStorage.getItem('refresh'));
	}

	login = async (email, password) => {
		const { access, refresh } = (
			await axios.post(`${accountsURL}/login/`, { email, password })
		).data;
		this.updateRefresh(refresh);
		this.updateAccess(access);
	};

	register = async (user) => {
		const url = `${accountsURL}/register/`;
		await axios.post(url, user);
		await this.login(user.email, user.password);
	};

	refreshAccessToken = async (refresh) => {
		const url = `${accountsURL}/login/refresh/`;
		const { access } = (await axios.post(url, { refresh })).data;
		this.updateAccess(access);
		return access;
	};

	updateRefresh = (refresh) => {
		this.refresh = '';
		this.refreshExp = new Date(0);
		if (refresh) {
			const refreshExp = timeFromSeconds(JWTDecode(refresh).exp);
			if (refreshExp > new Date()) {
				this.refresh = refresh;
				this.refreshExp = refreshExp;
				localStorage.setItem('refresh', refresh);
				localStorage.setItem('refresh_exp', JWTDecode(refresh).exp);
				return true;
			}
		}
		localStorage.removeItem('refresh');
		localStorage.removeItem('refresh_exp');
		return false;
	};

	updateAccess = (access) => {
		this.access = '';
		this.accessExp = new Date(0);
		if (!access) return false;
		const accessExp = timeFromSeconds(JWTDecode(access).exp);
		if (accessExp > new Date()) {
			this.access = access;
			this.accessExp = accessExp;
			axios.defaults.headers.Authorization = `Bearer ${access}`;
			return true;
		}
		return false;
	};

	getAccessToken = async () => {
		if (this.accessExp > new Date()) return this.access;
		if (this.refreshExp > new Date())
			return await this.refreshAccessToken(this.refresh);
		return null;
	};

	isLoggedIn = async () => {
		return (await this.getAccessToken()) != null;
	};

	logout = () => {
		this.access = '';
		this.accessExp = new Date(0);
		this.refresh = '';
		this.refreshExp = new Date(0);
		localStorage.removeItem('refresh');
		localStorage.removeItem('refresh_exp');
		delete axios.defaults.headers.Authorization;
	};
}

export const auth = new Authentication();
export const Axios = axios;
