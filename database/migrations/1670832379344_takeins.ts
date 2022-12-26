import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'takeins'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string("invoice_number_import").notNullable()
      table.integer("shop_id").unsigned()
      table.integer("product_id").unsigned()
      table.integer("supplier_id").unsigned()
      table.integer("amount").defaultTo(0)
      table.dateTime("dateImport")

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
