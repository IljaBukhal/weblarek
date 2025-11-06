import { IBuyer, TPayment, IValidationResult } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer implements IBuyer {
   public payment: TPayment = '';
   public email: string = '';
   public phone: string = '';
   public address: string = '';

   constructor(protected events: IEvents, buyer?: IBuyer) {
      if (buyer) {
         this.payment = buyer.payment;
         this.email = buyer.email;
         this.phone = buyer.phone;
         this.address = buyer.address;
      }
   }

   changePayment(newValue: TPayment): void {
      this.payment = newValue;
      this.events.emit('buyer-data:changing');
   }

   changeEmail(newValue: string): void {
      this.email = newValue;
      this.events.emit('buyer-data:changing');
   }

   changePhone(newValue: string): void {
      this.phone = newValue;
      this.events.emit('buyer-data:changing');
   }

   changeAddress(newValue: string): void {
      this.address = newValue;
      this.events.emit('buyer-data:changing');
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
      this.events.emit('buyer-data:changing');
   }

   validateData(): IValidationResult {
      const validationResult: IValidationResult = {};
      if (!this.payment) validationResult
         .payment = 'Необходимо выбрать способ оплаты';
      if (!this.email) validationResult
         .email = 'Необходимо указать email';
      if (!this.phone) validationResult
         .phone = 'Укажите номер телефона';
      if (!this.address) validationResult
         .address = 'Укажите свой адрес';
      return validationResult;
   }
}