import mysql from "mysql2";
import config from "./index";
import { Knex, knex } from "knex";

const knexConfig: Knex.Config = {
  client: "mysql",
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.pwd,
    database: config.db.database,
    dateStrings: true
  },
};  // 데이터베이스 연결

export default knex(knexConfig);