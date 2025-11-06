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
         this.events.emit('order-form-submit-btn:pressing', {
            'submitEvent': evt,
            'cardButton': this.cardButton,
            'inputAddress': this.inputAddress
         });
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
}