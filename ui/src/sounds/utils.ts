export async function fetchMultipleJSON(urls: string[]): Promise<Object[]> {
  const settledPromises = await Promise.allSettled(
    urls.map(url =>
      fetch(url)
        .then(resp => resp.json())
        .catch(error => console.log(`Error: fetchJSONParallel: ${error}`))
    )
  );
  return settledPromises
    .filter(result => result.status === "fulfilled")
    .map((result: any) => result.value);
}

export function debug(msg: string[], force: boolean = false): void {
  var debug = false;
  if (debug || force) {
    console.log.apply(null, msg);
  }
}
