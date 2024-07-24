import './scss/styles.scss';
import { EventEmitter, EmitterEvent } from './components/base/events';
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
	OrderForm,
	ContactsForm,
	SuccessView } from './components/common/AppView';
import { ProductsChangeEvent } from './components/common/AppData';
import { Modal } from './components/common/AppPresenter';

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

		product.status = item.inBasket || false;

		return product.render({
			id: item.id,
			title: item.title,
			image: CDN_URL + item.image,
			category: item.category,
			price: item.price ? `${item.price} синапсов` : 'Бесценно',
			status: item.inBasket || false
		});
	});
};

const openProductInModal = (product: IProduct) => {
	const card = new ProductViewModal(cloneTemplate(templates.productModal), {
		onClick: () => events.emit(Events.ADD_TO_BASKET, product),
	});


	card.status = appData.getBasket().some(item => item.id === product.id);

	modal.render({
		content: card.render({
			title: product.title,
			image: CDN_URL + product.image,
			category: product.category,
			description: product.description,
			price: product.price ? `${product.price} синапсов` : '',
			status: appData.getBasket().some(item => item.id === product.id)
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
	const validFieldsFromLocalStorage = localStorage.getItem('validFieldsData');
	const hasValidFields = validFieldsFromLocalStorage ? JSON.parse(validFieldsFromLocalStorage).validOrderFields : null;

	const isFormValid = appData.isPreviousFormValid();
	const hasLocalStorageData = hasValidFields && Object.keys(hasValidFields).length > 0;

	const formData = hasLocalStorageData ? { ...hasValidFields } : { address: '', email: '', phone: '' };
	const form = isFormValid ? contactsForm : orderForm;

	if (isFormValid || hasLocalStorageData) {
		if (hasLocalStorageData) {
			Object.entries(formData).forEach(([field, value]) => {
				appData.setOrderField(field as keyof Omit<IOrder, 'items' | 'total'>, String(value));
			});
		}
		modal.render({
			content: form.render({
				valid: isFormValid,
				errors: isFormValid ? [] : Object.values(appData.formErrors),
				...formData,
			}),
		});
	} else {
		modal.render({
			content: form.render({
				valid: isFormValid,
				errors: Object.values(appData.formErrors),
				...formData,
			}),
		});
	}
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

const resetOrderForm = () => {
	appData.clearOrder();
	const formErrors = appData.formErrors;
	if (Object.keys(formErrors).length > 0) {
		orderForm.resetPaymentButtons();
		orderForm.resetAddress();
	}
};


const clearOrderAndBasket = () => {
	appData.clearBasket();
	appData.clearOrder();
	orderForm.resetPaymentButtons();
};

const clearInputs = () => {
	appData.clearOrderFields();
	localStorage.removeItem('orderData');
	localStorage.removeItem('validFieldsData');
	const orderFormElements = document.querySelectorAll('.order-form input');
	orderFormElements.forEach(input => {
		(input as HTMLInputElement).value = '';
	});
	
	const contactsFormElements = document.querySelectorAll('.contacts-form input');
	contactsFormElements.forEach(input => {
		(input as HTMLInputElement).value = '';
	});
}

const submitFormOrder = () => {
	const isOrderFormValid = appData.isPreviousFormValid();

	if (!isOrderFormValid) {
		events.emit(Events.ORDER_START);
		return;
	}
	const isFormValid = appData.isPreviousFormValid();
	const order = appData.getOrder();
	modal.render({
		content: contactsForm.render({
			valid: isFormValid,
			errors: Object.values(appData.formErrors),
			...FormData,
		}),
	});
	appData.saveValidFieldsToLocalStorage();
};


const submitOrder = () => {
	try {
		const isOrderFormValid = appData.isPreviousFormValid();
		const isContactsFormValid = appData.isFormValid();

		if (!isOrderFormValid || !isContactsFormValid) {
			events.emit(Events.ORDER_START);
			return;
		}

		const products = appData.getBasket();
		api.makeOrder({
			...appData.getOrder(),
			items: products.map(product => product.id),
			total: appData.getTotalPrice(),
		})
			.then((result) => {
				const modalContent = successView.render({
					title: !result.error ? 'Заказ оформлен' : 'Ошибка оформления заказа',
					description: !result.error ? `Списано ${result.total} синапсов` : result.error,
				});

				modal.render({
					content: modalContent,
				});

				const onModalClose = () => {
					window.location.reload();
					events.off(Events.MODAL_CLOSE, onModalClose);
				};
				events.on(Events.MODAL_CLOSE, onModalClose);

				clearOrderAndBasket();
				clearInputs();
			})
			.catch((error) => {
				console.error('Ошибка при оформлении заказа:', error);
			});
	} catch (error) {
		console.error('Ошибка при отправке заказа:', error);
	}
};



events.on<ProductsChangeEvent>(Events.PRODUCTS_CHANGED, renderProducts);
events.on(Events.PRODUCT_OPEN_IN_MODAL, openProductInModal);
events.on(Events.MODAL_OPEN, () => {
	pageView.locked = true;
});
events.on(Events.MODAL_CLOSE, () => {
	pageView.locked = false;
	resetOrderForm();
});
events.on(Events.ADD_TO_BASKET, addToBasket);
events.on(Events.BASKET_SHOW, showBasket);
events.on(Events.REMOVE_PRODUCT_FROM_BASKET, removeFromBasket);
events.on(Events.ORDER_START, startOrder);
events.on(Events.PAYMENT_METHOD, handlePaymentMethod);
events.on(/(^order|^contacts)\..*:change/, handleFormChange);
events.on(Events.FORM_INVALID, handleFormInvalid);
events.on(/(^order):submit/, submitFormOrder);
events.on(/(^contacts):submit/, submitOrder);

api.getProducts()
	.then(data => appData.setProducts(data.items))
	.catch(console.error);
