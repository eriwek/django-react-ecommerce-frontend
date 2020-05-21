import { productsURL } from '../config';
import { Axios as axios } from '../auth';

export async function fetchProducts() {
	return (await axios.get(`${productsURL}/list`)).data;
}

export async function fetchProduct(slug) {
	return (await axios.get(`${productsURL}/list/${slug}`)).data;
}

export async function fetchRelatedProducts(id) {
	return (await axios.get(`${productsURL}/related/${id}`)).data;
}
