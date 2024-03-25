import { Observable } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface ICRUDService {
  getAll: <T>(key: string) => Observable<T[]>;
  getOne: <T>(key: string, id: number) => Observable<T>;
  create: <T>(key: string, payload: Partial<T>) => Observable<T>;
  update: <T>(
    key: string,
    id: number,
    payload: Partial<T>,
  ) => Observable<T>;
  delete: <T>(key: string, id: number) => Observable<T>;
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
    return this.client.post<T>(
      `${this.baseUrl}/${key}`,
      payload,
      this.httpOptions,
    );
  }
  update<T>(key: string, id: number, payload: Partial<T>) {
    return this.client.put<T>(
      `${this.baseUrl}/${key}/${id}`,
      payload,
      this.httpOptions,
    );
  }
  delete<T>(key: string, id: number) {
    console.log("Sending request...");
    console.log(key, id);
    return this.client.delete<T>(`${this.baseUrl}/${key}/${id}`);
  }
}
