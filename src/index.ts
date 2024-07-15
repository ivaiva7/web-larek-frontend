import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AppData } from './components/common/AppData';
import { CDN_URL, API_URL } from './utils/constants';
import { AppApi } from './components/common/AppApi';
import { cloneTemplate, ensureElement, createElement } from './utils/utils';
import { Events, IProduct, IOrder } from './types/types';
import { PageView,
				ProductView,
				ProductViewModal,
				ProductBasketView,
				BasketView,
				SuccessView } from './components/common/AppView';
import { ProductsChangeEvent } from './components/common/AppData';
import { OrderForm, ContactsForm, Modal } from './components/common/AppPresenter';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);


const templates = {
	cardCatalog: ensureElement<HTMLTemplateElement>('#card-catalog'),
	productModal: ensureElement<HTMLTemplateElement>('#card-preview'),
	basket: ensureElement<HTMLTemplateElement>('#basket'),
	productInBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
	order: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
	successOrder: ensureElement<HTMLTemplateElement>('#success'),
};


const appData = new AppData({}, events, [], [], {
	email: '',
	phone: '',
	payment: null,
	address: '',
	total: 0,
	items: [],
});


const pageView = new PageView(document.body, events);
const basketView = new BasketView(cloneTemplate(templates.basket), events);
const orderForm = new OrderForm(cloneTemplate(templates.order), events);
const contactsForm = new ContactsForm(cloneTemplate(templates.contacts), events);
const successView = new SuccessView(cloneTemplate(templates.successOrder), {
	onClick: () => {
		modal.close();
		events.emit(Events.ORDER_CLEARED);
	},
});

const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const renderProducts = () => {
	pageView.basketCounter = appData.getBasket().length;
	pageView.products = appData.getProducts().map(item => {
		const product = new ProductView(cloneTemplate(templates.cardCatalog), {
			onClick: () => {
				events.emit(Events.PRODUCT_OPEN_IN_MODAL, item);
			}
		});
		return product.render({
			id: item.id,
			title: item.title,
			image: CDN_URL + item.image,
			category: item.category,
			price: item.price ? `${item.price} синапсов` : 'Бесценно'
		});
	});
};

const openProductInModal = (product: IProduct) => {
	const card = new ProductViewModal(cloneTemplate(templates.productModal), {
		onClick: () => events.emit(Events.ADD_TO_BASKET, product),
	});

	modal.render({
		content: card.render({
			title: product.title,
			image: CDN_URL + product.image,
			category: product.category,
			description: product.description,
			price: product.price ? `${product.price} синапсов` : '',
			status: product.price === null || appData.getBasket().some(item => item === product)
		}),
	});
};

const addToBasket = (product: IProduct) => {
	appData.addToBasket(product);
	pageView.basketCounter = appData.getBasket().length;
	modal.close();
};

const showBasket = () => {
	const products = appData.getBasket().map((item, index) => {
		const product = new ProductBasketView(cloneTemplate(templates.productInBasket), {
			onClick: () => events.emit(Events.REMOVE_PRODUCT_FROM_BASKET, item)
		});
		return product.render({
			index: index + 1,
			id: item.id,
			title: item.title,
			price: item.price
		});
	});
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			basketView.render({
				products,
				total: appData.getTotalPrice()
			})
		])
	});
};

const removeFromBasket = (product: IProduct) => {
	appData.removeFromBasket(product);
	pageView.basketCounter = appData.getBasket().length;
};

const startOrder = () => {
	const data = appData.isPreviousFormValid() ? { phone: '', email: '' } : { address: '' };
	const form = appData.isPreviousFormValid() ? contactsForm : orderForm;
	modal.render({
		content: form.render({
			valid: false,
			errors: [],
			...data
		})
	});
};

const handlePaymentMethod = (data: { paymentType: string }) => {
	appData.setOrderField("payment", data.paymentType);
};

const handleFormChange = (data: { field: keyof Omit<IOrder, 'items' | 'total'>; value: string }) => {
	appData.setOrderField(data.field, data.value);
	const formErrors = appData.formErrors;
	const isValid = Object.keys(formErrors).length === 0;

	orderForm.valid = isValid;
	orderForm.errors = Object.values(formErrors).join(', ');

	contactsForm.valid = isValid;
	contactsForm.errors = Object.values(formErrors).join(', ');
};


const handleFormInvalid = (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	const valid = !address && !payment;
	const errorMessage = Object.values(errors).filter((item) => !!item).join(', ');

	orderForm.valid = valid;
	orderForm.errors = errorMessage;

	contactsForm.valid = !email && !phone;
	contactsForm.errors = errorMessage;
};

const submitOrder = () => {
	if (!appData.getOrder().email || !appData.getOrder().address || !appData.getOrder().phone) {
		return events.emit(Events.ORDER_START);
	}

	const products = appData.getBasket();
	api.makeOrder({
		...appData.getOrder(),
		items: products.map(product => product.id),
		total: appData.getTotalPrice(),
	})
		.then((result) => {
			modal.render({
				content: successView.render({
					title: !result.error ? 'Заказ оформлен' : 'Ошибка оформления заказа',
					description: !result.error ? `Списано ${result.total} синапсов` : result.error,
				}),
			});
		})
		.catch(console.error);
};

const clearOrderAndBasket = () => {
	appData.clearBasket();
	appData.clearOrder();
	orderForm.resetPaymentButtons();
	window.location.reload();
};

events.on<ProductsChangeEvent>(Events.PRODUCTS_CHANGED, renderProducts);
events.on(Events.PRODUCT_OPEN_IN_MODAL, openProductInModal);
events.on(Events.MODAL_OPEN, () => { pageView.locked = true; });
events.on(Events.MODAL_CLOSE, () => { pageView.locked = false; });
events.on(Events.ADD_TO_BASKET, addToBasket);
events.on(Events.BASKET_SHOW, showBasket);
events.on(Events.REMOVE_PRODUCT_FROM_BASKET, removeFromBasket);
events.on(Events.ORDER_START, startOrder);
events.on(Events.PAYMENT_METHOD, handlePaymentMethod);
events.on(/(^order|^contacts)\..*:change/, handleFormChange);
events.on(Events.FORM_INVALID, handleFormInvalid);
events.on(/(^order|^contacts):submit/, submitOrder);
events.on(Events.ORDER_CLEARED, clearOrderAndBasket);


api.getProducts()
	.then(data => appData.setProducts(data.items))
	.catch(console.error);
