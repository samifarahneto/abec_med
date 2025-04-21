declare module "bcryptjs" {
  export function hash(
    password: string | Buffer,
    salt: number | string
  ): Promise<string>;
  export function hashSync(
    password: string | Buffer,
    salt: number | string
  ): string;
  export function compare(
    password: string | Buffer,
    hash: string
  ): Promise<boolean>;
  export function compareSync(password: string | Buffer, hash: string): boolean;
  export function genSalt(rounds?: number): Promise<string>;
  export function genSaltSync(rounds?: number): string;
  export function getRounds(hash: string): number;
}
