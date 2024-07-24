import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { createElement, ensureElement } from '../../utils/utils';
import { Events, ProductCategory, BasketProduct, ListItem, IOrder } from '../../types/types';
import { Forms, DOMSelectorsForms } from './AppPresenter';

const DOMSelectorsPage = {
	BASKET_COUNTER: '.header__basket-counter',
	PRODUCTS_CONTAINER: '.gallery',
	BASKET: '.header__basket',
	WRAPPER: '.page__wrapper',
};

interface IPage {
	basketCounter: number;
	products: HTMLElement[];
	locked: boolean;
}

interface IPage {
	basketCounter: number;
	products: HTMLElement[];
	locked: boolean;
}

export class PageView extends Component<IPage> {
	private _basketCounter: HTMLElement;
	private _productsContainer: HTMLElement;
	private _basket: HTMLElement;
	private _wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		const { BASKET_COUNTER, PRODUCTS_CONTAINER, BASKET, WRAPPER, } = DOMSelectorsPage;
		this._basketCounter = ensureElement<HTMLElement>(BASKET_COUNTER, container);
		this._productsContainer = ensureElement<HTMLElement>(PRODUCTS_CONTAINER, container);
		this._basket = ensureElement<HTMLElement>(BASKET, container);
		this._wrapper = ensureElement<HTMLElement>(WRAPPER, container);

		this._basket.addEventListener('click', () => {
			this.events.emit(Events.BASKET_SHOW);
		});
	}

	set products(products: HTMLElement[]) {
		this._productsContainer.replaceChildren(...products);
	}

	set basketCounter(counter: number) {
		this.setText(this._basketCounter, counter.toString());
	}

	set locked(value: boolean) {
		this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
	}

}

interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

export interface IProductView {
	id: string;
	description: string;
	status: boolean;
	price: string;
	title: string;
	category: ProductCategory;
	button: string;
	image: string;
}

const DOMSelectorsProduct = {
	TITLE: '.card__title',
	IMAGE: '.card__image',
	CATEGORY: '.card__category',
	PRICE: '.card__price',
	BUTTON: '.card__button',
	DESCRIPTION: '.card__text',
	INDEX: '.basket__item-index',
	DELETE_BUTTON: '.basket__item-delete'
};

export class ProductView extends Component<IProductView> {
	private _image: HTMLImageElement;
	private _title: HTMLElement;
	private _category: HTMLElement;
	private _price: HTMLElement;
	private _button: HTMLButtonElement | null;

