import { TButtonState } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface BasketMdlContentData {
   selectedProducts: HTMLElement[],
   price: number
}

export class BasketMdlContent extends Component<BasketMdlContentData> {
   protected basketList: HTMLElement;
   protected basketButton: HTMLElement;
   protected basketPrice: HTMLElement;

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
         this.events.emit('checkout-button:pressed');
      });

      this.basketPrice = ensureElement(
         '.basket__price',
         this.container
      );
   }

   set selectedProducts(products: HTMLElement[]) {
      this.basketList.replaceChildren(...products);
   }

   set price(price: number) {
      this.basketPrice.textContent = `${price} синапсов`;
   }

   setButtonSate(value: TButtonState) {
      if (value === 'inactive')
         this.basketButton.setAttribute('disabled', 'true');
      else 
         this.basketButton.removeAttribute('disabled');
   }
}