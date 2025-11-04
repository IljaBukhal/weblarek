# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
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
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

#### type TPayment

`'card' | 'cash' | ''`  
Литеральный тип, ограничивающий доступные значения для способа оплаты.

#### type TCategory

`'софт-скил' | 'хард-скил' | 'кнопка' | 'дополнительное' | 'другое'`  
Литеральный тип, ограничивающий доступные значения для категории товара.  

#### type TButtonState

`'active' | 'inactive'`  
Литеральный тип, ограничивающий доступные значения для выбора состояния кнопки.  

#### interface IProduct

Описывает товар.  
Поля, описанные интерфейсом:  
`id: string;` - id товара.  
`description: string;` - описание товара.  
`image: string;` - путь к изображению, иллюстрирующему товар.  
`title: string;` - наименование товара.  
`category: string;` - категория товара.  
`price: number | null;` - стоимость товара. null если цена не предусмотренна.

#### interface IBuyer

Описывает данные покупателя.  
Поля, описанные интерфейсом:  
`payment: TPayment;` - способ оплаты.  
`email: string;` - email пользователя.  
`phone: string;` - номер телефона пользователя.
`address: string;` - адрес пользователя.

#### interface IOrder

Описывает отсылаемый на сервер объект заказа. Наследует интерфейсу IBuyer.  
`total: number;` - сумма всех товаров в заказе.  
`items: string[];` - массив id товаров в заказе.

#### interface IProductList 

Описывает объект, приходящий в ответ на get запрос в api.  
Поля, описанные интерфейсом:  
`total: number;` - сумма всех товаров в заказе.  
`items: IProduct[];` - массив объектов, содержащих данные о продуктах.

#### interface IValidationResult

Описывает объект, возвращаемый в результате валидации данных покупателя. Поля схожи с интерфейсом IBuyer, но является необязательными. В качестве значений для полей предполагаются ошибки валидации.  
Поля, описанные интерфейсом:  
`payment?: string;` - способ оплаты.  
`email?: string;` - email пользователя.  
`phone?: string;` - номер телефона пользователя.
`address?: string;` - адрес пользователя.

#### interface IRespOrder

Описывает объект, возвращаемый в результате post запроса к api.  
Поля, описанные интерфейсом:  
`id?: string;` - id заказа.  
`total?: number;` - сумма заказа.  
`error?: string;` - ошибка запроса.

### Модели данных

#### Класс Catalog

Хранение товаров, которые можно купить в приложении.  
Поля класса:  
`protected products: IProduct[];` - массив продуктов.  
`protected selectedCard: IProduct | undefined;` - содержит объект описываемый интерфейсом IProduct, если товар не выбран - хранит undefined.  

Конструктор класса: пуст.

Методы класса:
`saveProducts(products: IProduct[]): void` - сохраняет переданный в качестве аргумента массив товаров в каталог.  
`getProducts(): IProduct[]` - возвращает массив товаров, находящихся в каталоге.  
`getProductById(id: string): IProduct | undefined` - возвращает товар из каталога по его IP. Если товар не найден, возвращается undefined.  
`saveProduct(product: IProduct): void` - сохраняет товар, переданный в качестве аргумента, для подробного отображения.  
`getSelectedCard(): IProduct | undefined` - возвращает товар для подробного отображения. Если товар не был сохранен для подробного отображения, возвращается undefined.  

#### Класс Basket

Хранение товаров, которые пользователь выбрал для покупки.  
Поля класса:
`protected _selectedProducts: IProduct[];` - хранит массив товаров, выбранных пользователем для покупки.  

Конструктор класса:  
```ts
constructor(products: IProduct[] = []) {
  this._selectedProducts = products;
}
```

