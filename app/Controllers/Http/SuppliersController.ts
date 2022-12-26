
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema} from '@ioc:Adonis/Core/Validator'
import Supplier from 'App/Models/Supplier'

export default class SuppliersController {
    //create
    public async createSupplier({request,auth, response}:HttpContextContract){
        const user = await auth.use("api").user
        const newSupplier = schema.create({
            name: schema.string({}),
            phone: schema.string({}),
            taxCode: schema.string({}),
            address: schema.string({}),
            status: schema.string({}),
        })
        const val = await request.validate({schema: newSupplier})
        const supplier = await Supplier.create(val)
        supplier.merge({"shopId":user?.id}).save()
        response.status(200).json({
            supplier,
            message: "Thêm mới"
        })
    }
    //fix
    public async updateSupplier({params,request,response, bouncer}: HttpContextContract){
        const body = request.body()
        try{
            const supplier = await Supplier.findOrFail(params.id)
            try{
                await bouncer.with("SupplierPolicy").authorize("fix",supplier)
                supplier.name = body.name
                supplier.phone = body.phone
                supplier.taxCode = body.taxCode
                supplier.address = body.address
                supplier.status = body.status
                await supplier.save()
                return response.status(200).json({
                    body,
                    message: "Thay doi"
                })
            }
            catch(err){
                return response.status(500).json({
                    message: "Không đu thẩm quyền"
                })
            }
        }
        catch(err){
            return response.status(400).json({
                message: "Không"
            })
        }
    }
    //get 
    public async getSupplier({params,response, bouncer}: HttpContextContract){
        try{
            const supplier = await Supplier.findOrFail(params.id)
            try{
                await bouncer.with("SupplierPolicy").authorize("view",supplier)
                return response.status(200).json({
                    supplier,
                    message: "....."
                })
            }
            catch(err){
                return response.status(500).json({
                    message: "Không đủ thẩm quyền"
                })
            }
        }
        catch (err){
            return response.status(400).json({
                message: "không"
            })
        }
    }
    //getAll
    public async getAllSuppliers({response,auth}: HttpContextContract){
        const user = await auth.use("api").user
    
            const suppliers = await Supplier.query().select("*").orderBy("name","asc").where("shop_id",user?.id)
            if(suppliers.length === 0){
                return response.status(400).json({
                    message:"Không tìm thấy thông tin"
                })
            }
            else{
                return response.status(200).json({
                    suppliers,
                    message: "thông tin NCC được hiển thị"
                })
            }
        
    }
}