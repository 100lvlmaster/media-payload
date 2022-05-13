import { User as PayloadUser } from "payload/auth";

export type Role =
  'superAdmin' | 
  'admin' |
  'editor' |
  'author' |
  'translator' |
  'freelancer';

export type User = PayloadUser & {
  roles: Role[] | Role;
}