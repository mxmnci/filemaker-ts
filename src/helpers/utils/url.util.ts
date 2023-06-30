/**
 * Get the base url for the current host, database and layout
 * @param options The options to use
 * @returns The base url
 */
export function getBaseURL({
  host,
  database,
  layout,
}: {
  host: string;
  database: string;
  layout?: string;
}) {
  if (!layout) {
    return `${host}/fmi/data/v1/databases/${database}`;
  }

  return `${host}/fmi/data/v1/databases/${database}/layouts/${layout}`;
}
