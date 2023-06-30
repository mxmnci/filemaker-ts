export function encodeToBase64(str: string) {
  return Buffer.from(str).toString('base64');
}

export function generateEncodedAuthString(username: string, password: string) {
  return encodeToBase64(`${username}:${password}`);
}

export function encodeObjectAsQueryString(
  obj:
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined
) {
  return new URLSearchParams(obj).toString();
}
