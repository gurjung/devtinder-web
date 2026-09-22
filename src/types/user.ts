export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  emailId?: string;
  email?: string;
  photoUrl?: string;
  age?: number | string;
  gender?: string;
  about?: string;
  skills?: string[];
}

export type UserProfileEditPayload = Partial<
  Pick<User, "firstName" | "lastName" | "photoUrl" | "age" | "gender" | "about">
>;
