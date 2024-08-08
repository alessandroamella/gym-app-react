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
}

export const config = new Config();
