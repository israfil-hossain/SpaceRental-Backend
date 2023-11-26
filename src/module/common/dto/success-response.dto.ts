export class SuccessResponseDto {
  protected readonly message: string;
  protected readonly data?: any;

  constructor(message: string, data?: any) {
    this.message = message;
    this.data = data;
  }
}
