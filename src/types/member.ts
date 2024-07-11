export type Member = {
  id: string;
  memberNumber: string;
  customerReference: string;
  surname: string;
  givenNames: string;
  title: 'Doctor' | 'Mister' | 'Miss' | 'Misses';
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  active: boolean;
  risk: 'low' | 'medium' | 'high';
};
