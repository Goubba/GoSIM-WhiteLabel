import { Injectable, NgZone } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { IndexService } from './index.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private client: AxiosInstance;

  constructor(
    private indexService: IndexService,
    private zone: NgZone
  ) {
    this.client = axios.create({
      baseURL: 'https://business.getgosim.com/api/v1/vendor',
    });

    this.client.interceptors.request.use((config) => {
      const publicKey = this.indexService.publicKey;
      if (publicKey) {
        config.headers['api-key'] = publicKey;
      }

      if (this.indexService.host) {
        config.baseURL = this.indexService.host;
      }

      return config;
    });
  }

  get(url: string, config?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.get(url, config)
        .then(res => this.zone.run(() => resolve(res)))
        .catch(err => this.zone.run(() => reject(err)));
    });
  }

  post(url: string, data?: any, config?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.post(url, data, config)
        .then(res => this.zone.run(() => resolve(res)))
        .catch(err => this.zone.run(() => reject(err)));
    });
  }

  put(url: string, data?: any, config?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.put(url, data, config)
        .then(res => this.zone.run(() => resolve(res)))
        .catch(err => this.zone.run(() => reject(err)));
    });
  }

  delete(url: string, config?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.delete(url, config)
        .then(res => this.zone.run(() => resolve(res)))
        .catch(err => this.zone.run(() => reject(err)));
    });
  }
}
