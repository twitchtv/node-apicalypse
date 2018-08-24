import axios from "axios";

class Apicalypse {
  constructor(opts) {
    this.apicalypse = opts.apicalypse;

    this.config = Object.assign(
      {
        queryMethod: "body"
      },
      opts
    );
    this.queryArray = [];
  }

  fields(fields) {
    if (fields) {
      let fieldsString =
        fields && fields.constructor === Array ? fields.join(",") : fields;
      fieldsString = fieldsString ? fieldsString.replace(/\s/g, "") : "";
      this.queryArray.push(`fields ${fieldsString}`);
    }
    return this;
  }

  order(field, direction) {
    if (field) {
      this.queryArray.push(`order ${field} ${direction || "asc"}`);
    }
    return this;
  }

  limit(limit) {
    if (limit) {
      this.queryArray.push(`limit ${limit}`);
    }
    return this;
  }

  offset(offset) {
    if (offset) {
      this.queryArray.push(`offset ${offset}`);
    }
    return this;
  }

  search(search) {
    if (search) {
      this.queryArray.push(`search ${search}`);
    }
    return this;
  }

  query(filters) {
    if (filters) {
      if (filters.constructor === Array) {
        this.queryArray.push(`query ${filters.join(" & ")}`);
      } else {
        this.queryArray.push(`query ${filters.trim()}`);
      }
    }
    return this;
  }

  constructOptions(url) {
    this.apicalypse = this.queryArray ? this.queryArray.join(";") + ";" : "";
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
        options.data = this.apicalypse;
        break;
      }
    }

    return Object.assign(this.config, options);
  }

  async request(url) {
    const response = await axios(constructOptions(url));
    return response;
  }
}

export default (apicalypse, opts) => {
  opts = opts || {};
  if (apicalypse && apicalypse.constructor === String) {
    if (!opts) {
      opts = {};
    }
    opts.apicalypse = apicalypse;
  } else if (apicalypse) {
    opts = apicalypse;
  }
  return new Apicalypse(opts);
};
