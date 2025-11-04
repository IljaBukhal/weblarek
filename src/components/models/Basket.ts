import { IProduct } from "../../types";

export class Basket {
   protected _selectedProducts: IProduct[] = [];

   getSelectedProducts(): IProduct[] {
      return this._selectedProducts;
   }

   addProductToBasket(product: IProduct): void {
      this._selectedProducts.push(product);
   }

   removeProductFromBasket(id: string): void {
      this._selectedProducts = this
         ._selectedProducts.filter((product) => {
            return product.id !== id;
         });
   }

   clearBasket(): void {
      this._selectedProducts = [];
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