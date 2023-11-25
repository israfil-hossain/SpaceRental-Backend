export class OperationResponseDto {
  protected readonly success: boolean;
  protected readonly message: string;
  protected readonly data?: any;

  private constructor(success: boolean, message: string, data?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  public static Success(message: string, data?: any) {
    return new OperationResponseDto(true, message, data);
  }

  public static Failure(message: string) {
    return new OperationResponseDto(false, message);
  }
}
