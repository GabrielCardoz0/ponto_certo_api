export interface UsuarioRow {
  id: number;
  nome: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  isFirstAccess: boolean;
  acceptTermsAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/** Nunca inclui `password` — é o formato que sai pro front (login, /auth/me). */
export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  role: string;
  isFirstAccess: boolean;
}

/** Formato da listagem/gestão de usuários na área administrativa — também nunca inclui `password`. */
export interface UsuarioAdminDTO {
  id: number;
  nome: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}
