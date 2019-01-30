import multi from "./multi";

class Builder {
  constructor() {
    this.filterArray = [];
    this.multi = multi;
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

  build() {
    this.apicalypse = this.filterArray ? this.filterArray.join(";") + ";" : "";
    return this;
  }
}

export default Builder;
