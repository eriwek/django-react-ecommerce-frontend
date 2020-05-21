import { Axios as axios } from '../auth';
import { checkoutURL } from '../config';

export async function fetchCheckoutData(profile_id) {
	const url = `${checkoutURL}/?profile_id=${profile_id}`;
	return (await axios.get(url)).data;
}
