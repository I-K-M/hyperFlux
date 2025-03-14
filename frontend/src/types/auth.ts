export interface GoogleAuthResponse {
    credential: string;
    select_by?: string;
}

export interface GoogleAuthError {
    error: string;
    details?: string;
}

export interface AuthProps {
    handleAuthentication: (response: boolean) => void;
  }

  export interface LogOutProps {
    handleLogOut: (response: boolean) => void;
  }
  