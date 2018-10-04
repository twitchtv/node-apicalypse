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

  filter(filters) {
    if (filters) {
      if (filters.constructor === Array) {
        this.filterArray.push(`filter ${filters.join(" & ")}`);
      } else {
        this.filterArray.push(`filter ${filters.trim()}`);
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
        options.data = this.apicalypse;
        break;
      }
    }

    return Object.assign(this.config, options);
  }

  async request(url) {
    const response = await axios(this.constructOptions(url));
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
