# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом
- src/components/common/ - папка, в которой реализованы слои MVP (Model-View-Presenter) 

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/types.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами
- src/components/common/AppApi.ts - файл с взаимодействием с API приложения.
- src/components/common/AppData.ts - слой данных.
- src/components/common/AppPresenter - слой презентера.
- src/components/common/AppView - слой представления.

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Название Проекта: Интернет-Магазин "Веб-Ларек"

Описание Проекта: Интернет-магазин, позволяющий пользователям просматривать и покупать товары онлайн. Основные функции включают просмотр каталога товаров, детальный просмотр каждого товара, добавление товаров в корзину и оформление покупок.

Технологический Стек:

HTML, SCSS, TS, Webpack.

# Архитектура Проекта

Проект организован в соответствии с архитектурной парадигмой MVP (Model-View-Presenter), где взаимодействие между компонентами осуществляется через событийную модель. В рамках данной архитектуры:\

  Модели (Model) инициируют события и хранят данные, предоставляя основу для обработки бизнес-логики и управления состоянием.\

  Представление (View) отвечает за отображение данных и взаимодействие с пользователем. Оно реагирует на события, генерируемые моделями, и передает данные на уровень презентера для обработки.\

  Презентер (Presenter) является посредником между моделями и представлением. Он получает данные от моделей, обрабатывает их и передает в представление для отображения. Также презентер принимает пользовательские действия из представления, интерпретирует их и влияет на состояние моделей.\

# Особенности взаимодействия:
  Событийная модель: Все взаимодействия и обновления в проекте осуществляются через события. Модели генерируют события для уведомления об изменениях, которые затем обрабатываются слушателями в представлении или презентере.

# Разделение на слои: Проект разделен на три основных слоя в соответствии с MVP:
  Слой представления (View): отвечает за отображение данных пользователю и обработку пользовательских взаимодействий.
  Слой данных (Model): хранит данные и логику, связанную с их изменением и обработкой.
  Презентер (Presenter): обеспечивает связь между представлением и данными, управляет логикой приложения и предоставляет данные для отображения.

# Пример взаимодействия:
  Инициализация событий: Модели генерируют события при изменении данных или состояния.
  Обработка событий: Презентеры или слушатели событий в представлении реагируют на эти события, обновляя представление или вызывая необходимые операции.
  Изменение данных: Презентеры могут изменять данные в моделях, влияя на состояние приложения и генерируя новые события для обновления представления.

Такая архитектура обеспечивает четкое разделение ответственностей между компонентами приложения, повышает его модульность и облегчает поддержку и расширение кодовой базы.


# Интерфейсы, типы и enum, которые используются в приложении
### Интерфейс Продукта
```
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}
```
### Категоризация продкутов через перечислениеv идентификаторов продуктов и их значений
```
export enum ProductCategory {
	'софт-скил' = 'soft',
	'другое' = 'other',
	'хард-скил' = 'hard',
	'дополнительное' = 'additional',
	'кнопка' = 'button'
}
```
### Интерфейс ProductsData - интерфейс данных продуктов
```
export interface ProductsData {
  products: IProduct[];
  preview: string | null;
  getProduct(productId: string): IProduct;
}
```

