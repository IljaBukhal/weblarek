import { TButtonState, TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface FormData {
   errorMessage: string,
   paymentMethod: TPayment,
   address: string,
   email: string,
   phone: string
}

export abstract class Form extends Component<FormData> {
   protected modalActionsElem: HTMLElement;
   protected submitButton: HTMLElement;
   protected formErrElem: HTMLElement;

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

   set errorMessage(value: string) {
      this.formErrElem.textContent = value;
   }

   setSubmitButtonSate(value: TButtonState) {
      if (value === 'inactive')
         this.submitButton.setAttribute('disabled', 'true');
      else 
         this.submitButton.removeAttribute('disabled');
   }
}
