import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface SuccessMdlContentData {
   synapses: number
}

export class SuccessMdlContent extends Component<SuccessMdlContentData> {
   protected descriptionElem: HTMLElement;
   protected buttonElem: HTMLElement;
   
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

   set synapses(value: number) {
      this.descriptionElem.textContent = `Списано ${value} синапсов`;
   }
}