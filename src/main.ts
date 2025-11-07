import './scss/styles.scss';
import { BasketCard } from './components/view/Cards/BasketCard';
import { GalleryCard } from './components/view/Cards/GalleryCard';
import { PreviewCard } from './components/view/Cards/PreviewCard';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modals/Modal';
import { cloneTemplate, ensureElement } from './utils/utils';
import { BasketMdlContent } from './components/view/Modals/BasketMdlContent';
import { SuccessMdlContent } from './components/view/Modals/SuccessMdlContent';
import { Header } from './components/view/Header';
import { OrderForm } from './components/view/Forms/OrderForm';
import { ContactsForm } from './components/view/Forms/ContactsForm';
import { IApi, IProduct, TPayment } from './types';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { Connection } from './components/Connection';
import { EventEmitter } from './components/base/Events';
import { Basket } from './components/models/Basket';
import { Catalog } from './components/models/Catalog';
import { Buyer } from './components/models/Buyer';

const api: IApi = new Api(API_URL);
const connections = new Connection(api);

const events = new EventEmitter();

const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);

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

function closeModal(): void {
	modal.render({ 'display': false });
}

function getRenderBasketContent(): HTMLElement {
	let cardCounter: number = 1;
	basketContent.setButtonSate(
		basket.getNumberProductsInBasket()
		? 'active'
		: 'inactive'
	);
	const selectedProducts: HTMLElement[] = basket
		.getSelectedProducts().map((product) => {
			return new BasketCard(cloneTemplate('#card-basket'), events)
			.render({
				'index': cardCounter++,
				'title': product.title,
				'price': product.price,
				'id': product.id
			})
		});

	const basketContentRender = basketContent.render({
		'selectedProducts': selectedProducts,
		'price': basket.getTotalPrice()
	});
	return basketContentRender;
}

header.render({
	'counter': basket.getNumberProductsInBasket()
});

connections.getProducts()
	.then((products) => {
		catalog.saveProducts(products.items);
	})
	.finally(() => {
		gallery.render({
			'catalog': catalog.getProducts()
				.map((product) => new GalleryCard(
					cloneTemplate('#card-catalog'), events).render({
						"id": product.id,
						"image": product.image,
						"title": product.title,
						"category": product.category,
						"price": product.price
					}))
		});
	});

events.on('modal:close', () => {
	modal.render({ 'display': false });
});

events.on(
	'gallery-card:select',
	(evt: { cardElement: HTMLElement}) => {
		const selectedProduct = catalog.getProductById(
			evt.cardElement.id
		);
		catalog.selectProduct(selectedProduct as IProduct);
	}
);

events.on('selected-product:changing', () => {
	const selectedCard = catalog.getSelectedCard();

	if (basket.isProductInBasket(
			selectedCard?.id as string
		)) {
		previewCardContent.setButtonSate('delete');
	} else if (selectedCard?.price === null) {
		previewCardContent.setButtonSate('unavailable');
	} else {
		previewCardContent.setButtonSate('buy');
	}

	modal.render({
		'display': true,
		'content': previewCardContent.render({
			'category': selectedCard?.category,
			'description': selectedCard?.description,
			'id': selectedCard?.id,
			'image': selectedCard?.image,
			'price': selectedCard?.price,
			'title': selectedCard?.title
		})
	});
})

events.on('preview-card-btn:pressing', () => {
	const selectedCard = catalog
		.getSelectedCard() as IProduct;

	if (basket.isProductInBasket(selectedCard.id))
		basket.removeProductFromBasket(selectedCard.id);
	else
		basket.addProductToBasket(selectedCard);

	closeModal();
});

events.on('basket-contents:changing', () => {
	header.render({
		'counter': basket.getNumberProductsInBasket()
	});
});

events.on('open-basket-button:pressing', () => {
	modal.render({
		'display': true,
		'content': getRenderBasketContent()
	});
});

events.on('basked-delete-card-btn:pressing', (evt: MouseEvent) => {
	const pressedButton = evt.currentTarget as HTMLElement;
	const card = pressedButton.closest('.card') as HTMLElement;
	basket.removeProductFromBasket(card.id);
	modal.render({
		'content': getRenderBasketContent()
	});
});

events.on('checkout-button:pressed', () => {
	if (buyer.payment !== '' && buyer.address !== '') {
		orderFormContent.setSubmitButtonSate('active');
	}

	modal.render({
		'content': orderFormContent.render({
			'paymentMethod': buyer.payment,
			'address': buyer.address
		})
	});
});

events.on('order-form:validation', (evt: {
	paymentMethod: TPayment,
	address: string
}) => {
	buyer.changePayment(evt.paymentMethod);
	buyer.changeAddress(evt.address);

	const paymentMsg: string = buyer.validateData().payment ?? '';
	const addressMsg: string = buyer.validateData().address ?? '';

	if (paymentMsg === '' && addressMsg === '') {
		orderFormContent.setSubmitButtonSate('active');
	} else {
		orderFormContent.setSubmitButtonSate('inactive');
	}
	const sep: string = paymentMsg !== '' && addressMsg !== ''
		? ', ' : '' ;

	orderFormContent.errorMessage = `${paymentMsg}${sep}${addressMsg}`;
});

events.on('card-button:select', () => {
	orderFormContent.paymentMethod = 'card';
});

events.on('cash-button:select', () => {
	orderFormContent.paymentMethod = 'cash';
});

events.on('order-form-submit-btn:pressing', () => {
	if (buyer.email !== '' && buyer.phone !== '') {
		contactsFormContent.setSubmitButtonSate('active');
	}

	modal.render({
		'content': contactsFormContent.render({
			'email': buyer.email,
			'phone': buyer.phone
		})
	})
})

events.on('contacts-form:validation', (evt: {
	'email': string,
	'phone': string
}) => {
	buyer.changeEmail(evt.email);
	buyer.changePhone(evt.phone);

	const emailMsg: string = buyer.validateData().email ?? '';
	const phoneMsg: string = buyer.validateData().phone ?? '';

	if (emailMsg === '' && phoneMsg === '') {
		contactsFormContent.setSubmitButtonSate('active');
	} else {
		contactsFormContent.setSubmitButtonSate('inactive');
	}
	const sep: string = emailMsg !== '' && phoneMsg !== ''
		? ', ' : '' ;

	contactsFormContent.errorMessage = `${emailMsg}${sep}${phoneMsg}`;
});

events.on('contacts-form-submit-btn:pressing', () => {
	const orderItems: string[] = basket.getSelectedProducts()
		.map((product) => product.id);

	connections.postOrder({
		'payment': buyer.payment,
		'address': buyer.address,
		'email': buyer.email,
		'phone': buyer.phone,
		'items': orderItems,
		'total': basket.getTotalPrice()
	})
	.then((orderData) => {
		modal.render({
			'content': successContent.render({ 'synapses': orderData.total })
		});
	})
	.then(() => {
		basket.clearBasket();
		buyer.clearBuyerData();
	})
	.catch((error) => alert(error));
});