import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

export class OrderForm extends Form {
   protected cardButton: HTMLElement;
   protected cashButton: HTMLElement;
   protected inputAddress: HTMLInputElement;

   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

      this.cardButton = ensureElement(
         'button[name="card"]',
         this.container
      );
      this.cardButton.addEventListener('click', () => {
         this.events.emit('card-button:select');
         this.events.emit('order-form:validation', {
            'paymentMethod': this.getPaymentMethod(),
            'address': this.inputAddress.value
         });
      });

      this.cashButton = ensureElement(
         'button[name="cash"]',
         this.container
      );
      this.cashButton.addEventListener('click', () => {
         this.events.emit('cash-button:select');
         this.events.emit('order-form:validation', {
            'paymentMethod': this.getPaymentMethod(),
            'address': this.inputAddress.value
         });
      });

      this.inputAddress = ensureElement(
         'input[name="address"]',
         this.container
      ) as HTMLInputElement;
      this.inputAddress.addEventListener('input', () => {
         this.events.emit('order-form:validation', {
            'paymentMethod': this.getPaymentMethod(),
            'address': this.inputAddress.value
         });
      });

      this.container.addEventListener('submit', (evt) => {
         evt.preventDefault();
         this.events.emit('order-form-submit-btn:pressing');
      })
   }

   set paymentMethod(value: TPayment) {
      this.cardButton.classList
         .remove('button_alt-active');
      this.cashButton.classList
         .remove('button_alt-active');

      if (value === 'card')
         this.cardButton.classList.add('button_alt-active');
      if (value ==='cash')
         this.cashButton.classList.add('button_alt-active');
   }

   set address(value: string) {
      this.inputAddress.value = value;
   }

   private getPaymentMethod(): TPayment {
      return this.cardButton.classList.contains('button_alt-active')
         ? 'card'
         :  this.cashButton.classList.contains('button_alt-active')
            ? 'cash'
            : '';
   }
}