Методы класса:  
`getSelectedProducts(): IProduct[]` - возвращает массив выбранных пользователем для покупки товаров.  
`addProductToBasket(product: IProduct): void` - добавляет переданный в качестве аргумента товар в корзину.
`removeProductFromBasket(id: string): void` - удаляет из корзины товар по переданному в качестве аргумента ID.
`clearBasket(): void` - очищает корзину.
`getTotalPrice(): number` - возвращает общую стоимость элементов корзины.
`getNumberProductsInBasket(): number` - возвращает количество товаров в корзине.
`isProductInBasket(id: string): boolean` - проверяет наличие товара в корзине.

#### Класс Buyer

Хранение данных покупателя, которые тот должен указать при оформлении заказа. Класс имплементирует интерфейс IBuyer.  
Поля класса:  
`public payment: TPayment = '';` - хранит способ оплаты товара.  
`public email: string = '';` - хранит email покупателя.  
`public phone: string = '';` - хранит номер телефона покупателя.  
`public address: string = '';` - хранит адрес покупателя.  

Конструктор класса:
```ts
constructor(buyer?: IBuyer) {
  if (buyer) {
      this.payment = buyer.payment;
      this.email = buyer.email;
      this.phone = buyer.phone;
      this.address = buyer.address;
  }
}
```

Методы класса:
`changePayment(newValue: TPayment): void` - меняет систему оплаты.  
`changeEmail(newValue: string): void` - меняет email покупателя.  
`changePhone(newValue: string): void` - меняет телефон покупателя.  
`changeAddress(newValue: string): void` - меняет адрес покупателя.
`getBuyerData(): IBuyer` - возвращает объект с данными пользователя.
`clearBuyerData(): void` - очищает данные пользователя. Все поля данного класса принимает значение: ''.  
`validateData(): IValidationResult` - возвращает объект с ошибками валидации. Объект может быть пустым, если ошибки в данных отсутствуют.

### Слой коммуникации

#### Класс Connection

Отправляет get и pos запросы на API. При помощи композиции задействует функционал класса API:
`public api: IApi;`

Конструктор класса:
```ts
constructor(api: IApi) {
  this.api = api
}
```

Методы класса:  
`getProducts(): Promise<IProductList>` - Пользуясь методом get класса Api, посылает get запрос на сервер. Возвращает промис с товарами.  
`postOrder(data: IOrder): Promise<IRespOrder>` - Пользуясь методом post класса Api, посылает post запрос на сервер.

### Слой представления

#### Класс Header

Отвечает за отображение верхней части страницы. Наследует классу Component, интерфейс для рендера:  
```ts
interface HeaderData {
   counter: number;
}
```

Конструктор класса:  
```ts
constructor(container: HTMLElement, protected events: IEvents) {
      super(container);

      this.basketButton = ensureElement<HTMLButtonElement>(
         '.header__basket',
         this.container
      );
      this.counterElement = ensureElement<HTMLElement>(
         '.header__basket-counter',
         this.container
      );

      this.basketButton.addEventListener('click', () => {
         this.events.emit('basket:open');
      });
   }
```

Сеттеры класса:  
`set counter(value: number)` - меняет значение счётчика на иконке корзины.  

#### Класс Gallery

Отвечает за отображение верхней части страницы. Наследует классу Component, интерфейс для рендера:  
```ts
interface GalleryData {
   catalog: HTMLElement[];
}
```

Конструктор класса:
```ts
constructor(protected container: HTMLElement) {
  super(container);
}
```

Сеттеры класса:  
`set catalog (cards: HTMLElement[])` - отображает карточки товаров в галерее.

#### Класс Card

Абстрактный класс. Отвечает за отображение карточек товаров. Наследует классу Component, интерфейс для рендера:  
```ts
interface CardData extends IProduct {
   index?: number
}
```

Конструктор класса:  
```ts
   constructor(container: HTMLElement, protected events: IEvents){
      super(container);

      this.cardElem = this.container;
      this.titleElem = ensureElement(
         '.card__title', 
         this.cardElem
      );
      this.priceElem = ensureElement(
         '.card__price', 
         this.cardElem
      );
   }
```

