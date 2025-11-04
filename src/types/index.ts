export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'card' | 'cash' | '';

export type TCategory = 'софт-скил' | 'хард-скил'
    | 'кнопка' | 'дополнительное' | 'другое';

export type TButtonState = 'active' | 'inactive';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

export interface IProductList {
    total: number;
    items: IProduct[];
}

export interface IValidationResult {
    payment?: string,
    email?: string,
    phone?: string,
    address?: string
}

export interface IRespOrder {
    id?: string;
    total?: number;
    error?: string;
}