import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { IPayload } from '../interface/payload';

export const GetRequestUser = createParamDecorator(
  async (data: string, context: ExecutionContext): Promise<IPayload> => {
    try {
      const request = context.switchToHttp().getRequest();
      const user: IPayload = request[data];
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on get request user: ${error}`,
      );
    }
  },
);