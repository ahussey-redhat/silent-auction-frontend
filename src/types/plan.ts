export type PlanType = 'industry' | 'retail';

export type Plan = {
  id: string;
  description: string;
  type: PlanType;
};
