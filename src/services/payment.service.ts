import { httpGet, httpPost } from "./http.service";
import type { ApiResponse } from "./http.service";

// Payment Types
export interface Payment {
  id: string;
  memberId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  invoiceUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  memberId: string;
  amount: number;
  paymentMethod: "cash" | "card" | "bkash" | "nagad" | "stripe" | "sslcommerz";
  description?: string;
}

export interface PaymentIntent {
  paymentUrl?: string;
  clientSecret?: string;
  transactionId: string;
}

// Payment Service Functions
export const getPayments = async (): Promise<ApiResponse<Payment[]>> => {
  return httpGet<Payment[]>("/payments");
};

export const getPaymentById = async (
  id: string,
): Promise<ApiResponse<Payment>> => {
  return httpGet<Payment>(`/payments/${id}`);
};

export const getMemberPayments = async (
  memberId: string,
): Promise<ApiResponse<Payment[]>> => {
  return httpGet<Payment[]>(`/payments/member/${memberId}`);
};

export const createPayment = async (
  data: CreatePaymentDto,
): Promise<ApiResponse<Payment>> => {
  return httpPost<Payment>("/payments", data);
};

export const createPaymentIntent = async (
  data: CreatePaymentDto,
): Promise<ApiResponse<PaymentIntent>> => {
  return httpPost<PaymentIntent>("/payments/intent", data);
};

export const verifyPayment = async (
  transactionId: string,
): Promise<ApiResponse<Payment>> => {
  return httpPost<Payment>("/payments/verify", { transactionId });
};