Сеттеры класса:
`set id(id: string)` - устанавливает id элементу карточки.  
`set title(title: string)` - устанавливает textContent для элемента наименования товара.  
`set price(price: number | null )` - устанавливает textContent для элемента стоимости товара.  

#### Класс GalleryCard
Отвечает за отображение карточек товаров, в галерее. Наследует классу Card.

Конструктор класса:
```ts
   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

      this.container.addEventListener('click', (evt) => {
         this.events.emit('gallery-card:open', evt)
      });

      this.categoryElem = ensureElement(
         '.card__category',
         this.cardElem
      );
      this.imageElem = ensureElement(
         '.card__image',
         this.cardElem
      );
   }
```

Сеттеры класса
`set category(category: TCategory)` - устанавливает textContent для элемента категории товара.  
`set image(src: string)` - устанавливает изображение товара.  

#### Класс PreviewCard

Отвечает за отображение карточки товара, открытого для предварительного просмотра. Наследует классу Card.

Конструктор класса:
```ts
   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

      this.imageElem = ensureElement(
         '.card__image',
         this.container
      );
      this.categoryElem = ensureElement(
         '.card__category',
         this.container
      );
      this.descriptionElem = ensureElement(
         '.card__text',
         this.container
      );
      this.buttonElem = ensureElement(
         '.card__button',
         this.container
      );
      this.buttonElem.addEventListener('click', () => {
         this.events.emit('card:addInBasket');
      });
   }
```

Сеттеры класса:
`set category(category: TCategory)` - устанавливает textContent для элемента категории товара.  
`set image(src: string)` - устанавливает изображение товара.  
`set description(value: string)` - устанавливает textContent для элемента описания товара.  

Методы класса
`setButtonSate(value: TButtonState)` - позволяет изменить состояние кнопки.   

#### Класс BasketCard

Отвечает за отображение карточек товаров, в корзине. Наследует классу Card.

Конструктор класса:
```ts
constructor(container: HTMLElement, events: IEvents) {
  super(container, events);
  
  this.indexElem = ensureElement(
      '.basket__item-index',
      this.container
  );
  this.deleteBtn = ensureElement(
      '.card__button',
      this.container
  );
  this.deleteBtn.addEventListener('click', (evt: MouseEvent) => {
      this.events.emit('basked-card:delete', evt);
  });
}
```

Сеттеры класса:
`set index(index: number)` - устанавливает порядковый номер элемента в корзине.

#### Класс Modal

Отвечает за отображение модальных окон. Для рендера принимает рендер экземпляра другого класса, который использует как наполнение. Наследует классу Component, интерфейс для рендера:
```ts
interface ModalData {
   display: boolean;
   content: HTMLElement;
}
```

Конструктор класса:
```ts
   constructor(container: HTMLElement, protected events: IEvents) {
      super(container);

      this.container.addEventListener('click', (evt) => {
         const targetElem = evt.target as HTMLElement;
         if (targetElem.classList.contains('modal'))
            this.events.emit('modal:close');
      });

      this.closeButton = ensureElement(
         '.modal__close',
         this.container
      );
      this.closeButton.addEventListener('click', () => {
         this.events.emit('modal:close');
      });

      this.contentContainer = ensureElement(
         '.modal__content',
         this.container
      );
   }
```

Сеттеры класса:
`set display(value: boolean)` - переключает отображение модального окна.  
`set content(content: HTMLElement)` - принимает рендер экземпляра другого класса, который использует как наполнение.  

#### Класс BasketMdlContent

Отвечает за отображение содержимого окна корзины. Наследует классу Component, интерфейс для рендера:
```ts
interface BasketMdlContentData {
   selectedProducts: HTMLElement[],
   price: number
}
```

Конструктор класса:
```ts
   constructor(container: HTMLElement, protected events: IEvents) {
      super(container);

      this.basketList = ensureElement(
         '.basket__list',
         this.container
      );
      this.basketButton = ensureElement(
         '.basket__button',
         this.container
      );
      this.basketButton.addEventListener('click', () => {
         this.events.emit('basket:confirmation');
      });

      this.basketPrice = ensureElement(
         '.basket__price',
         this.container
      );
   }
```