### Интерфейс Заказа
```
export interface IOrder {
	payment: string
	email: string
	phone: string
	address: string
	total: number
	items: string[]
}
```
### Интерфейс результата заказа
```
export interface IOrderResult {
	id: string
	total: number
	error?: string
}
```
### Тип данных BasketProduct, который является подмножеством типа Product. Он использует функцию Pick из  для выбора только определённых свойств из типа Product, а именно id, title и price.
```
export type BasketProduct = Pick<Product, "id" | "title" | "price">;
```
### Тип ошибок формы. Этот тип позволяет указывать ошибки валидации для конкретных полей формы, таких как электронная почта, телефон, адрес и метод оплаты.
```
export type FormErrors = {
	email?: string;
	phone?: string;
	address?: string;
	payment?: string;
}
```
### Обобщённый интерфейс списка, представляющий список элементов типа T с общим количеством элементов. Этот интерфейс позволяет создавать списки элементов любого типа T, хранящиеся в массиве items, с общим числом элементов, указанным в total.
```
export interface List<T> {
	items: T[];
	total: number;
}
```
### Интерфейс Элемента списка. Этот интерфейс используется для хранения элементов списка.
```
export type ListItem = {
	index: number;
}
```
### Перечисление, содержащее различные события, используемые для обмена информацией или управления состоянием. Это перечисление определяет различные события, такие как изменение продуктов, открытие продукта в модальном окне, добавление в корзину, открытие и закрытие модального окна, показ корзины, начало заказа, удаление продукта из корзины, выбор метода оплаты, готовность заказа, изменение состояния формы (например, невалидная форма) и очистка заказа.
```
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
```
Интерфейс IAppData - для данных приложения

```
export interface IAppData {
	products: IProduct[];
	basket: IProduct[];
	order: IOrder;
}
```

# Классы
## Класс AppApi - взаимодействие с API приложения.
Свойства
cdn: string — URL CDN.
Конструктор
```
constructor(cdn: string, baseUrl: string, options?: RequestInit)
```
Методы
getProducts(): Promise<List<IProduct>> — получает список продуктов.
makeOrder(order: IOrder): Promise<IOrderResult> — создает заказ.

## Класс Model<T>
Абстрактный класс для модели данных.
Конструктор
```
constructor(data: Partial<T>, protected events: IEvents);
```
data: Partial<T> — частичные данные для инициализации модели.
events: IEvents — объект для управления событиями.

Метод
emitChanges(event: string, payload?: object) — генерирует событие с заданным именем и полезной нагрузкой.
```
emitChanges(event: string, payload?: object): void;
```
event: string — имя события.\
payload: object — данные события (по умолчанию пустой объект).\

## Класс Component<T>
Абстрактный класс для компонентов пользовательского интерфейса.\
Конструктор
```
protected constructor(protected readonly container: HTMLElement);
```
container: HTMLElement — HTML-элемент, содержащий компонент.\
Методы:\
toggleClass(element: HTMLElement, className: string, force?: boolean) — переключает класс элемента.\
element: HTMLElement — HTML-элемент.\
className: string — имя класса.\
force: boolean — если указано, принудительно добавляет или удаляет класс.\
protected setText(element: HTMLElement, value: unknown) — устанавливает текстовое содержимое элемента.
```
protected setText(element: HTMLElement, value: unknown): void;
```
element: HTMLElement — HTML-элемент.\
value: unknown — текстовое содержимое.\

setDisabled(element: HTMLElement, state: boolean) — устанавливает состояние блокировки элемента.\
```
setDisabled(element: HTMLElement, state: boolean): void;
```
element: HTMLElement — HTML-элемент.\
state: boolean — если true, элемент блокируется; если false, блокировка снимается.\

protected setVisible(element: HTMLElement) — делает элемент видимым.\
```
protected setVisible(element: HTMLElement): void;
```
element: HTMLElement — HTML-элемент.\

protected setImage(element: HTMLImageElement, src: string, alt?: string) — устанавливает изображение для элемента.
```
protected setImage(element: HTMLImageElement, src: string, alt?: string): void;
```
element: HTMLImageElement — HTML-элемент изображения.\
src: string — источник изображения.\
alt: string — альтернативный текст (опционально).\

render(data?: Partial<T>): HTMLElement — рендерит данные и возвращает контейнер элемента.
```
render(data?: Partial<T>): HTMLElement;
```
data: Partial<T> — частичные данные для рендеринга (опционально).

