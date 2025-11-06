import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface HeaderData {
   counter: number;
}

export class Header extends Component<HeaderData> {
   protected basketButton: HTMLButtonElement;
   protected counterElement: HTMLElement;

   constructor(container: HTMLElement, protected events: IEvents) {
      super(container);

      this.basketButton = ensureElement<HTMLButtonElement>(
         '.header__basket',
         this.container
      );
      this.counterElement = ensureElement<HTMLElement>(
         '.header__basket-counter',
         this.container
      );

      this.basketButton.addEventListener('click', () => {
         this.events.emit('open-basket-button:pressing');
      });
   }

   set counter(value: number) {
      this.counterElement.textContent = String(value);
   }
}