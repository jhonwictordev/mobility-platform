declare module 'bcrypt' {
  export function hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
  export function compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}

declare module 'passport-jwt' {
  export class Strategy {
    constructor(options: any, verify: any);
  }
  export const ExtractJwt: {
    fromAuthHeaderAsBearerToken(): any;
    fromUrlQueryParameter(param_name: string): any;
  };
}

declare module 'passport-local' {
  export class Strategy {
    constructor(options: any, verify: any);
  }
}