Сеттеры класса:
`set selectedProducts(products: HTMLElement[])` - устанавливает карточки товаров в корзине.  
`set price(price: number)` - устанавливает textContent элемента стоимости заказа.

Методы класса:
`setButtonSate(value: TButtonState)` -  позволяет изменить состояние кнопки.

#### Класс SuccessMdlContent

Отвечает за отображение содержимого окна завершения заказа. Наследует классу Component, интерфейс для рендера:
```ts
interface SuccessMdlContentData {
   synapses: number
}
```

Конструктор класса:
```ts
   constructor(container: HTMLElement, protected events: IEvents) {
      super(container);

      this.descriptionElem = ensureElement(
         '.order-success__description',
         this.container
      );
      this.buttonElem = ensureElement(
         '.order-success__close',
         this.container
      );
      this.buttonElem.addEventListener('click', () => {
         this.events.emit('modal:close');
      });
   }
```

Сеттеры класса:
`set synapses(value: number)` - устанавливает textContent для элемента итоговой суммы заказа. 

#### Класс Form

Абстрактный класс. Отвечает за отображение форм. Наследует классу Component, интерфейс для рендера:  
```ts
interface FormData {
   errorMessage: string,
   paymentMethod: TPayment,
   address: string,
   email: string,
   phone: string
}
```

Конструктор класса:
```ts
constructor(container: HTMLElement, protected events: IEvents) {
   super(container);

   this.modalActionsElem = ensureElement(
      '.modal__actions',
      this.container
   );
   this.submitButton = ensureElement(
      '.button',
      this.modalActionsElem
   );
   this.formErrElem = ensureElement(
      '.form__errors',
      this.modalActionsElem
   );
}
```

Сеттеры класса:
`set errorMessage(value: string)` - устанавливает сообщение об ошибке.  

Методы класса:
`setSubmitButtonSate(value: TButtonState)` - позволяет изменить состояние кнопки.  

#### Класс OrderForm

Отвечает за отображение формы заказа. Наследует классу Form.

Конструктор класса:
```ts
   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

      this.cardButton = ensureElement(
         'button[name="card"]',
         this.container
      );
      this.cardButton.addEventListener('click', () => {
         this.events.emit('card-button:select');
         this.events.emit('order-form:validation', {
            'cardButton': this.cardButton,
            'cashButton': this.cashButton,
            'inputAddress': this.inputAddress
            });
      });

      this.cashButton = ensureElement(
         'button[name="cash"]',
         this.container
      );
      this.cashButton.addEventListener('click', () => {
         this.events.emit('cash-button:select');
         this.events.emit('order-form:validation', {
            'cardButton': this.cardButton,
            'cashButton': this.cashButton,
            'inputAddress': this.inputAddress
            });
      });

      this.inputAddress = ensureElement(
         'input[name="address"]',
         this.container
      ) as HTMLInputElement;
      this.inputAddress.addEventListener('input', () => {
         this.events.emit('order-form:validation', {
            'cardButton': this.cardButton,
            'cashButton': this.cashButton,
            'inputAddress': this.inputAddress
         });
      });

      this.container.addEventListener('submit', (evt) => {
         this.events.emit('order-form:submit', evt);
      })
   }
```

Сеттеры класса:
`set paymentMethod(value: TPayment)` - активирует одну из кнопок выбора типа оплаты.  
`set address(value: string)` - заполняет переданным значением поле ввода адреса.  

#### Класс ContactsForm 

Отвечает за отображение формы сбора контактов. Наследует классу Form.

