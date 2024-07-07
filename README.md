# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/types.ts — файл с типами
- src/types.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

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

•	HTML, SCSS, TS, Webpack.

# Архитектура Проекта

Проект организован в соответствии с архитектурной парадигмой MVP (Model-View-Presenter), где взаимодействие между компонентами осуществляется через событийную модель. В рамках данной архитектуры:

  Модели (Model) инициируют события и хранят данные, предоставляя основу для обработки бизнес-логики и управления состоянием.

  Представление (View) отвечает за отображение данных и взаимодействие с пользователем. Оно реагирует на события, генерируемые моделями, и передает данные на уровень презентера для обработки.

  Презентер (Presenter) является посредником между моделями и представлением. Он получает данные от моделей, обрабатывает их и передает в представление для отображения. Также презентер принимает пользовательские действия из представления, интерпретирует их и влияет на состояние моделей.

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


# Базовый код
# API
Класс Api предназначен для упрощения выполнения HTTP запросов к заданному baseUrl с определёнными опциями запроса. Класс предоставляет методы get и post для выполнения GET и POST запросов к указанному API, а также защищённый метод _request для отправки произвольных запросов с поддержкой различных HTTP методов (GET, POST, PUT, DELETE). Класс также содержит метод handleResponse для обработки ответа от сервера, возвращающий либо данные, либо сообщение об ошибке.

Тип ApiPostMethods — строковый литерал типа, ограниченный тремя возможными значениями: 'POST', 'PUT' и 'DELETE'. Эти значения отражают HTTP методы, используемые для взаимодействия с API (создание, обновление и удаление данных). Этот тип используется для определения допустимых HTTP методов в методах класса Api.

Обощенный интрефейс ApiListResponse<Type> представляет структуру ответа API, содержащего список элементов типа Type и общее количество элементов total. Используется для обработки ответов от API, которые включают списки элементов с информацией об общем числе элементов.

# Брокер событий
EventName: тип, который может быть либо строкой, либо регулярным выражением. Он используется для указания имени события при подписке на события.

Subscriber: тип функции обратного вызова, который используется для обработки событий.

EventEmitter: класс, пкоторый позволяет подписываться на события, отправлять события. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

IEvents: интерфейс, который определяет методы, которые должен реализовать класс EventEmitter:

```
export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```
  on: метод для подписки на событие с указанием типа данных T, который передается в коллбэк функцию.
  emit: метод для инициирования события с опциональными данными типа T.
  trigger: метод, возвращающий функцию, которая при вызове инициирует событие с указанным именем и контекстом данных типа T.

Класс EventEmitter представляет собой реализацию брокера событий. Он предоставляет методы для подписки (on), отписки (off), инициирования (emit) событий, а также возможность подписки на все события (onAll) и генерации событий при вызове определенных функций (trigger). Класс использует Map для хранения подписчиков событий различных типов (EventName), что обеспечивает эффективное управление и распределение данных событий.

# Типы данных, которые используются в приложении
Интерфейс Продукта
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
Категоризация продкутов через перечислениеv идентификаторов продуктов и их значений
```
export enum ProductCategory {
	SOFT_SKILL = 'soft',
	OTHER = 'other',
	HARD_SKILL = 'hard',
	ADDITIONAL = 'additional',
	BUTTON = 'button'
}
```
Интерфейс Заказа
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
Интерфейс результата заказа
```
export interface IOrderResult {
	id: string
	total: number
	error?: string
}
```
Тип данных BasketProduct, который является подмножеством типа Product. Он использует функцию Pick из  для выбора только определённых свойств из типа Product, а именно id, title и price.
export type BasketProduct = Pick<Product, "id" | "title" | "price">;

