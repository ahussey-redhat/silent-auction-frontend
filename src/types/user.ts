export type UserDTO = {
  id: number;
  username: string;
  table_number: number;
};

export type User = {
  id: string;
  username: string;
  tableNumber: string;
};

export type CreateMeRequest = {
  table_number: number;
};