Конструктор класса:
```ts
   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

      this.container.addEventListener('submit', (evt: SubmitEvent) => {
         this.events.emit('contacts-form:submit', evt);
      })

      this.inputEmail = ensureElement(
         'input[name="email"]',
         this.container
      ) as HTMLInputElement;
      this.inputEmail.addEventListener('input', () => {
         this.events.emit('contacts-form:validation', {
            'inputEmail': this.inputEmail,
            'inputPhone': this.inputPhone
         });
      })

      this.inputPhone = ensureElement(
         'input[name="phone"]',
         this.container
      ) as HTMLInputElement;
      this.inputPhone.addEventListener('input', () => {
         this.events.emit('contacts-form:validation', {
            'inputEmail': this.inputEmail,
            'inputPhone': this.inputPhone
         });
      })
   }
```

Сеттеры класса:
`set email(value: string)` - заполняет переданным значением поле ввода электронной почты.  
`set phone(value: string)` - заполняет переданным значением поле ввода номера телефона.  


### Презентер

Место соединения данных и представления. Находящихся в файле main.ts.

После импорта необходимых констант, классов, методов, создания экземпляров классов и поиска элементов на странице - идёт деактивация кнопок в контенте корзины и превью карты, вешается событие для закрытия модальных окон, а событию дается обработчик:
```ts
previewCardContent.setButtonSate('inactive');
basketContent.setButtonSate('inactive');

document.addEventListener('keydown', (evt) => {
	if (evt.key === 'Escape')
		events.emit('modal:close');
});

events.on('modal:close', () => {
	modal.render({ 'display': false });
});
```

Рендерится Header:
```ts
header.render({
	'counter': basket.getNumberProductsInBasket()
});
```

Вешаются обработчики на события basket:
```ts 
events.on('basket:open', () => {
	let cardIndex: number = 1;
	basketContent.setButtonSate(
		basket.getNumberProductsInBasket() > 0
		? 'active'
		: 'inactive'
	)
	const basketContentRender = basketContent.render({
		'price': basket.getTotalPrice(),
		'selectedProducts': basket.getSelectedProducts()
			.map((product) => new BasketCard(
				cloneTemplate('#card-basket'),
				events
			).render({
				'id': product.id,
				'title': product.title,
				'price': product.price,
				'index': cardIndex++
			}))
	});

	modal.render({
		'display': true,
		'content': basketContentRender
	});
});

events.on('basked-card:delete', (evt: PointerEvent) => {
	const selectedCard = (evt.currentTarget as HTMLElement)
		.closest('.card') as HTMLElement;
	const idSelectedCard = selectedCard.id;

	basket.removeProductFromBasket(idSelectedCard);
	header.render({
		'counter': basket.getNumberProductsInBasket()
	});
	events.emit('basket:open');
});

events.on('basket:confirmation', () => {
	modal.render({
		'display': true,
		'content': orderFormContent.render()
	});
});
```

Делается запрос товаров на сервер и заполняется ими галерея. Вешаются обработчики на события card:
```ts
connections.getProducts()
	.then((products) => {
		catalog.saveProducts(products.items);
		return catalog.getProducts();
	}).then((products) => {
		const galleryElements: HTMLElement[] = [];

		products.forEach((item) => {
			galleryElements.push(new GalleryCard(
				cloneTemplate('#card-catalog'),
				events
			).render({
				"id": item.id,
            "description": item.description,
            "image": item.image,
            "title": item.title,
            "category": item.category,
            "price": item.price
			}));
		});

		gallery.render({
			'catalog': galleryElements
		});
	});

events.on('gallery-card:open', (evt: PointerEvent) => {
	const selectedCard: HTMLElement = evt
		.currentTarget as HTMLElement;
	const idSelectedCard: string = selectedCard.id;
	catalog.selectProduct(
		catalog.getProductById(idSelectedCard) as IProduct
	)

	if (catalog.getSelectedCard()?.price)
		previewCardContent.setButtonSate('active');
	else 
		previewCardContent.setButtonSate('inactive');

	if (basket.isProductInBasket(
		catalog.getSelectedCard()?.id as string
	)) previewCardContent.setButtonSate('inactive');

	modal.render({
		'display': true,
		'content': previewCardContent.render({
			"id": catalog.getSelectedCard()?.id,
			"description": catalog.getSelectedCard()?.description,
			"image": catalog.getSelectedCard()?.image,
			"title": catalog.getSelectedCard()?.title,
			"category": catalog.getSelectedCard()?.category,
			"price": catalog.getSelectedCard()?.price
		})
	});
});

events.on('card:addInBasket', () => {
	basket.addProductToBasket(
		catalog.getSelectedCard() as IProduct
	);
	events.emit('modal:close');
	header.render({ 'counter': basket.getNumberProductsInBasket() });
})
```

