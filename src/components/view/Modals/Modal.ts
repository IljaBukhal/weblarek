import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface ModalData {
   display: boolean;
   content: HTMLElement;
}

export class Modal extends Component<ModalData> {
   protected closeButton: HTMLElement;
   protected contentContainer: HTMLElement;

   constructor(container: HTMLElement, protected events: IEvents) {
      super(container);

      this.container.addEventListener('click', (evt) => {
         const targetElem = evt.target as HTMLElement;
         if (targetElem.classList.contains('modal'))
            this.events.emit('modal:close');
      });

      this.closeButton = ensureElement(
         '.modal__close',
         this.container
      );
      this.closeButton.addEventListener('click', () => {
         this.events.emit('modal:close');
      });

      this.contentContainer = ensureElement(
         '.modal__content',
         this.container
      );
   }

   set display(value: boolean) {
      if (value) this.container.classList
         .add('modal_active');
      else this.container.classList
         .remove('modal_active');
   }

   set content(content: HTMLElement) {
      this.contentContainer.replaceChildren(content);
   }
}