import { productsURL } from '../config';
import { Axios as axios } from '../auth';
import qs from 'qs';

export async function fetchProducts(data) {
	return (await axios.get(`${productsURL}/list?${qs.stringify(data)}`)).data;
}

export async function fetchProduct(slug) {
	return (await axios.get(`${productsURL}/list/${slug}`)).data;
}

export async function fetchRelatedProducts(id) {
	return (await axios.get(`${productsURL}/related/${id}`)).data;
}