Вешаются обработчики на события, необходимые для работы с формой заказа:
```ts
events.on('order-form:validation', (event: {
	cashButton: HTMLElement,
	cardButton: HTMLElement,
	inputAddress: HTMLInputElement
}) => {
	if (
		(
			!event.cardButton.classList.contains('button_alt-active')
			&& !event.cashButton.classList.contains('button_alt-active')
		) || !event.inputAddress.value.length
	) {
		orderFormContent.setSubmitButtonSate('inactive');
		orderFormContent.errorMessage = 'Выберите способ оплаты и введите адрес проживания';
	} else {
		orderFormContent.setSubmitButtonSate('active');
		orderFormContent.errorMessage = '';
	}
});

events.on('card-button:select', () => {
	orderFormContent.paymentMethod = 'card';
});

events.on('cash-button:select', () => {
	orderFormContent.paymentMethod = 'cash';
});

events.on('order-form:submit', (evt: SubmitEvent) => {
	evt.preventDefault();
	const buttonCard: HTMLElement = ensureElement(
		'button[name="card"]',
		evt.currentTarget as HTMLElement
	);
	const inputAddress: HTMLInputElement = ensureElement(
		'input[name="address"]',
		evt.currentTarget as HTMLElement
	) as HTMLInputElement;

	if (buttonCard.classList.contains('button_alt-active')) {
		buyer.changePayment('card');
	} else buyer.changePayment('cash');

	buyer.changeAddress(inputAddress.value);
	modal.render({
		'display': true,
		'content': contactsFormContent.render()
	});
});
```
Вешаются обработчики на события, необходимые для работы с формой сбора контактов:
```ts
events.on('contacts-form:validation', (event: {
	inputEmail: HTMLInputElement,
	inputPhone: HTMLInputElement
}) => {
	if (
		!event.inputEmail.value.length
		|| !event.inputPhone.value.length
	) {
		contactsFormContent.setSubmitButtonSate('inactive');
		contactsFormContent.errorMessage = 'Введите адрес электронной почты и номер телефона';
	} else {
		contactsFormContent.setSubmitButtonSate('active');
		contactsFormContent.errorMessage = '';
	}
});

events.on('contacts-form:submit', (evt: SubmitEvent) => {
	evt.preventDefault();
	
	const inputEmail: HTMLInputElement = ensureElement(
		'input[name="email"]',
		evt.currentTarget as HTMLElement
	) as HTMLInputElement;
	const inputPhone: HTMLInputElement = ensureElement(
		'input[name="phone"]',
		evt.currentTarget as HTMLElement
	) as HTMLInputElement;

	buyer.changeEmail(inputEmail.value);
	buyer.changePhone(inputPhone.value);
	
	connections.postOrder({ 
		payment: buyer.payment,
		email: buyer.email,
		phone: buyer.phone,
		address: buyer.address,
		items: basket.getSelectedProducts()
			.map((product) => product.id),
		total: basket.getTotalPrice()
	 })
	 .then((data) => console.log(data))
	 .catch((error) => console.error(error));

	modal.render({
		'display': true,
		'content': successContent.render({
			'synapses': basket.getTotalPrice()
		})
	});

	basket.clearBasket();
	header.render({ 'counter': basket.getNumberProductsInBasket() });
	orderFormContent.render({
		'paymentMethod': '',
		'address': ''
	});
	contactsFormContent.render({
		'email': '',
		'phone': '',
	});
});
```