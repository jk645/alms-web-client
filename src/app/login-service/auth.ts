import { User } from './user';


export class LoginCredentials {
  email: string;
  password: string;
}

export class ShareCodeCredentials {
  taskId: string;
  shareCode: string;
  email: string;
  fName: string;
  lName: string;
}

export class TokenContainer {
  token: string;  // JWT
  refreshToken: string;  // JWT
  user: User;
}