## Класс данных - AppData (MODEL) \
Класс для управления данными приложения.\
Свойства:\
products: IProduct[] — список продуктов.\
basket: IProduct[] — корзина.\
order: IOrder — заказ.\
formErrors: FormErrors — ошибки формы.\
Конструктор
```
constructor(data: Partial<IAppData>, events: IEvents, products: IProduct[] = [], basket: IProduct[] = [], order: IOrder)
```
Методы \
setProducts(products: IProduct[]) — устанавливает список продуктов. \
getProducts(): IProduct[] — возвращает список продуктов. \
getBasket(): IProduct[] — возвращает корзину. \
addToBasket(product: IProduct) — добавляет продукт в корзину. \
getTotalPrice(): number — возвращает общую стоимость корзины. \
removeFromBasket(product: IProduct) — удаляет продукт из корзины. \
getOrder(): IOrder — возвращает заказ. \
setOrderField(field: keyof IOrder, value: string) - устанавливает значение поля заказа. \
isPreviousFormValid() — проверяет валидность предыдущей формы. \
setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) — устанавливает значение поля заказа. \
validateOrder(field: keyof IOrder) — валидирует заказ. \
formErrors: FormErrors - возвращает ошибки формы. \
clearBasket() — очищает корзину. \
clearOrder() — очищает заказ.\
\
## Классы отображения (VIEW) \
### Класс PageView - отвечает за отображение основной страницы приложения. \
Свойства:\
basketCounter: number - количество продуктов в корзине.\
products: HTMLElement[] - массив HTML элементов продуктов.\
Конструктор
```
constructor(container: HTMLElement, protected events: IEvents)
```
Методы:\
constructor(root: HTMLElement, events: EventEmitter) - конструктор класса.\
render(products: IProduct[]): void - рендерит список продуктов на странице.\
\
Класс ProductView - отвечает за отображение отдельного товара в каталоге.\
Свойства:\
template: HTMLTemplateElement - HTML-шаблон для рендеринга товара.\
onClick: () => void - функция-обработчик события клика на товар.\
Конструктор
```
constructor(template: HTMLTemplateElement, options: { onClick: () => void })
```
Методы:\
set title(value: string) - устанавливает заголовок продукта.\
set category(value: keyof typeof ProductCategory) - устанавливает категорию товара и добавляет соответствующий класс для стилизации.\
set price(value: string) - устанавливает цену товара.\
set image(value: string) - устанавливает изображение товара.\
set status(status: boolean) - устанавливает статус кнопки добавления товара в корзину.\
\
### Класс ProductViewModal - расширяет класс ProductView и добавляет функционал для отображения модального окна с дополнительной информацией о товаре.\
Свойство _description: HTMLElement - элемент для отображения описания товара в модальном окне.\
Конструктор
```
constructor(container: HTMLElement, actions: IProductActions)
```
set description(value: string) - устанавливает описание товара в модальном окне.\
\
### Класс ProductBasketView - предназначен для отображения информации о товаре в корзине.\
Свойства:\
_index: HTMLElement - элемент для отображения индекса товара.\
_price: HTMLElement - элемент для отображения цены товара.\
_title: HTMLElement - элемент для отображения названия товара.\
_button: HTMLButtonElement - элемент кнопки удаления товара из корзины.\
\
Конструктор
```
constructor(container: HTMLElement, actions: IProductActions)
```
Методы:\
set price(value: number) - устанавливает цену товара в корзине.
set title(value: string) - устанавливает название товара в корзине.
set index(value: number) - устанавливает порядковй номер товара в корзине.
\
\
### Класс Basket - управляет отображением корзины покупок и обработкой событий, связанных с корзиной.\
Свойства:\
basketButton - кнопка открытия корзины.\
basketTitle - заголовок модального окна корзины.\
priceElement - элемент для отображения общей стоимости товаров в корзине.\
Методы:\
```
constructor(container: HTMLElement, events: IEvents)
```
set title(title: string) - eстанавливает заголовок корзины.\
set price(price: number): Устанавливает общую стоимость товаров в корзине.\
\
### Класс BasketView -управляет отображением корзины товаров в пользовательском интерфейсе\
Свойства:\
list - HTML-элемент, содержащий список товаров в корзине.\
_total - HTML-элемент, отображающий общую сумму в корзине.\
button: HTML-элемент кнопки для начала оформления заказа.\
Конструктор
```
constructor(container: HTMLElement, private events: IEvents)
```
Методы:\
set products - проверяет, пуст ли список товаров. Если пуст, заменяет содержимое list на текст "Корзина пуста" и отключает кнопку. Если нет, заменяет содержимое на предоставленный список товаров и включает кнопку.\
set total - устанавливает текст в элемент _total для отображения суммы в корзине. Текст форматируется с добавлением строки "синапсов".\
\
### Класс ContactsForm - наследует от Forms и управляет отображением формы для ввода контактной информации.\
Свойства:\
_inputPhone - поле ввода телефона.\
_inputEmail - поле ввода email.\
Методы:\
```
constructor(container: HTMLFormElement, events: IEvents)
```
set phone(value: string) - устанавливает значение телефона.\
set email(value: string) - устанавливает значение email.\
\
### Класс OrderForm - наследует от Forms и управляет отображением формы для ввода информации о заказе.
Свойства:\
_buttonOnlinePayment - кнопка выбора онлайн оплаты.\
_buttonCashPayment - кнопка выбора оплаты наличными.\
_inputAddress - поле ввода адреса.\
Методы:\
```
constructor(container: HTMLFormElement, events: IEvents)
```
toggleClass(element: HTMLElement, className: string, state: boolean) - переключает класс элемента.
toggleCard(state: boolean) - переключает состояние кнопки онлайн оплаты.\
toggleCash(state: boolean) -переключает состояние кнопки оплаты наличными.\
resetPaymentButtons() - сбрасывает состояние кнопок оплаты.\
togglePaymentMethod(selectedPayment: string) - переключает выбранный метод оплаты.\
set address(value: string) - устанавливает значение адреса.\
set payment(value: string) - устанавливает метод оплаты и вызывает соответствующее событие.\

