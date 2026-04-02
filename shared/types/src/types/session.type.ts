export interface User {
  email: string;
  name: string;
  company: string;
  avatar?: {
    src: string;
    alt: string;
  };
}

export interface SecureSessionData {
  authToken?: string;
}

export interface UserSession {
  /**
   * Session ID
   */
  id: string;
  /**
   * User session data, available on client and server
   */
  user?: User;
  /**
   * Private session data, only available on server/ code
   */
  secure?: SecureSessionData;
  /**
   * Extra session data, available on client and server
   */
  [key: string]: unknown;
}
