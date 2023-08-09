import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async (url, userData = undefined) => {
  try {
    const fetchPost = userData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        })
      : fetch(url);
    const res = await Promise.race([fetchPost, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} and ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

// export const getJSON = async url => {
//   try {
//     const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message} and ${res.status}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// export const sendJSON = async (url, userdata) => {
//   try {
//     const fetchPost = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userdata),
//     });
//     const res = await Promise.race([fetchPost, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();
//     if (!res.ok) throw new Error(`${data.message} and ${res.status}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
