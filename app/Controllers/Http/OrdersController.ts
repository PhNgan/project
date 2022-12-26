import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema} from '@ioc:Adonis/Core/Validator'
import Order from 'App/Models/Order'

export default class OrdersController {
    add
    public async createOrder({request,auth, response}:HttpContextContract){
        const user = await auth.use("api").user
        const newOrder = schema.create({
           invoiceNumber: schema.string({}),
           productId: schema.number(),
           customerId: schema.number(),
           amount: schema.number() 
        })
        const val = await request.validate({schema: newOrder})
        const order = await Order.create(val)
        order.merge({"shopId": user?.id}).save()
        response.status(200).json({
            order,
            message: "....."
        })
    }
    //fix
    public async updateOrder({params, request,response,auth, bouncer}: HttpContextContract){
        await auth.use("api").user
        const body= request.body()
        try{
            const order = await Order.findOrFail(params.id)
            try{
                await bouncer.with("OrderPolicy").authorize("fix",order)
                order.invoiceNumber = body.invoiceNumber
                order.productId = body.productId
                order.customerId = body.customerId
                order.amount = body.amount
                await order.save()
                return response.status(200).json({
                    body,
                    message: "...."
                })
            }
            catch(err){
                return response.status(500).json({
                    message:"Không đủ thẩm quyền"
                })
            }
        }
        catch(err){
            return response.status(400).json({
                message: "không tìm thấy thông tin"
            })
        }
    }
    //get by invoiceNumber
    public async getOrder({request, response,auth}:HttpContextContract){
        const user = await auth.use("api").user
        const {key = "invoiceNumber", sort = "desc", ...input} = request.qs()
        const result = await Order.query().filter(input).select("*").orderBy(key).where("shop_id",user?.id)
        if(result.length == 0){
            return response.status(400).json({
                message: "khoong"
            })
        }
        else{
            return response.status(200).json({
                result,
                message:"Tim duoc"
            })
        }
    }
    //delete
    public async deleteOrder({response,auth,bouncer,params}:HttpContextContract){
        await auth.use("api").user
        try{
            const order = await Order.findOrFail(params.id)
            try{
                await bouncer.with("OrderPolicy").authorize("delete", order)
                await order.delete()
                return response.status(200).json({
                    message: "delete complete"
                })
            }
            catch(error){
                return response.status(400).json({
                    message:"không đu thẩm quyền"
                })
            }
        }
        catch(error){
            return response.status(500).json({
                message: "Không tìm thấy thông tin"
            })
        }
    }    
}
