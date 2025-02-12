export interface QueryFields {
  where: string[];
  fields?: string;
  exclude?: string;
  sort?: string;
  limit?: string;
  offset?: string;
  search?: string;
  [key: string]: string | string[] | undefined;
}

class Builder {
  protected queryFields: QueryFields = { where: [] };
  protected queryEndpoint?: string;
  protected queryName?: string;
  protected apicalypse: string = "";
  protected isMulti: boolean = false;

  constructor() {
    this.resetQueryFields();
  }

  protected resetQueryFields(): void {
    this.queryFields = {
      where: [],
    };
  }

  query(endpoint: string, name: string): this {
    this.queryEndpoint = endpoint;
    this.queryName = name;
    return this;
  }

  fields(fields: string | string[]): this {
    if (fields) {
      let fieldsString = Array.isArray(fields) ? fields.join(",") : fields;
      fieldsString = fieldsString ? fieldsString.replace(/\s/g, "") : "";
      this.queryFields.fields = `fields ${fieldsString}`;
    }
    return this;
  }

  exclude(exclude: string | string[]): this {
    if (exclude) {
      let excludeString = Array.isArray(exclude) ? exclude.join(",") : exclude;
      excludeString = excludeString ? excludeString.replace(/\s/g, "") : "";
      this.queryFields.exclude = `exclude ${excludeString}`;
    }
    return this;
  }

  sort(field: string, direction?: "asc" | "desc"): this {
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

  limit(limit: number): this {
    if (limit) {
      this.queryFields.limit = `limit ${limit}`;
    }
    return this;
  }

  offset(offset: number): this {
    if (offset) {
      this.queryFields.offset = `offset ${offset}`;
    }
    return this;
  }

  search(search: string): this {
    if (search) {
      this.queryFields.search = `search "${search}"`;
    }
    return this;
  }

  where(filters: string | string[]): this {
    if (filters) {
      if (Array.isArray(filters)) {
        this.queryFields.where.push(`where ${filters.join(" & ")}`);
      } else {
        this.queryFields.where.push(`where ${filters.trim()}`);
      }
    }
    return this;
  }

  build(): this {
    const { where, ...rest } = this.queryFields;
    this.apicalypse =
      Object.keys(this.queryFields).length > 1 ||
      this.queryFields.where.length > 1
        ? Object.values(rest).concat(where).join(";") + ";"
        : "";
    return this;
  }

  buildMulti(queries: Builder[]): this {
    this.apicalypse = queries
      .map((q) => {
        const { queryEndpoint, queryName } = q;

        const apicalypse = q.build().apicalypse;
        return `query ${queryEndpoint} "${queryName}" { ${apicalypse} };`;
      })
      .join("");
    return this;
  }

  multi(queries: Builder[]): this {
    this.isMulti = true;
    this.buildMulti(queries);
    return this;
  }
}

export default Builder;