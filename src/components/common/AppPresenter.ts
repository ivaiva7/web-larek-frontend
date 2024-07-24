import { Events } from '../../types/types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export const DOMSelectorsForms = {
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

		this.restoreFormState(); // Восстановление состояния формы при инициализации
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

	// Новый метод для установки состояния формы
	setFormState(data: Partial<T> & IFormState) {
		Object.assign(this, data);
		this.render(data);
	}

	private restoreFormState() {
		const formState = localStorage.getItem('formState');
		if (formState) {
			const { valid, errors } = JSON.parse(formState);
			this.valid = valid;
			this.errors = errors;
		}
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

	isOpen(): boolean {
		return this.container.classList.contains('modal_active');
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
