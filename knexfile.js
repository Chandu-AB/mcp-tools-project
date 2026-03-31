export default {

  development: {
    client: 'mysql2',
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "chandu@2003",
      database: "api_db"
    },

    migrations: {
      directory: "./migrations"
    },

    seeds: {
      directory: "./seeds"
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user: 'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};