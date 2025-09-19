import { dbConfig } from "src/config";

export const registrData = {
  data: {
    url: 'api/v1/users/confirmotp',
    expired: `${dbConfig.CACHE_TIME/1000/60}-minutes`,
    otp: '600020',
  },
};
