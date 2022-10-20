export function encodeToBase64(str: string) {
  return Buffer.from(str).toString('base64');
}

export function generateEncodedAuthString(username: string, password: string) {
  return encodeToBase64(`${username}:${password}`);
}