	constructor(container: HTMLElement, actions: IProductActions) {
		super(container);

		const { TITLE, IMAGE, CATEGORY, PRICE, BUTTON } = DOMSelectorsProduct;
		this._title = ensureElement<HTMLElement>(TITLE, container);
		this._image = ensureElement<HTMLImageElement>(IMAGE, container);
		this._category = ensureElement<HTMLElement>(CATEGORY, container);
		this._price = ensureElement<HTMLElement>(PRICE, container);
		this._button = container.querySelector(BUTTON) as HTMLButtonElement | null;

		if (this._button) {
			this._button.addEventListener('click', actions.onClick);
		} else {
			container.addEventListener('click', actions.onClick);
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set category(value: keyof typeof ProductCategory) {
		if (this._category) {
			this.setText(this._category, value);

			const existingClasses = Array.from(this._category.classList)
				.filter(className => className.startsWith('card__category_'));
			existingClasses.forEach(className => this._category.classList.remove(className));

			const categoryClass = `card__category_${ProductCategory[value]}`;
			if (!this._category.classList.contains(categoryClass)) {
				this._category.classList.add(categoryClass);
			}
		}
	}

	set price(value: string) {
		this.setText(this._price, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this._title.textContent);
	}

	set status(status: boolean) {
		if (!this._button) return;

		if (!this._price.textContent) {
			this.setText(this._button, 'Недоступно');
			this.setDisabled(this._button, true);
		} else {
			this.setText(this._button, status ? 'Уже в корзине' : 'В корзину');
			this.setDisabled(this._button, status);
		}
	}
}


export class ProductViewModal extends ProductView {
	private _description: HTMLElement;

	constructor(container: HTMLElement, actions: IProductActions) {
		super(container, actions);

		const { DESCRIPTION } = DOMSelectorsProduct;
		this._description = ensureElement<HTMLElement>(DESCRIPTION, container);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
}
export class ProductBasketView extends Component<BasketProduct | ListItem> {
	private _index: HTMLElement;
	private _price: HTMLElement;
	private _title: HTMLElement;
	private _button: HTMLButtonElement;

	constructor(container: HTMLElement, actions: IProductActions) {
		super(container);

		const { INDEX, PRICE, TITLE, DELETE_BUTTON } = DOMSelectorsProduct;
		this._index = ensureElement<HTMLElement>(INDEX, container);
		this._price = ensureElement<HTMLElement>(PRICE, container);
		this._title = ensureElement<HTMLElement>(TITLE, container);
		this._button = ensureElement<HTMLButtonElement>(DELETE_BUTTON, container);

		this._button.addEventListener('click', actions.onClick);
	}

	set price(value: number) {
		this.setText(this._price, `${value} синапсов`);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set index(value: number) {
		this.setText(this._index, String(value));
	}
}

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

interface IBasketView {
	products: HTMLElement[];
	total: number;
}

export class BasketView extends Component<IBasketView> {
	private list: HTMLElement;
	private _total: HTMLElement;
	private button: HTMLButtonElement;

	constructor(container: HTMLElement, private events: IEvents) {
		super(container);

		const { BASKET_BUTTON, BASKET_PRICE, BASKET_LIST } = DOMSelectorsBasket;
		this.list = ensureElement<HTMLElement>(BASKET_LIST, this.container);
		this._total = ensureElement<HTMLElement>(BASKET_PRICE, this.container);
		this.button = ensureElement<HTMLButtonElement>(BASKET_BUTTON, this.container);

		this.button.addEventListener('click', () => this.events.emit(Events.ORDER_START));
		this.products = [];
	}

	set products(products: HTMLElement[]) {
		if (products.length === 0) {
			this.list.replaceChildren(createElement('p', { textContent: 'Корзина пуста' }));
			this.toggleButton(true);
			return;
		}
		this.list.replaceChildren(...products);
		this.toggleButton(false);
	}

	set total(total: number) {
		this.setText(this._total, total.toString() + ' синапсов');
	}

	private toggleButton(state: boolean) {
		this.setDisabled(this.button, state);
	}
}

export class ContactsForm extends Forms<IOrder> {
	private _inputPhone: HTMLInputElement;
	private _inputEmail: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		const { INPUT_PHONE, INPUT_EMAIL } = DOMSelectorsForms;
		this._inputPhone = ensureElement<HTMLInputElement>(INPUT_PHONE, this.container);
		this._inputEmail = ensureElement<HTMLInputElement>(INPUT_EMAIL, this.container);
	}

	set phone(value: string) {
		this._inputPhone.value = value;
	}

	set email(value: string) {
		this._inputEmail.value = value;
	}

}

export class OrderForm extends Forms<IOrder> {
	private _buttonOnlinePayment: HTMLButtonElement;
	private _buttonCashPayment: HTMLButtonElement;
	private _inputAddress: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		const { BUTTON_CARD, BUTTON_CASH, INPUT_ADDRESS } = DOMSelectorsForms;
		this._buttonOnlinePayment = ensureElement<HTMLButtonElement>(BUTTON_CARD, this.container);
		this._buttonCashPayment = ensureElement<HTMLButtonElement>(BUTTON_CASH, this.container);
		this._inputAddress = ensureElement<HTMLInputElement>(INPUT_ADDRESS, this.container);

		this._buttonOnlinePayment.addEventListener('click', () => this.togglePaymentMethod('card'));
		this._buttonCashPayment.addEventListener('click', () => this.togglePaymentMethod('cash'));
	}

	toggleClass(element: HTMLElement, className: string, state: boolean) {
		if (state) {
			element.classList.add(className);
		} else {
			element.classList.remove(className);
		}
	}

	toggleCard(state: boolean) {
		this.toggleClass(this._buttonOnlinePayment, 'button_alt-active', state);
	}

	toggleCash(state: boolean) {
		this.toggleClass(this._buttonCashPayment, 'button_alt-active', state);
	}

	resetPaymentButtons() {
		this.toggleCard(false);
		this.toggleCash(false);
	}

	resetAddress() {
		this._inputAddress.value = '';
	}

	togglePaymentMethod(selectedPayment: string) {
		const cardActive = this._buttonOnlinePayment.classList.contains('button_alt-active');
		const cashActive = this._buttonCashPayment.classList.contains('button_alt-active');

		switch (selectedPayment) {
			case 'card':
				this.toggleCard(!cardActive);
				this.payment = cardActive ? null : 'card';
				if (!cardActive) this.toggleCash(false);
				break;
			case 'cash':
				this.toggleCash(!cashActive);
				this.payment = cashActive ? null : 'cash';
				if (!cashActive) this.toggleCard(false);
				break;
			default:
				break;
		}
	}

	set address(value: string) {
		this._inputAddress.value = value;
	}

	set payment(value: string) {
		this.events.emit(Events.PAYMENT_METHOD, { paymentType: value });
	}

}

interface ISuccess {
	title: string;
	description: string;
	onClick?: () => void;
}

interface ISuccessActions {
	onClick?: () => void;
	onClose?: () => void;
}

const DOMSelectorsSuccess = {
	SUCCESS_CLOSE: '.order-success__close',
	SUCCESS_TITLE: '.order-success__title',
	SUCCESS_DESCRIPTION: '.order-success__description'
}


interface ISuccess {
	title: string;
	description: string;
}

interface ISuccessActions {
	onClick?: () => void;
	onClose?: () => void;
}


export class SuccessView extends Component<ISuccess> {
	private _close!: HTMLElement;
	private _title!: HTMLElement;
	private _description!: HTMLElement;

	constructor(container: HTMLElement, { onClick, onClose }: ISuccessActions) {
		super(container);

		const { SUCCESS_CLOSE, SUCCESS_TITLE, SUCCESS_DESCRIPTION } = DOMSelectorsSuccess;
		this._close = ensureElement<HTMLElement>(SUCCESS_CLOSE, container);
		this._title = ensureElement<HTMLElement>(SUCCESS_TITLE, container);
		this._description = ensureElement<HTMLElement>(SUCCESS_DESCRIPTION, container);

		if (onClick) {
			this._close.addEventListener('click', onClick);
		}

		if (onClose) {
			this._close.addEventListener('click', onClose);
		}

		this.container.addEventListener('click', this.handleClickOutside.bind(this));
		this._close.addEventListener('click', (event) => event.stopPropagation());
	}

	private handleClickOutside(event: MouseEvent) {
		if (event.target === this.container) {
			this.reloadPage();
		}
	}

	private reloadPage() {
		window.location.reload();
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	render(data: ISuccess): HTMLElement {
		this.title = data.title;
		this.description = data.description;
		return this.container;
	}
}


