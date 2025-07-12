import axios from "axios";
import type { AxiosInstance } from "axios";

export default class ApiClient {
  api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      timeout: 5000,
      headers: { "Content-Type": "application/json" },
    });
  }
}
