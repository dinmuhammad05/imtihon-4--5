import { ISuccessRes } from 'src/common';

export function successRes(
  data: object,
  statusCode: number = 200,
): ISuccessRes {
  return {
    statusCode,
    message: 'en: succes. uz: muvaffaqiyatli',
    data,
  };
}
