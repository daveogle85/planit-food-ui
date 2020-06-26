import { RestVerb, Options } from './types';

async function fetchWithTimeout(
  url: string,
  options: Options,
  timeout = 5000
): Promise<Response> {
  const controller = new AbortController();
  const { signal } = controller;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout for request to ${url}`));
      controller.abort();
    }, timeout);
    fetch(url, { signal, ...options })
      .finally(() => clearTimeout(timer))
      .then(resolve, reject);
  });
}

export async function httpRequest<T, Body>(
  path: string,
  accessToken: string,
  method: RestVerb,
  body?: Body
): Promise<T> {
  try {
    const options: Options = {
      method,
      redirect: 'follow',
      headers: new Headers({
        'Content-Type': 'application/json',
        authorization: `Bearer ${accessToken}`,
      }),
    };

    if (method === RestVerb.POST || method === RestVerb.PUT) {
      options.body = JSON.stringify(body);
    }

    const response = await fetchWithTimeout(
      `${process.env.REACT_APP_SERVER_BASE_URL}${path}`,
      options
    );
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(
        'Request failed with status ' + response.status + response.statusText
      );
    }
  } catch (ex) {
    console.error(ex.message);
    throw ex;
  }
}
