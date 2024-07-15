import { BasketProduct, Events } from '../../types/types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';


export const DOMSelectorsBasket = {
	BASKET_BUTTON: '.basket__button',
	MODAL_TITLE: '.modal__title',
	BASKET_PRICE: '.basket__price',
	BASKET_LIST: '.basket__list'
};

export class Basket extends Component<BasketProduct> {
	private basketButton: HTMLElement;
	private basketTitle: HTMLElement;
	private priceElement: HTMLElement;

	constructor(container: HTMLElement, private events: IEvents) {
		super(container);
		const { BASKET_BUTTON, MODAL_TITLE, BASKET_PRICE } = DOMSelectorsBasket;
		this.basketButton = ensureElement<HTMLElement>(BASKET_BUTTON, this.container);
		this.basketTitle = ensureElement<HTMLElement>(MODAL_TITLE, this.container);
		this.priceElement = ensureElement<HTMLElement>(BASKET_PRICE, this.container);

		this.basketButton.addEventListener('click', () => this.events.emit(Events.BASKET_SHOW));
	}

	set title(title: string) {
		this.basketTitle.textContent = title;
	}

	set price(price: number) {
		this.priceElement.textContent = price.toString();
	}
}