import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card } from "./Card";

export class BasketCard extends Card {
   protected indexElem: HTMLElement;
   protected deleteBtn: HTMLElement;

   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);
      
      this.indexElem = ensureElement(
         '.basket__item-index',
         this.container
      );
      this.deleteBtn = ensureElement(
         '.card__button',
         this.container
      );
      this.deleteBtn.addEventListener('click', (evt: PointerEvent) => {
         this.events.emit('basked-card:delete', evt);
      });
   }

   set index(index: number) {
      this.indexElem.textContent = String(index);
   }
}