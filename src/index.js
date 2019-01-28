import axios from "axios";
import Queue from "better-queue";

class Apicalypse {
  constructor(opts) {
    this.apicalypse = opts.apicalypse;

    this.config = Object.assign(
      {
        queryMethod: "body"
      },
      opts
    );
    this.filterArray = [];
  }

  fields(fields) {
    if (fields) {
      let fieldsString =
        fields && fields.constructor === Array ? fields.join(",") : fields;
      fieldsString = fieldsString ? fieldsString.replace(/\s/g, "") : "";
      this.filterArray.push(`fields ${fieldsString}`);
    }
    return this;
  }

  sort(field, direction) {
    if (field) {
      this.filterArray.push(`sort ${field} ${direction || "asc"}`);
    }
    return this;
  }

  limit(limit) {
    if (limit) {
      this.filterArray.push(`limit ${limit}`);
    }
    return this;
  }

  offset(offset) {
    if (offset) {
      this.filterArray.push(`offset ${offset}`);
    }
    return this;
  }

  search(search) {
    if (search) {
      this.filterArray.push(`search ${search}`);
    }
    return this;
  }

  where(filters) {
    if (filters) {
      if (filters.constructor === Array) {
        this.filterArray.push(`where ${filters.join(" & ")}`);
      } else {
        this.filterArray.push(`where ${filters.trim()}`);
      }
    }
    return this;
  }

  constructOptions(url) {
    this.apicalypse = this.filterArray ? this.filterArray.join(";") + ";" : "";
    const options = {
      url: url || this.config.url
    };

    switch (this.config.queryMethod) {
      case "url": {
        options.params = {
          apicalypse: encodeURIComponent(this.apicalypse)
        };
        break;
      }
      case "body": {
        options.data = this.config.data || this.apicalypse;
        break;
      }
    }

    return Object.assign(this.config, options);
  }

  async request(url) {
    const response = await axios.create()(this.constructOptions(url));
    return response;
  }

  cleanLimitOffset() {
    // Get existing limit & offset
    const allLimits = this.filterArray.filter(
      f => f.substring(0, 6) === "limit "
    );
    const allOffsets = this.filterArray.filter(
      f => f.substring(0, 7) === "offset "
    );

    let limit = parseInt(allLimits.length && allLimits[0].split(" ")[1]) || 50;
    let offset =
      parseInt(allOffsets.length && allOffsets[0].split(" ")[1]) || 0;

    this.filterArray = this.filterArray.filter(
      f => f.substring(0, 7) !== "offset " && f.substring(0, 6) !== "limit "
    );

    return { limit, offset };
  }

  requestAll(url, opts = {}) {
    const { concurrency, delay } = opts;

    return new Promise(resolve => {
      let allData = [];

      const { limit, offset } = this.cleanLimitOffset();

      const q = new Queue(
        async (page, cb) => {
          this.cleanLimitOffset();
          this.limit(limit);
          this.offset(offset + page * limit);
          const response = await this.request(url);
          if (response.data.length <= limit) {
            allData = allData.concat(response.data);
            q.push(page + 1);
          }
          setTimeout(() => {
            cb(null);
          }, delay || 0);
        },
        { concurrent: concurrency || 1 }
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
