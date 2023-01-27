export enum DBType {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
}

export interface DB {
  type: DBType;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

export interface JWT {
  secret: string;
  expiresIn: string;
}
