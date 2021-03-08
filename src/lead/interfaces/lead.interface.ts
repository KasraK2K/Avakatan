export interface BulkInsertResponseInterface {
  all: number;
  success: number;
  failds: number;
  reason: ErrorReasonInterface[];
}

export interface ErrorReasonInterface {
  name: string;
  family_name: string;
  email: string;
  cellphone: string;
  error: string;
}

export interface LeadInterface {
  name: string;
  family_name: string;
  email: string;
  cellphone: string;
}
