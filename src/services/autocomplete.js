import axios from 'axios';
import { billingProfilesURL } from '../config';

export async function fetchCountries() {
	const url = `${billingProfilesURL}/countries/`;
	return (await axios.get(url)).data;
}
