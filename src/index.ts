import './scss/styles.scss';

import { ProductModel } from './components/base/ProductModel';
import { ProductCard } from './components/base/ProductCard';
import { ensureElement, cloneTemplate, createElement } from './utils/utils';
import { Product } from './types/types';
import { Api } from './components/base/api';
import { API_URL } from './utils/constants';
import { EventEmitter} from './components/base/events';



const events = new EventEmitter();

async function init() {
	const api = new Api(API_URL);
	const productModel = new ProductModel(api);

	await productModel.loadProducts();
	const products: Product[] = productModel.getProducts();
	const gallery = ensureElement<HTMLElement>('.gallery');

	console.log('Loaded products:', products);

	products.forEach((product, index) => {
		const cardTemplate = cloneTemplate<HTMLButtonElement>('#card-catalog');
		const productCard = new ProductCard(cardTemplate);
		productCard.product = product;
		gallery.appendChild(createElement('article', { className: 'card' }, cardTemplate));

		console.log(`Appended product ${index + 1} to gallery`);
	});

}

events.on('product:click', (product: Product) => {
	console.log('Product clicked:', product);
});

init();