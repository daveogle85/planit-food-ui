export enum RestVerb {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
}

export type Options = {
  method: RestVerb;
  redirect: 'follow' | 'error' | 'manual' | undefined;
  headers: Headers;
  body?: string;
};
