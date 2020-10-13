import axios from "axios";
import Queue from "better-queue";
import MemoryStore from "better-queue-memory";
import Builder from "./builder";

class Apicalypse extends Builder {
  constructor(opts) {
    super();
    this.apicalypse = opts.apicalypse;

    this.config = Object.assign(
      {
        queryMethod: "body",
      },
      opts
    );
  }

  constructOptions(url) {
    if (!this.isMulti) {
      this.build();
    }

    const options = {
      url: url || this.config.url,
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
    return Object.assign({}, this.config, options);
  }

  async request(url) {
    const response = await axios.create()(this.constructOptions(url));
    return response;
  }

  resetRequest() {
    this.resetQueryFields();
    this.apicalypse = "";
    this.config.data = false;
  }

  cleanLimitOffset() {
    // Get existing limit & offset

    const limit =
      parseInt(
        this.queryFields.limit && this.queryFields.limit.split(" ")[1]
      ) || 50;
    const offset =
      parseInt(
        this.queryFields.offset && this.queryFields.offset.split(" ")[1]
      ) || 0;

    delete this.queryFields.limit;
    delete this.queryFields.offset;

    return { limit, offset };
  }

  requestAll(url, opts = {}) {
    const { concurrency, delay } = opts;

    return new Promise((resolve) => {
      let allData = [];

      const { limit, offset } = this.cleanLimitOffset();

      const q = new Queue(
        async (page, cb) => {
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
          store: new MemoryStore(),
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

export default (apicalypse, opts) => {
  opts = opts || {};
  if (apicalypse && apicalypse.constructor === String) {
    opts.apicalypse = apicalypse;
  } else if (apicalypse) {
    opts = apicalypse;
  }
  return new Apicalypse(opts);
};
