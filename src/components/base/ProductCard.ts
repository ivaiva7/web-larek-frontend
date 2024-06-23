import { Product } from '../../types/types';
import { ensureElement } from '../../utils/utils';




export class ProductCard {
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement) {
		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);

		this._price = ensureElement<HTMLElement>('.card__price', container);

	}

	set product(product: Product) {
		this._title.textContent = product.title;
		this._price.textContent = `${product.price} синапсов`;
		this._image = product.image;
	}
}