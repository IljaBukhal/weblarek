import './scss/styles.scss';
import { Catalog } from './components/models/Catalog';
import { IApi, IProduct, IProductList } from './types';
import { apiProducts } from './utils/data';
import { ShoppingCart } from './components/models/ShoppingCart';
import { Buyer } from './components/models/Buyer';
import { Connection } from './components/models/Connection';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// Catalog
console.log('Тестирование методов класса Catalog');

const catalog: Catalog = new Catalog(apiProducts.items);
const catalog2: Catalog = new Catalog([]); 
const newProduct: IProduct = {
            "id": "1c521d84-c48d-48fa-8cfb-9d911fa515fd",
            "description": "Если орёт кот, нажмите кнопку.",
            "image": "/mute-cat.svg",
            "title": "Кнопка «Замьютить кота»",
            "category": "кнопка",
            "price": 2000
        }
const newProducts: IProduct[] = [
   {
            "id": "f3867296-45c7-4603-bd34-29cea3a061d5",
            "description": "Чтобы научиться правильно называть модификаторы, без этого не обойтись.",
            "image": "Pill.svg",
            "title": "БЭМ-пилюлька",
            "category": "другое",
            "price": 1500
        },
        {
            "id": "54df7dcb-1213-4b3c-ab61-92ed5f845535",
            "description": "Измените локацию для поиска работы.",
            "image": "/Polygon.svg",
            "title": "Портативный телепорт",
            "category": "другое",
            "price": 100000
        }
];

console.log(
   'Получить все товары из каталога:\n',
   catalog.getProducts()
);

catalog2.saveProducts(newProducts);
console.log(
   'Сохранил массив товаров, полученный в параметрах метода:',
   catalog2.getProducts()
);

console.log(
   'Получение товара по id:\n',
   catalog.getProductById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9')
);

catalog.saveProduct(newProduct);
console.log(
   'Сохранил и получил элемент для подробного отображения:\n',
   catalog.getSelectedCard()
);

// ShoppingCart
console.log('Тестирование методов класса ShoppingCart');

const cart: ShoppingCart = new ShoppingCart([]);

console.log('Получил элементы корзины:\n', cart.getSelectedProducts());

cart.addProductToCart(newProducts[0]);
cart.addProductToCart(newProducts[1]);
console.log('Добавил элементы корзину:\n', cart.getSelectedProducts());

console.log('Стоимость корзины: ', cart.getTotalPrice());
console.log('Кол-во товаров в корзине: ', cart.getNumberProductsInCart());

cart.removeProductFromCart('54df7dcb-1213-4b3c-ab61-92ed5f845535');
console.log('Удалил элемент из корзины:\n', cart.getSelectedProducts());

console.log(`Проверка наличия товаров в корзине по id:
   '54df7dcb-1213-4b3c-ab61-92ed5f845535': ${cart
      .isProductInCart('54df7dcb-1213-4b3c-ab61-92ed5f845535')}
   'f3867296-45c7-4603-bd34-29cea3a061d5': ${cart
      .isProductInCart('f3867296-45c7-4603-bd34-29cea3a061d5')}`);

cart.clearCart();
console.log(`Корзина очищена:\n`, cart.getSelectedProducts());

// Buyer
console.log('Тестирование методов класса ShoppingCart');

const buyer: Buyer = new Buyer();

console.log('Получение всех данных покупателя:\n', buyer.getBuyerData());

buyer.changePayment('card');
console.log('Изменили систему оплаты:\n', buyer.getBuyerData());

console.log('Валидация данных:\n', buyer.validateData());

buyer.changeAddress('lorem');
buyer.changeEmail('lorem');
buyer.changePhone('lorem');
console.log(
   'Изменить адрес, email и телефон покупателя:\n',
   buyer.getBuyerData(),
   buyer.validateData()
);

// Connection
console.log('Тестирование класса Connection');

const api: IApi = new Api(API_URL);
const connection: Connection = new Connection(api);
const catalog3: Catalog = new Catalog([])

connection.get('/product/')
   .then((productList: IProductList) => {
      catalog3.saveProducts(productList.items);
   })
   .finally(() => console.log(catalog3.getProducts()));