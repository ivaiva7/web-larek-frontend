import { Component } from "../base/component";
import { IEvents } from "../base/events";
import { Events } from "../../types/types";
import { ensureElement } from '../../utils/utils';

const DOMSelectors = {
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
			_closeButton: ensureElement<HTMLButtonElement>(DOMSelectors.CLOSE_BUTTON, this.container),
			_content: ensureElement<HTMLElement>(DOMSelectors.CONTENT, this.container),
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
