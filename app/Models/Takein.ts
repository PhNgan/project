import { DateTime } from 'luxon'
import { BaseModel, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import User from './User'

export default class Takein extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public invoiceNumberImport : string

  @column()
  public shopId: number

  @column()
  public productId: number

  @column()
  public supplierId: number

  @column()
  public amount: number

  @column.dateTime()
  public dateImport: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Supplier)
  public supplier:HasOne<typeof Supplier>

  @hasOne(() => User)
  public user:HasOne<typeof User>
}
