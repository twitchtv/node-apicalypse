class Builder {
  constructor() {
    this.filterArray = [];
  }

  query(endpoint, name) {
    this.queryEndpoint = endpoint;
    this.queryName = name;
    return this;
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
      if (
        field.toLowerCase().endsWith(" desc") ||
        field.toLowerCase().endsWith(" asc")
      ) {
        this.filterArray.push(`sort ${field}`);
      } else {
        this.filterArray.push(`sort ${field} ${direction || "asc"}`);
      }
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
      this.filterArray.push(`search "${search}"`);
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

  build() {
    this.apicalypse = this.filterArray.length
      ? this.filterArray.join(";") + ";"
      : "";
    return this;
  }

  buildMulti(queries) {
    this.apicalypse = queries
      .map(q => {
        const { queryEndpoint, queryName } = q;

        const apicalypse = q.build().apicalypse;
        return `query ${queryEndpoint} "${queryName}" { ${apicalypse} };`;
      })
      .join("");
    return this;
  }

  multi(queries) {
    this.isMulti = true;
    this.buildMulti(queries);
    return this;
  }
}

export default Builder;
