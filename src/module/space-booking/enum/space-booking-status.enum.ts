export enum SpaceBookingStatusEnum {
  PendingActions = "PendingActions",
  BookingApproved = "BookingApproved",

  PaymentInitiated = "PaymentInitiated",
  PaymentCreated = "PaymentCreated",
  PaymentCompleted = "PaymentCompleted",
  PaymentFailed = "PaymentFailed",

  BookingCompleted = "BookingCompleted",
  BookingCancelled = "BookingCancelled",
}

export enum SpaceBookingStatusDtoEnum {
  PendingActions = SpaceBookingStatusEnum.PendingActions,
  BookingApproved = SpaceBookingStatusEnum.BookingApproved,
  BookingCompleted = SpaceBookingStatusEnum.BookingCompleted,
  BookingCancelled = SpaceBookingStatusEnum.BookingCancelled,

  PaymentInitiated = SpaceBookingStatusEnum.PaymentInitiated,
  PaymentCreated = SpaceBookingStatusEnum.PaymentCreated,
  PaymentCompleted = SpaceBookingStatusEnum.PaymentCompleted,
  PaymentFailed = SpaceBookingStatusEnum.PaymentFailed,
}

