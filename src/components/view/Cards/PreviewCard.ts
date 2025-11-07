import { Card } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { TCategory } from "../../../types";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IEvents } from "../../base/Events";

type TPreviewCardBtnState = 'buy' | 'delete' | 'unavailable';

export class PreviewCard extends Card {
   protected imageElem: HTMLImageElement;
   protected categoryElem: HTMLElement;
   protected descriptionElem: HTMLElement;
   protected buttonElem: HTMLElement;

   constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

      this.imageElem = ensureElement(
         '.card__image',
         this.container
      ) as HTMLImageElement;
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
            this.events.emit('preview-card-btn:pressing');
      });
   }

   set category(category: TCategory) {
      this.categoryElem.textContent = category;
      this.categoryElem.classList.remove('card__category_other');
      this.categoryElem.classList.add(`${categoryMap[category]}`);
   }

   set image(src: string) {
      this.setImage(this.imageElem, `${CDN_URL}${src}`,
         this.titleElem.textContent ?? undefined);
   }
 
   set description(value: string) {
      this.descriptionElem.textContent = value;
   }

   setButtonSate(value: TPreviewCardBtnState) {
      switch(value) {
         case 'buy':
            this.buttonElem.textContent = 'Купить';
            this.buttonElem.removeAttribute('disabled');
            break;
         case 'unavailable':
            this.buttonElem.textContent = 'Недоступно';
            this.buttonElem.setAttribute('disabled', 'true');
            break;
         case 'delete':
            this.buttonElem.textContent = 'Удалить из корзины';
            this.buttonElem.removeAttribute('disabled');
      }
   }
}