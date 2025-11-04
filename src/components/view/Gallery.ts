import { Component } from "../base/Component";

interface GalleryData {
   catalog: HTMLElement[];
}

export class Gallery extends Component<GalleryData> {
   constructor(protected container: HTMLElement) {
      super(container);
   }

   set catalog (cards: HTMLElement[]) {
      this.container.append(...cards);
   }
}