export default async queries => {
  const apicalypse = queries.map(q => {
    const { endpoint, name, query } = q;

    const apicalypse = query.build().apicalypse;
    return `query ${endpoint} "${name}" { ${apicalypse} };`;
  });
  this.apicalypse = apicalypse;
  return {
    request: url => {
      this.request(url, true);
    }
  };
};
