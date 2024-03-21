import { Observable } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface ICRUDService {
  getAll: <T>(key: string) => Observable<T[]>;
  getOne: <T>(key: string, id: number) => Observable<T>;
  create: <T>(key: string, payload: Partial<T>) => Observable<number>;
  update: <T>(key: string, payload: Partial<T>) => Observable<number>;
  delete: (key: string, id: number) => Observable<number>;
}

@Injectable()
export class CRUDService implements ICRUDService {
  private baseUrl = "http://localhost:3000";

  private httpOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  constructor(private client: HttpClient) { }

  getAll<T>(key: string) {
    return this.client.get<T[]>(`${this.baseUrl}/${key}`);
  }
  getOne<T>(key: string, id: number) {
    return this.client.get<T>(`${this.baseUrl}/${key}/${id}`);
  }
  create<T>(key: string, payload: Partial<T>) {
    const options = {
      ...this.httpOptions,
      body: JSON.stringify(payload),
    };
    return this.client.post<number>(`${this.baseUrl}/${key}`, options);
  }
  update<T>(key: string, payload: Partial<T>) {
    const options = {
      ...this.httpOptions,
      body: JSON.stringify(payload),
    };
    return this.client.put<number>(`${this.baseUrl}/${key}`, options);
  }
  delete(key: string, id: number) {
    return this.client.get<number>(`${this.baseUrl}/${key}/${id}`);
  }
}
