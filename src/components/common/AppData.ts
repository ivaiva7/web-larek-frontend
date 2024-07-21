import { Events, IAppData, IOrder, IProduct, FormErrors } from '../../types/types';
import { IEvents } from '../base/events';
import { Model } from '../base/model';

export type ProductsChangeEvent = {
	products: IProduct[]
};

export class AppData extends Model<IAppData> {
	private products: IProduct[] = [];
	private basket: IProduct[] = [];
	private order: IOrder = {
		payment: null,
		address: '',
		email: '',
		phone: '',
		total: 0,
		items: [],
	};
	formErrors: FormErrors = {};

	constructor(data: Partial<IAppData>, events: IEvents, products: IProduct[] = [], basket: IProduct[] = [], order: IOrder) {
		super(data, events);
		this.products = products;
		this.basket = basket;
		this.order = order;
	}

	setProducts(products: IProduct[]) {
		this.products = products;
		this.emitChanges(Events.PRODUCTS_CHANGED, { products: this.products });
	}

	getProducts() {
		return this.products;
	}

	getBasket() {
		return this.basket;
	}

	addToBasket(product: IProduct) {
		if (!this.basket.includes(product)) {
			this.basket.push(product);
		}
	}

	removeFromBasket(product: IProduct) {
		this.basket = this.basket.filter(item => item !== product);
		this.emitChanges(Events.BASKET_SHOW);
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges(Events.PRODUCTS_CHANGED, { products: this.products });
	}

	getTotalPrice() {
		return this.basket.reduce((total, product) => total + product.price, 0);
	}

	getOrder() {
		return this.order;
	}

	clearOrder() {
		this.order = {
			payment: null,
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
	}

	isPreviousFormValid() {
		return this.order.address && this.order.payment;
	}
	validateOrder(field: keyof IOrder) {
		const errors: Partial<Record<keyof IOrder, string>> = {};

		let emailError: string | undefined;
		let phoneError: string | undefined;

		switch (field) {
			case 'email':
				emailError = !this.order.email.match(/^\S+@\S+\.\S+$/) ? 'email' : '';
				if (emailError) {
					errors.email = `Необходимо указать ${emailError}`;
				}
				break;
			case 'phone':
				phoneError = !this.order.phone.match(/^\+7\d{10}$/) ? 'телефон' : '';
				if (phoneError) {
					errors.phone = `Необходимо указать ${phoneError}`;
				}
				break;
			default:
				if (!this.order.address) {
					errors.address = 'Необходимо указать адрес';
				} else if (!this.order.payment) {
					errors.payment = 'Необходимо выбрать тип оплаты';
				}
				break;
		}

		this.formErrors = errors;
		this.events.emit(Events.FORM_INVALID, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) {
		this.order[field] = value;
		if (this.validateOrder(field)) {
			this.events.emit(Events.ORDER_READY, this.order);
		}
	}
}

