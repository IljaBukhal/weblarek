import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
   protected _selectedProducts: IProduct[] = [];

   constructor(protected events: IEvents){}

   getSelectedProducts(): IProduct[] {
      return this._selectedProducts;
   }

   addProductToBasket(product: IProduct): void {
      this._selectedProducts.push(product);
      this.events.emit('basket-contents:changing');
   }

   removeProductFromBasket(id: string): void {
      this._selectedProducts = this
         ._selectedProducts.filter((product) => {
            return product.id !== id;
         });
      this.events.emit('basket-contents:changing');
   }

   clearBasket(): void {
      this._selectedProducts = [];
      this.events.emit('basket-contents:changing');
   }

   getTotalPrice(): number {
      return this._selectedProducts
         .reduce((sum: number, product: IProduct) => {
            return sum + (product.price ?? 0);
         }, 0);
   }

   getNumberProductsInBasket(): number {
      return this._selectedProducts.length;
   }

   isProductInBasket(id: string): boolean {
      return this._selectedProducts.some((product) => {
         return product.id === id
      });
   }
}