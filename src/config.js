export const serverURL =
	process.env.NODE_ENV === 'production'
		? 'https://ecommerce.pythonanywhere.com'
		: 'http://localhost:8000';
export const endpoint = `${serverURL}/api`;
export const accountsURL = `${endpoint}/accounts`;
export const productsURL = `${endpoint}/products`;
export const cartURL = `${endpoint}/cart`;
export const billingProfilesURL = `${endpoint}/profiles`;
export const checkoutURL = `${endpoint}/checkout`;
export const Cash = {
	symbol: '₹',
	code: 'INR',
};
