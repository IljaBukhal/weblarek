import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { TButtonState, TCategory } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IEvents } from "../../base/Events";

export class PreviewCard extends Card {
   protected imageElem: HTMLElement;
   protected categoryElem: HTMLElement;
   protected descriptionElem: HTMLElement;
   protected buttonElem: HTMLElement;

   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

      this.imageElem = ensureElement(
         '.card__image',
         this.container
      );
      this.categoryElem = ensureElement(
         '.card__category',
         this.container
      );
      this.descriptionElem = ensureElement(
         '.card__text',
         this.container
      );
      this.buttonElem = ensureElement(
         '.card__button',
         this.container
      );
      this.buttonElem.addEventListener('click', () => {
         this.events.emit('card:addInBasket');
      });
   }

   set category(category: TCategory) {
      this.categoryElem.textContent = category;
      this.categoryElem.classList.remove('card__category_other');
      this.categoryElem.classList.add(`${categoryMap[category]}`);
   }

   set image(src: string) {
      this.imageElem.setAttribute('src', `${CDN_URL}${src}`);
      this.imageElem.setAttribute('alt', this.titleElem.textContent);
   }
 
   set description(value: string) {
      this.descriptionElem.textContent = value;
   }

   setButtonSate(value: TButtonState) {
      if (value === 'inactive')
         this.buttonElem.setAttribute('disabled', 'true');
      else 
         this.buttonElem.removeAttribute('disabled');
   }
}