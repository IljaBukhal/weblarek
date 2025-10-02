import { IProduct } from "../../types";

export class ShoppingCart {
   protected _selectedProducts: IProduct[] = [];

   constructor(){}

   getSelectedProducts(): IProduct[] {
      return this._selectedProducts;
   }

   addProductToCart(product: IProduct): void {
      this._selectedProducts.push(product);
   }

   removeProductFromCart(id: string): void {
      this._selectedProducts = this
         ._selectedProducts.filter((product) => {
            return product.id !== id;
         });
   }

   clearCart(): void {
      this._selectedProducts = [];
   }

   getTotalPrice(): number {
      return this._selectedProducts
         .reduce((sum: number, product: IProduct) => {
            return sum + (product.price ?? 0);
         }, 0);
   }

   getNumberProductsInCart(): number {
      return this._selectedProducts.length;
   }

   isProductInCart(id: string): boolean {
      return this._selectedProducts.some((product) => {
         return product.id === id
      });
   }
}