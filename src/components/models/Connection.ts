import { ApiPostMethods, IApi, IOrder, IProductList, IRespOrder } from "../../types";

export class Connection{
   public api: IApi;
   constructor(api: IApi) {
      this.api = api;
   }

   getProducts(): Promise<IProductList> {
      return this.api.get('/product/');
   }

   postOrder(
      data: IOrder,
      method?: ApiPostMethods | undefined
   ): Promise<IRespOrder> {
      return this.api.post('/order/', data, method);
   }
}