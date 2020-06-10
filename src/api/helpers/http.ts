async function fetchWithTimeout(
  url: string,
  options = {},
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

export async function get<T>(path: string, accessToken: string): Promise<T> {
  try {
    const response = await fetchWithTimeout(
      `${process.env.REACT_APP_SERVER_BASE_URL}${path}`,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          authorization: `Bearer ${accessToken}`,
        }),
      }
    );
    return response.json();
  } catch (ex) {
    console.error(ex.message);
    throw ex;
  }
}

// async function post<T>(url: string, body: T) {
//   try {
//     const { getIdTokenClaims } = useAuth0();
//     const accessToken = await getIdTokenClaims();
//     const response = await fetch(
//       `${process.env.REACT_APP_SERVER_BASE_URL}/blog/post`,
//       {
//         method: 'post',
//         headers: new Headers({
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//           authorization: `Bearer ${accessToken.__raw}`,
//         }),
//         body: JSON.stringify(body),
//       }
//     );
//     return response.ok;
//   } catch (ex) {
//     return false;
//   }
// }
