declare module "ldapjs-client" {
  interface LdapClientOptions {
    url: string;
  }

  interface SearchOptions {
    scope: string;
    filter: string;
    attributes: string[];
  }

  class LdapClient {
    constructor(options: LdapClientOptions);
    bind(username: string, password: string): Promise<void>;
    search(base: string, options: SearchOptions): AsyncIterableIterator<any>;
  }

  export default LdapClient;
}
