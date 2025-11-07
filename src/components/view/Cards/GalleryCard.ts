import { TCategory } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card } from "./Card";

export class GalleryCard extends Card {
   protected categoryElem: HTMLElement;
   protected imageElem: HTMLImageElement;

   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

      this.container.addEventListener('click', () => {
         this.events.emit('gallery-card:select', {
            'cardElement': this.container
         })
      });

      this.categoryElem = ensureElement(
         '.card__category',
         this.cardElem
      );
      this.imageElem = ensureElement(
         '.card__image',
         this.cardElem
      ) as HTMLImageElement;
   }

   set category(category: TCategory) {
      this.categoryElem.textContent = category;
      this.categoryElem.classList.remove('card__category_soft');
      this.categoryElem.classList.add(`${categoryMap[category]}`);
   }

   set image(src: string) {
      this.setImage(this.imageElem, `${CDN_URL}${src}`,
         this.titleElem.textContent ?? undefined);
   }
}

