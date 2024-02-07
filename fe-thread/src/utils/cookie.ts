export default new (class Cookie {
  get(key: string) {
    const name = key + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  set(key: string, value: string) {
    document.cookie = `${key}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; SameSite=Lax`;
  }

  remove(key: string) {
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970;path=/;SameSite=secure`;
  }
})();
