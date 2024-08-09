import axios from 'axios';

class Config {
  public readonly serverBaseUrl = 'https://gym.bitrey.it';
  public readonly axiosBase = (token: string) =>
    axios.create({
      baseURL: this.serverBaseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  public readonly scheme = 'gym-app';
  public readonly minutesPerPoint = 45;
}

export const config = new Config();
