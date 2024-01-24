export class PaymentIntentResponseDto {
  public paymentInvoice: string;
  public clientSecret: string;
  public status: string;
  public amount: number;
  public currency: string;
}
