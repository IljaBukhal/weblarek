import { BasketCard } from './components/view/Cards/BasketCard';
import { GalleryCard } from './components/view/Cards/GalleryCard';
import { PreviewCard } from './components/view/Cards/PreviewCard';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modals/Modal';
import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { BasketMdlContent } from './components/view/Modals/BasketMdlContent';
import { SuccessMdlContent } from './components/view/Modals/SuccessMdlContent';
import { Header } from './components/view/Header';
import { OrderForm } from './components/view/Forms/OrderForm';
import { ContactsForm } from './components/view/Forms/ContactsForm';
import { IApi, IProduct } from './types';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { Connection } from './components/Connection';
import { EventEmitter } from './components/base/Events';
import { Basket } from './components/models/Basket';
import { Catalog } from './components/models/Catalog';
import { Buyer } from './components/models/Buyer';

const api: IApi = new Api(API_URL);
const connections = new Connection(api);

const catalog = new Catalog();
const basket = new Basket();
const buyer = new Buyer();

const events = new EventEmitter();

const headerElem = ensureElement('.header');
const galleryElem = ensureElement('.gallery');
const modalElem = ensureElement('#modal-container');

const header = new Header(headerElem, events);
const gallery = new Gallery(galleryElem);
const modal = new Modal(modalElem, events);

const previewCardTemplate = cloneTemplate('#card-preview');
const basketTemplate = cloneTemplate('#basket');
const orderFormTemplate = cloneTemplate('#order');
const contactsFormTemplate = cloneTemplate('#contacts')
const successTemplate = cloneTemplate('#success');

const previewCardContent = new PreviewCard(previewCardTemplate, events);
const basketContent = new BasketMdlContent(basketTemplate, events);
const orderFormContent = new OrderForm(orderFormTemplate, events);
const contactsFormContent = new ContactsForm(contactsFormTemplate, events);
const successContent = new SuccessMdlContent(successTemplate, events);

previewCardContent.setButtonSate('inactive');
basketContent.setButtonSate('inactive');

document.addEventListener('keydown', (evt) => {
	if (evt.key === 'Escape')
		events.emit('modal:close');
});

events.on('modal:close', () => {
	modal.render({ 'display': false });
});

// * Header

header.render({
	'counter': basket.getNumberProductsInBasket()
});

// * Basket

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

// * Gallery

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

// * OrderForm

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

// * ContactsForm

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