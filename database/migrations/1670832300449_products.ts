import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer("shop_id").notNullable()
      table.integer("category_id").unsigned()
      table.string("name",255).notNullable()
      table.string("plu",100).notNullable()
      table.string("bar_code",100).notNullable()
      table.string("description",255).nullable()
      table.integer("price").defaultTo(0)
      table.integer("inventory").defaultTo(0)
      table.string("image",255).nullable()
      table.string("unit",50).nullable()
      table.string("status").defaultTo("active")

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
