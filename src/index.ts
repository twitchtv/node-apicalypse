import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Queue from "better-queue";
import MemoryStore from "better-queue-memory";
import Builder from "./builder.js";

export interface ApicalypseConfig extends Omit<AxiosRequestConfig, 'url'> {
  queryMethod?: "body" | "url";
  apicalypse?: string;
  data?: any;
  axiosInstance?: AxiosInstance;
  url?: string;
}

export interface RequestAllOptions {
  concurrency?: number;
  delay?: number;
}

const axiosInstance: AxiosInstance = axios.create();

class Apicalypse extends Builder {
  private config: ApicalypseConfig;
  private initialApicalypse: string;

  constructor(opts: ApicalypseConfig) {
    super();
    this.initialApicalypse = opts.apicalypse || "";
    this.apicalypse = this.initialApicalypse;

    this.config = {
      queryMethod: "body",
      ...opts,
    };
  }

  constructOptions(url?: string): AxiosRequestConfig {
    if (!this.isMulti) {
      this.build();
      if (!this.apicalypse) {
        this.apicalypse = this.initialApicalypse;
      }
    }

    const options: AxiosRequestConfig = {
      url: url || this.config.url || "",
    };

    switch (this.config.queryMethod) {
      case "url": {
        options.params = {
          apicalypse: encodeURIComponent(this.apicalypse),
        };
        break;
      }
      case "body": {
        options.data = this.config.data || this.apicalypse;
        break;
      }
    }

    this.resetRequest();
    return { ...this.config, ...options };
  }

  async request(url?: string): Promise<AxiosResponse> {
    const instance = this.config.axiosInstance || axiosInstance;
    const response = await instance(this.constructOptions(url));
    return response;
  }

  resetRequest(): void {
    this.resetQueryFields();
    this.apicalypse = this.initialApicalypse;
    this.config.data = this.apicalypse || false;
  }

  cleanLimitOffset(): { limit: number; offset: number } {
    const limitStr = this.queryFields.limit?.split(" ")[1];
    const offsetStr = this.queryFields.offset?.split(" ")[1];

    const limit = limitStr ? parseInt(limitStr) : 50;
    const offset = offsetStr ? parseInt(offsetStr) : 0;

    delete this.queryFields.limit;
    delete this.queryFields.offset;

    return { limit, offset };
  }

  requestAll(url?: string, opts: RequestAllOptions = {}): Promise<any[]> {
    const { concurrency, delay } = opts;

    return new Promise((resolve) => {
      let allData: any[] = [];

      const { limit, offset } = this.cleanLimitOffset();

      const q = new Queue<number, void>(
        async (page: number, cb: (error: Error | null) => void) => {
          this.cleanLimitOffset();
          this.limit(limit);
          this.offset(offset + page * limit);
          const response = await this.request(url);
          allData = allData.concat(response.data);
          if (response.data.length >= limit) {
            q.push(page + 1);
          }
          setTimeout(() => {
            cb(null);
          }, delay || 0);
        },
        {
          concurrent: concurrency || 1,
          store: new MemoryStore() as any,
        }
      );

      q.on("drain", () => {
        resolve(allData);
      });

      const initialPage = Math.floor(offset ? offset / limit : 0);
      q.push(initialPage);
    });
  }
}

export default function (
  apicalypse?: string | ApicalypseConfig,
  opts: ApicalypseConfig = {}
): Apicalypse {
  if (typeof apicalypse === "string") {
    opts.apicalypse = apicalypse;
  } else if (apicalypse) {
    opts = apicalypse;
  }
  return new Apicalypse(opts);
}