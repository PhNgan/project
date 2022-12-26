import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import Order from './Order'
import Takein from './Takein'
import {compose} from '@ioc:Adonis/Core/Helpers'
import { Filterable  } from '@ioc:Adonis/Addons/LucidFilter'
import ProductFilter from './Filters/ProductFilter'
import User from './User'


export default class Product extends compose (BaseModel, Filterable){

  public static $filter = () => ProductFilter
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public shopId: number

  @column()
  public categoryId: number

  @column()
  public name: string

  @column()
  public plu: string

  @column()
  public barCode: string

  @column()
  public description: string

  @column()
  public price: number

  @column()
  public inventory: number

  @column()
  public image: string

  @column()
  public unit: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Category)
  public categories:HasOne<typeof Category>

  @hasOne(() => User)
  public users: HasOne<typeof User>

  @hasMany(() => Order)
  public orders:HasMany<typeof Order>

  @hasMany(() => Takein)
  public takeins: HasMany<typeof Takein>
}
