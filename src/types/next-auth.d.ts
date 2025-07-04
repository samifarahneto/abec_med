import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    accessToken?: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      accessToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken?: string;
  }
}
