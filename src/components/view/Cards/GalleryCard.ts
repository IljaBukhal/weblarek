import { TCategory } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card } from "./Card";

export class GalleryCard extends Card {
   protected categoryElem: HTMLElement;
   protected imageElem: HTMLElement;

   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

      this.container.addEventListener('click', (evt) => {
         this.events.emit('gallery-card:open', evt)
      });

      this.categoryElem = ensureElement(
         '.card__category',
         this.cardElem
      );
      this.imageElem = ensureElement(
         '.card__image',
         this.cardElem
      );
   }

   set category(category: TCategory) {
      this.categoryElem.textContent = category;
      this.categoryElem.classList.remove('card__category_soft');
      this.categoryElem.classList.add(`${categoryMap[category]}`);
   }

   set image(src: string) {
      this.imageElem.setAttribute('src', `${CDN_URL}${src}`);
      this.imageElem.setAttribute('alt', this.titleElem.textContent ?? '');
   }
}

