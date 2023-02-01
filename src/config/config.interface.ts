export enum DBType {
  POSTGRES = 'postgres',
  MYSQL = 'mysql',
}

export interface DB {
  type: DBType;
  RDS_HOSTNAME: string;
  RDS_PORT: number;
  RDS_USERNAME: string;
  RDS_PASSWORD: string;
  RDS_DB_NAME: string;
  synchronize: boolean;
}

export interface JWT {
  secret: string;
  expiresIn: string;
}