Тип ошибок формы. Этот тип позволяет указывать ошибки валидации для конкретных полей формы, таких как электронная почта, телефон, адрес и метод оплаты.
```
export type FormErrors = {
	email?: string;
	phone?: string;
	address?: string;
	payment?: string;
}
```
Обобщённый интерфейс списка, представляющий список элементов типа T с общим количеством элементов. Этот интерфейс позволяет создавать списки элементов любого типа T, хранящиеся в массиве items, с общим числом элементов, указанным в total.
```
export interface List<T> {
	items: T[];
	total: number;
}
```
Интерфейс Элемента списка. Этот интерфейс используется для хранения элементов списка.
```
export type ListItem = {
	index: number;
}
```
Перечисление, содержащее различные события, используемые для обмена информацией или управления состоянием. Это перечисление определяет различные события, такие как изменение продуктов, открытие продукта в модальном окне, добавление в корзину, открытие и закрытие модального окна, показ корзины, начало заказа, удаление продукта из корзины, выбор метода оплаты, готовность заказа, изменение состояния формы (например, невалидная форма) и очистка заказа.
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

Класс AppApi
Класс для взаимодействия с API приложения.
Свойства
cdn: string — URL CDN.
Конструктор
```
constructor(cdn: string, baseUrl: string, options?: RequestInit)
```
Методы
getProducts(): Promise<List<IProduct>> — получает список продуктов.
makeOrder(order: IOrder): Promise<IOrderResult> — создает заказ.

Класс Model<T>
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
event: string — имя события.
payload: object — данные события (по умолчанию пустой объект).

Класс Component<T>
Абстрактный класс для компонентов пользовательского интерфейса.
Конструктор
```
protected constructor(protected readonly container: HTMLElement);
```
container: HTMLElement — HTML-элемент, содержащий компонент.
Методы
toggleClass(element: HTMLElement, className: string, force?: boolean) — переключает класс элемента.
```
toggleClass(element: HTMLElement, className: string, force?: boolean): void;
```
element: HTMLElement — HTML-элемент.
className: string — имя класса.
force: boolean — если указано, принудительно добавляет или удаляет класс.

protected setText(element: HTMLElement, value: unknown) — устанавливает текстовое содержимое элемента.
```
protected setText(element: HTMLElement, value: unknown): void;
```
element: HTMLElement — HTML-элемент.
value: unknown — текстовое содержимое.

setDisabled(element: HTMLElement, state: boolean) — устанавливает состояние блокировки элемента.
```
setDisabled(element: HTMLElement, state: boolean): void;
```
element: HTMLElement — HTML-элемент.
state: boolean — если true, элемент блокируется; если false, блокировка снимается.

protected setVisible(element: HTMLElement) — делает элемент видимым.
```
protected setVisible(element: HTMLElement): void;
```
element: HTMLElement — HTML-элемент.

protected setImage(element: HTMLImageElement, src: string, alt?: string) — устанавливает изображение для элемента.
```
protected setImage(element: HTMLImageElement, src: string, alt?: string): void;
```
element: HTMLImageElement — HTML-элемент изображения.
src: string — источник изображения.
alt: string — альтернативный текст (опционально).

render(data?: Partial<T>): HTMLElement — рендерит данные и возвращает контейнер элемента.
```
render(data?: Partial<T>): HTMLElement;
```
data: Partial<T> — частичные данные для рендеринга (опционально).

Класс AppData
Класс для управления данными приложения.
Свойства:
products: IProduct[] — список продуктов.
basket: IProduct[] — корзина.
order: IOrder — заказ.
formErrors: FormErrors — ошибки формы.
Конструктор
```
constructor(data: Partial<IAppData>, events: IEvents, products: IProduct[] = [], basket: IProduct[] = [], order: IOrder)
```
Методы
setProducts(products: IProduct[]) — устанавливает список продуктов.
getProducts() — возвращает список продуктов.
getBasket() — возвращает корзину.
addToBasket(product: IProduct) — добавляет продукт в корзину.
getTotalPrice() — возвращает общую стоимость корзины.
removeFromBasket(product: IProduct) — удаляет продукт из корзины.
getOrder() — возвращает заказ.
isPreviousFormValid() — проверяет валидность предыдущей формы.
setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) — устанавливает значение поля заказа.
validateOrder(field: keyof IOrder) — валидирует заказ.
clearBasket() — очищает корзину.
clearOrder() — очищает заказ.
