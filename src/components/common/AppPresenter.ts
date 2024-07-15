import { BasketProduct, Events, IOrder } from '../../types/types';
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


const DOMSelectorsForms = {
	SUBMIT_BUTTON: 'button[type=submit]',
	ERRORS_CONTAINER: '.form__errors',
	INPUT_PHONE: 'input[name="phone"]',
	INPUT_EMAIL: 'input[name="email"]',
	BUTTON_CARD: 'button[name="card"]',
	BUTTON_CASH: 'button[name="cash"]',
	INPUT_ADDRESS: 'input[name="address"]'
};

interface IFormState {
	valid: boolean;
	errors: string[];
}

export class Forms<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		const { SUBMIT_BUTTON, ERRORS_CONTAINER } = DOMSelectorsForms;
		this._submit = ensureElement<HTMLButtonElement>(SUBMIT_BUTTON, this.container);
		this._errors = ensureElement<HTMLElement>(ERRORS_CONTAINER, this.container);

		this.container.addEventListener('input', this.handleInputChange.bind(this));
		this.container.addEventListener('submit', this.handleSubmit.bind(this));
	}

	private handleInputChange(evt: Event) {
		const target = evt.target as HTMLInputElement;
		const field = target.name as keyof T;
		const value = target.value;
		this.onInputChange(field, value);
	}

	private handleSubmit(evt: Event) {
		evt.preventDefault();
		this.events.emit(`${this.container.name}:submit`);
	}

	set valid(value: boolean) {
		this.setDisabled(this._submit, !value);
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, { field, value });
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
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


const DOMSelectorsModal = {
	CLOSE_BUTTON: '.modal__close',
	CONTENT: '.modal__content',
};

interface IModal {
	content: HTMLElement;
}

export class Modal extends Component<IModal> {
	protected _closeButton!: HTMLButtonElement;
	protected _content!: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		({ _closeButton: this._closeButton, _content: this._content } = this.extractElements(container));

		if (!this._closeButton || !this._content) {
			throw new Error('Элемент модального окна не найден');
		}

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.handleClickOutside.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
		document.addEventListener('keydown', this.handleKeyDown);
	}

	private extractElements(container: HTMLElement) {
		return {
			_closeButton: ensureElement<HTMLButtonElement>(DOMSelectorsModal.CLOSE_BUTTON, this.container),
			_content: ensureElement<HTMLElement>(DOMSelectorsModal.CONTENT, this.container),
		};
	}

	private handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && this.container.classList.contains('modal_active')) {
			this.close();
		}
	}

	private handleClickOutside(event: MouseEvent) {
		if (event.target === this.container) {
			this.close();
		}
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}

	open() {
		this.toggleClass(this.container, 'modal_active', true);
		this.events.emit(Events.MODAL_OPEN);
	}

	close() {
		this.toggleClass(this.container, 'modal_active', false);
		this.events.emit(Events.MODAL_CLOSE);
	}
}
