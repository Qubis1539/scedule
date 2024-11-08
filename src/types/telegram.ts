export type ClientData = {
  id: string;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  phone: string;
  dragonID: string;
  active: boolean;
  notification: {
    long: boolean;
    medium: boolean;
    short: boolean;
  };
  stages: {
    email: boolean;
    dragonID: boolean;
  };
};
