import { IProduct } from "../../types";

export class Catalog {
   protected products: IProduct[] = [];
   protected selectedCard: IProduct | undefined;

   constructor(){}

   saveProducts(products: IProduct[]): void {
      this.products = products;
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
   }

   getSelectedCard(): IProduct | undefined {
      return this.selectedCard;
   }
}