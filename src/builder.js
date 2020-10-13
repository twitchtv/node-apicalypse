class Builder {
  constructor() {
    this.resetQueryFields();
  }

  resetQueryFields() {
    this.queryFields = {
      where: [],
    };
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
      this.queryFields.fields = `fields ${fieldsString}`;
    }
    return this;
  }

  exclude(exclude) {
    if (exclude) {
      let excludeString =
        exclude && exclude.constructor === Array ? exclude.join(",") : exclude;
      excludeString = excludeString ? excludeString.replace(/\s/g, "") : "";
      this.queryFields.exclude = `exclude ${excludeString}`;
    }
    return this;
  }

  sort(field, direction) {
    if (field) {
      if (
        field.toLowerCase().endsWith(" desc") ||
        field.toLowerCase().endsWith(" asc")
      ) {
        this.queryFields.sort = `sort ${field}`;
      } else {
        this.queryFields.sort = `sort ${field} ${direction || "asc"}`;
      }
    }
    return this;
  }

  limit(limit) {
    if (limit) {
      this.queryFields.limit = `limit ${limit}`;
    }
    return this;
  }

  offset(offset) {
    if (offset) {
      this.queryFields.offset = `offset ${offset}`;
    }
    return this;
  }

  search(search) {
    if (search) {
      this.queryFields.search = `search "${search}"`;
    }
    return this;
  }

  where(filters) {
    if (filters) {
      if (filters.constructor === Array) {
        this.queryFields.where.push(`where ${filters.join(" & ")}`);
      } else {
        this.queryFields.where.push(`where ${filters.trim()}`);
      }
    }
    return this;
  }

  build() {
    const { where, ...rest } = this.queryFields;
    this.apicalypse =
      Object.keys(this.queryFields).length > 1 ||
      this.queryFields.where.length > 1
        ? Object.values(rest).concat(where).join(";") + ";"
        : "";
    return this;
  }

  buildMulti(queries) {
    this.apicalypse = queries
      .map((q) => {
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
