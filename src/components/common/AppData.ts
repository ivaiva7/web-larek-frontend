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
	validOrderFields: Partial<IOrder> = {};
	formErrors: FormErrors = {};

	constructor(data: Partial<IAppData>, events: IEvents, products: IProduct[] = [], basket: IProduct[] = [], order: IOrder) {
		super(data, events);
		this.products = products;
		this.basket = basket;
		this.order = order;

		this.restoreOrderFromLocalStorage();
	}

	setProducts(products: IProduct[]) {
		this.products = products;
		this.emitChanges(Events.PRODUCTS_CHANGED, { products: this.products });
		this.saveOrderToLocalStorage();
	}

	getProducts() {
		return this.products;
	}

	getBasket() {
		return this.basket;
	}

	addToBasket(product: IProduct) {
		if (!this.basket.some(p => p.id === product.id)) {
			this.basket.push(product);
		}
		this.saveOrderToLocalStorage();
	}

	removeFromBasket(product: IProduct) {
		this.basket = this.basket.filter(item => item.id !== product.id);
		this.emitChanges(Events.BASKET_SHOW);
		this.saveOrderToLocalStorage();
	}

	clearBasket() {
		this.basket = [];
		this.emitChanges(Events.PRODUCTS_CHANGED, { products: this.products });
		this.saveOrderToLocalStorage();
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
		this.saveOrderToLocalStorage();
	}

	isPreviousFormValid(): boolean {
		const isValid = Boolean(this.order.address) && Boolean(this.order.payment);
		return isValid;
	}
	isFormValid(): boolean {
		return Object.keys(this.formErrors).length === 0;
	}

	validateOrder(field: keyof IOrder) {
		const errors: Partial<Record<keyof IOrder, string>> = {};

		let emailError: string | undefined;
		let phoneError: string | undefined;

		switch (field) {
			case 'email':
				emailError = !this.order.email.match(/^\S+@\S+\.\S+$/) ? 'email' : '';
				if (emailError) {
					errors.email = `Необходимо указать ${emailError} в формате abcd@efg.higk`;
				}
				break;
			case 'phone':
				phoneError = !this.order.phone.match(/^\+7\d{10}$/) ? 'телефон' : '';
				if (phoneError) {
					errors.phone = `Необходимо указать ${phoneError} в формате + 7 (***) *** ** **`;
				}
				break;
			default:
				if (!this.order.address) {
					errors.address = 'Введите адрес';
				} else if (!this.order.payment) {
					errors.payment = 'Выберете тип оплаты';
				}
				break;
		}

		this.formErrors = errors;
		this.events.emit(Events.FORM_INVALID, this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) {
		this.order[field] = value;

		const isValid = this.validateOrder(field);

		if (isValid) {
			this.validOrderFields[field] = value;
			this.events.emit(Events.ORDER_READY, this.order);
			this.saveOrderToLocalStorage();
		} else {
			delete this.validOrderFields[field];
		}
	}

	saveValidFieldsToLocalStorage() {
		const validFieldsData = {
			validOrderFields: this.validOrderFields
		};
		localStorage.setItem('validFieldsData', JSON.stringify(validFieldsData));
	}

	loadValidFieldsFromLocalStorage() {
		const validFieldsData = localStorage.getItem('validFieldsData');
		if (validFieldsData) {
			const { validOrderFields } = JSON.parse(validFieldsData);
			this.validOrderFields = validOrderFields || {};
		}
	}

	private saveOrderToLocalStorage() {
		const orderData = {
			order: this.order,
			basket: this.basket
		};
		localStorage.setItem('orderData', JSON.stringify(orderData));
		this.saveValidFieldsToLocalStorage();
	}

	clearOrderFields() {

		this.order = {
			payment: null,
			address: '',
			email: '',
			phone: '',
			total: 0,
			items: [],
		};
		this.validOrderFields = {};

		this.saveOrderToLocalStorage();

		this.events.emit(Events.ORDER_CLEARED, this.order);
	}

	private restoreOrderFromLocalStorage() {
		const orderData = localStorage.getItem('orderData');
		if (orderData) {
			const { order, basket } = JSON.parse(orderData);

			this.order = order;
			this.basket = basket;

			this.products.forEach(product => {
				const inBasketProduct = this.basket.find(item => item.id === product.id);
				product.inBasket = inBasketProduct ? inBasketProduct.inBasket : false;
			});

			this.emitChanges(Events.PRODUCTS_CHANGED, { products: this.products });
		}
	}
}
