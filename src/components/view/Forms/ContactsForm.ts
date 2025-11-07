import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./Form";

export class ContactsForm extends Form {
   protected inputEmail: HTMLInputElement;
   protected inputPhone: HTMLInputElement;

   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

      this.container.addEventListener('submit', (evt: SubmitEvent) => {
         evt.preventDefault();
         this.events.emit('contacts-form-submit-btn:pressing');
      })

      this.inputEmail = ensureElement(
         'input[name="email"]',
         this.container
      ) as HTMLInputElement;
      this.inputEmail.addEventListener('input', () => {
         this.events.emit('contacts-form:validation', {
            'email': this.inputEmail.value,
            'phone': this.inputPhone.value
         });
      })

      this.inputPhone = ensureElement(
         'input[name="phone"]',
         this.container
      ) as HTMLInputElement;
      this.inputPhone.addEventListener('input', () => {
         this.events.emit('contacts-form:validation', {
            'email': this.inputEmail.value,
            'phone': this.inputPhone.value
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