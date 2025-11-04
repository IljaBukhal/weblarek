import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface CardData extends IProduct {
   index?: number
}

export abstract class Card extends Component<CardData> {
   protected cardElem: HTMLElement;
   protected titleElem: HTMLElement;
   protected priceElem: HTMLElement;

   constructor(container: HTMLElement, protected events: IEvents){
      super(container);

      this.cardElem = this.container;
      this.titleElem = ensureElement(
         '.card__title', 
         this.cardElem
      );
      this.priceElem = ensureElement(
         '.card__price', 
         this.cardElem
      );
   }

   set id(id: string) {
      this.cardElem.setAttribute('id', id);
   }

   set title(title: string) {
      this.titleElem.textContent = title;
   }

   set price(price: number | null ) {
      this.priceElem.textContent = price === null
         ? 'Бесценно'
         : `${price} синапсов`;
   }
}