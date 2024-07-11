// eslint-disable-next-line @typescript-eslint/naming-convention
type _AccountTransaction = {
  id: string;
  effectiveDate: string;
  totalValue: number;
};

export type AccountEmployerContribution = _AccountTransaction & {
  employerName: string;
  type: 'Contribution';
};

export type AccountPlanWithdrawal = _AccountTransaction & {
  type: 'Withdrawal';
};

export type AccountTransaction =
  | AccountEmployerContribution
  | AccountPlanWithdrawal;

export type Account = {
  id: string;
  balance: number;
  transactions: AccountTransaction[];
};
