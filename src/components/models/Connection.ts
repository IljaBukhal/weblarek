import { ApiPostMethods, IApi, IProductList } from "../../types";

export class Connection{
   public api: IApi;
   constructor(api: IApi) {
      this.api = api
   }

   get(url: string): Promise<IProductList> {
      return this.api.get(url);
   }

   post(
      uri: string,
      data: object,
      method?: ApiPostMethods | undefined
   ) {
      this.api.post(uri, data, method);
   }
}