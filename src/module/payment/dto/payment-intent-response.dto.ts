export class PaymentIntentResponseDto {
  public stipeKey: string;
  public clientSecret: string;
  public bookingCode: string;
  public status: string;
  public amount: number;
  public currency: string;
}
