// Basic types for the application
export interface DataEntryForm {
  value1: number;
  value2: number;
  value3: number;
}

export interface LoginForm {
  email: string;
  password: string;
}

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    role: "USER" | "ADMIN";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: "USER" | "ADMIN";
    };
  }
}
