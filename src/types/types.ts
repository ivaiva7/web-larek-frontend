export interface Product {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}

export enum ProductCategory {
	SOFT_SKILL = 'soft',
	OTHER = 'other',
	HARD_SKILL = 'hard',
	ADDITIONAL = 'additional',
	BUTTON = 'button'
}

export interface Order {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface OrderResult {
	id: string;
	total: number;
	error?: string;
}

export type FormErrors = {
	email?: string;
	phone?: string;
	address?: string;
	payment?: string;
};

export type BasketProduct = Pick<Product, "id" | "title" | "price">;

export type ListItem = {
	index: number;
}

export interface AppData {
	products: Product[];
	basket: Product[];
	order: Order;
}

export interface List<T> {
	items: T[];
	total: number;
}

export enum Events {
	PRODUCTS_CHANGED = 'products:changed',
	PRODUCT_OPEN_IN_MODAL = 'product:openInModal',
	ADD_TO_BASKET = 'product:addToBasket',
	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',
	BASKET_SHOW = 'basket:show',
	ORDER_START = 'order:start',
	REMOVE_PRODUCT_FROM_BASKET = 'product:removeFromBasket',
	PAYMENT_METHOD = 'order:paymentMethod',
	ORDER_READY = 'order:ready',
	FORM_INVALID = 'form:invalidChanged',
	ORDER_CLEARED = 'order:clear',
}
