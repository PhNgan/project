import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema} from '@ioc:Adonis/Core/Validator'
import Customer from 'App/Models/Customer'

export default class CustomersController {
    //add
    public async createCustomer({request,auth, response}:HttpContextContract){
        const user = await auth.use("api").user
        const newCustomer = schema.create({
            name: schema.string({trim:true}),
            phone: schema.string({}),
            address: schema.string({})
        })
        const val = await request.validate({schema:newCustomer})
        const customer = await Customer.create(val)
        customer.merge({"shopId": user?.id}).save()
        response.status(200).json({
            customer,
            message: "Thêm mới khách hàng thành công"
        })
    }
    //fix
    public async editCustomer({params, request, response,auth, bouncer}: HttpContextContract){
        await auth.use("api").user
        const body = request.body()
        try{
            const customer = await Customer.findOrFail(params.id)
            await bouncer.with("CustomerPolicy").authorize("fix",customer)
            customer.name = body.name
            customer.phone = body.phone
            customer.address = body.address
            await customer.save()
            return response.status(200).json({
                body,
                message: "Thay đổi thông tin khách hàng thành công"
            })
        }
        catch(err){
            return response.status(400).json({
                message: "Không tìm thấy thông tin"
            })
        }
    }
    //get 
    public async getCustomer({params,auth, response, bouncer}:HttpContextContract){
        await auth.use("api").user
        try{
            const customer = await Customer.findOrFail(params.id)
            await bouncer.with("CustomerPolicy").authorize("view",customer)
            return response.status(200).json({
                customer,
                message:"Lấy thông tin thành công"
            })
        }
        catch(err){
            return response.status(400).json({
                err,
                message: "Không tìm thấy thông tin"
            })
        }
    }
    //search with name or phone
    public async searchCustomer({request, response,auth}:HttpContextContract){
        const user = await auth.use("api").user
        const {key = "phone", sort = "asc", ...input} = request.qs()
        const result = await Customer.query().filter(input).select("*").orderBy(key,sort).where("shop_id",user?.id)
        if (result.length == 0 ){
            return response.status(400).json({
                message: "Không tìm thấy  thông tin"
            })
        } 
        else{
            return response.status(200).json({
                result,
                message: "Thông tin được tìm thấy"
            })
        }
    }
    //delete
    public async destroyCustomer({params,auth, response, bouncer}:HttpContextContract){
        await auth.use("api").user
        try{
            const customer = await Customer.findOrFail(params.id)
            try{
                await bouncer.with("CustomerPolicy").authorize("delete",customer)
                await customer.delete()
                return response.status(200).json({
                    customer,
                    message:"Xóa thông tin khách hàng thành công"
                })
            }
            catch(err){
                return response.status(400).json({
                    message:"Không đủ thẩm quyền"
                })
            }
        }
        catch (err){
            return response.status(400).json({
                message: "Không tìm thấy thông tin khách hàng"
            })
        }
    }
}
