import { Axios as axios } from '../auth';
import { billingProfilesURL } from '../config';

export async function fetchBillingProfiles() {
	const url = `${billingProfilesURL}/`;
	return (await axios.get(url)).data;
}

export async function createBillingProfile(profile) {
	const url = `${billingProfilesURL}/`;
	return (await axios.post(url, profile)).data;
}
