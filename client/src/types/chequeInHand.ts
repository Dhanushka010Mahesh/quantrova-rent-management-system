export type ChequeType = "RECEIVED" | "ISSUED"; // RECEIVED = customer gave us, ISSUED = we gave someone
export type ChequeStatus = "IN_HAND" | "RELEASED" | "RETURNED"; // decided once bank statement arrives

export interface ChequeInHand {
  id: string;
  type: ChequeType;
  chequeNo: string;
  bankAccountId: number;
  bankAccountName: string;
  partyName: string; // who gave it to us / who we gave it to
  amount: number;
  chequeDate: string; // date written on the cheque
  receivedOrIssuedDate: string;
  status: ChequeStatus;
  statusDate: string | null; // date status was changed (from bank statement)
  createdAt: string;
}