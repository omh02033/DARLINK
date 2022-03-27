import { Cookies } from 'react-cookie';

const cookies = new Cookies();

export const setCookie = (name: string, value: string, option?: object) => {
  return void cookies.set(name, value, {...option});
}

export const getCookie = (name: string) => {
  return cookies.get(name);
}

export const removeCookie = (name: string) => {
  return void cookies.remove(name);
}