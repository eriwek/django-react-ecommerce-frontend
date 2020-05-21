import { Axios as axios } from '../auth';
import { cartURL } from '../config';

export async function fetchCart() {
	return (await axios.get(`${cartURL}/`)).data;
}

export async function updateCartProductQuantity(id, quantity) {
	return (await axios.post(`${cartURL}/`, { id, quantity })).data;
}

export async function removeProductFromCart(id) {
	return updateCartProductQuantity(id, 0);
}

export async function checkProductInCart(id) {
	if (!axios.defaults.headers.Authorization) {
		return false;
	}
	const url = `${cartURL}/${id}`;
	return (await axios.get(url)).data;
}
