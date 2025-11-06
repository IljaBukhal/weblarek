import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
   protected products: IProduct[] = [];
   protected selectedCard: IProduct | undefined;

   constructor(protected events: IEvents){}

   saveProducts(products: IProduct[]): void {
      this.products = products;
      this.events.emit('catalog:changing');
   }

   getProducts(): IProduct[] {
      return this.products;
   }

   getProductById(id: string): IProduct | undefined {
      return this.products.find((product) => {
         return product.id === id;
      });
   }

   selectProduct(product: IProduct): void {
      this.selectedCard = product;
      this.events.emit('selected-product:changing');
   }

   getSelectedCard(): IProduct | undefined {
      return this.selectedCard;
   }
}