### Класс SuccessView - управляет отображением сообщения об успешном заказе.\
Свойства:\
_close - HTML-элемент кнопки закрытия сообщения.\
_title - HTML-элемент заголовка сообщения.\
_description - на HTML-элемент описания сообщения.\
Методы:\
set title(value: string) - устанавливает заголовок в окне успешного оформления заказа.\
set description(value: string) - устанавливает описание в окне успешного оформления заказа.\
render(data: ISuccess): HTMLElement - Обновляет заголовок и описание в соответствии с предоставленными данными и возвращает элемент контейнера с обновленным содержимым.\
\
\
## Классы презентеры\
### Класс Forms - для управления общими формами (обрабатывает события, отображает состояние формы)
Свойства:
_submit: Кнопка отправки формы.
_errors: Элемент для отображения ошибок.
Конструктор:\
```
constructor(container: HTMLFormElement, events: IEvents)
```
Методы:\
handleInputChange(evt: Event) - орабатывает изменение ввода в форме.\
handleSubmit(evt: Event) - обрабатывает отправку формы.\
set valid(value: boolean) - устанавливает состояние валидности формы и управляет кнопкой отправки.
onInputChange(field: keyof T, value: string) - вызывает событие при изменении значения в форме.
set errors(value: string) - устанавливает текст ошибок в форме.\
render(state: Partial<T> & IFormState) - отображает состояние формы.\
\
### Класс Modal - управляет отображением и взаимодействием с модальным окном
Свойства:\
_closeButton: Кнопка закрытия модального окна.\
_content: Элемент для отображения содержимого модального окна.\
Конструктор:\
```
constructor(container: HTMLElement, events: IEvents)
```
Методы:\
extractElements(container: HTMLElement) - извлекает элементы модального окна из контейнера.\
handleKeyDown(event: KeyboardEvent) - обрабатывает нажатие клавиши "Escape" для закрытия модального окна.\
handleClickOutside(event: MouseEvent) - обрабатывает клик вне модального окна для его закрытия.\
set content(value: HTMLElement) - устанавливает содержимое модального окна.\
render(data: IModal) - обновляет данные модального окна и отображает его.\
open() - открывает модальное окно.\
close() - закрывает модальное окно.\
