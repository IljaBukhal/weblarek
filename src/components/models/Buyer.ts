import { IBuyer, TPayment, IValidationResult } from "../../types";

export class Buyer implements IBuyer {
   public payment: TPayment = '';
   public email: string = '';
   public phone: string = '';
   public address: string = '';

   constructor(buyer?: IBuyer) {
      if (buyer) {
         this.payment = buyer.payment;
         this.email = buyer.email;
         this.phone = buyer.phone;
         this.address = buyer.address;
      }
   }

   changePayment(newValue: TPayment): void {
      this.payment = newValue;
   }

   changeEmail(newValue: string): void {
      this.email = newValue;
   }

   changePhone(newValue: string): void {
      this.phone = newValue;
   }

   changeAddress(newValue: string): void {
      this.address = newValue;
   }

   getBuyerData(): IBuyer {
      return {
         payment: this.payment,
         email: this.email,
         phone: this.phone,
         address: this.address
      }
   }

   clearBuyerData(): void {
      this.payment = '';
      this.email = '';
      this.phone = '';
      this.address = '';
   }

   validateData(): IValidationResult {
      const validationResult: IValidationResult = {};
      if (!this.payment) validationResult
         .payment = 'Укажите способ оплаты';
      if (!this.email) validationResult
         .email = 'Укажите email';
      if (!this.phone) validationResult
         .phone = 'Укажите номер телефона';
      if (!this.address) validationResult
         .address = 'Укажите свой адрес';
      return validationResult;
   }
}