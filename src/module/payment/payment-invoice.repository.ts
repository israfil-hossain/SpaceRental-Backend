import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  PaymentInvoice,
  PaymentInvoiceDocument,
  PaymentInvoiceType,
} from "./entities/payment-invoice.entity";

@Injectable()
export class PaymentInvoiceRepository extends GenericRepository<PaymentInvoiceDocument> {
  constructor(
    @InjectModel(PaymentInvoice.name)
    private model: PaymentInvoiceType,
  ) {
    super(model, new Logger(PaymentInvoiceRepository.name));
  }
}
