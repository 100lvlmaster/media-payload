import { PayloadRequest } from "payload/dist/express/types";
import { User } from ".";

export interface IPayloadRequest extends PayloadRequest {
  user: User,
}

export interface IAccessArgs {
  req: IPayloadRequest,
  id: string;
}

export interface ICreateFieldAccessArgs {
  req: IPayloadRequest;
  data: any;
  siblingData: any;
}

export interface IUpdateFieldAccessArgs {
  req: IPayloadRequest;
  id: IPayloadRequest;
  data: any;
  siblingData: any;
}
