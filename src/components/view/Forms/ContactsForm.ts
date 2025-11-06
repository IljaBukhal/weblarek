import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

export class ContactsForm extends Form {
   protected inputEmail: HTMLInputElement;
   protected inputPhone: HTMLInputElement;

   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

      this.container.addEventListener('submit', (evt: SubmitEvent) => {
         this.events.emit('contacts-form-submit-btn:pressing', {
            'submitEvent': evt,
            'inputEmail': this.inputEmail,
            'inputPhone': this.inputPhone
         });
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

   set email(value: string) {
      this.inputEmail.value = value;
   }

   set phone(value: string) {
      this.inputPhone.value = value;
   }
}