import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";
import { Events, IOrder } from '../../types/types';

const DOMSelectors = {
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
		this._submit = ensureElement<HTMLButtonElement>(DOMSelectors.SUBMIT_BUTTON, this.container);
		this._errors = ensureElement<HTMLElement>(DOMSelectors.ERRORS_CONTAINER, this.container);

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
		this._inputPhone = ensureElement<HTMLInputElement>(DOMSelectors.INPUT_PHONE, this.container);
		this._inputEmail = ensureElement<HTMLInputElement>(DOMSelectors.INPUT_EMAIL, this.container);
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
		this._buttonOnlinePayment = ensureElement<HTMLButtonElement>(DOMSelectors.BUTTON_CARD, this.container);
		this._buttonCashPayment = ensureElement<HTMLButtonElement>(DOMSelectors.BUTTON_CASH, this.container);
		this._inputAddress = ensureElement<HTMLInputElement>(DOMSelectors.INPUT_ADDRESS, this.container);

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
