export type InvestmentOption = {
  id: string;
  description: string;
  category:
    | 'Diversified'
    | 'Sector'
    | 'Responsible Investment'
    | 'Single Manager, Indexed, Third Party'
    | 'Personalised';
};
