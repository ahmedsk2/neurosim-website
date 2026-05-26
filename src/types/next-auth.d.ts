import type { DefaultSession } from 'next-auth';

// Put the reviewer id + role onto the session/JWT so server gates and the dashboard
// can read them without `any` casts (Phase 3c). Mirrors the NeuroSim augmentation.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }
  interface User {
    id: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
