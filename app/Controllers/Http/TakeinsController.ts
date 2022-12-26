import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema} from '@ioc:Adonis/Core/Validator'
import Takein from 'App/Models/Takein'

export default class TakeinsController {
    add
    public async createTake({request,auth, response}:HttpContextContract){
        const user = await auth.use("api").user
        const newOrder = schema.create({
           invoiceNumber: schema.string({}),
           productId: schema.number(),
           customerId: schema.number(),
           amount: schema.number() 
        })
        const val = await request.validate({schema: newOrder})
        const takein = await Takein.create(val)
        takein.merge({"shopId":user?.id})
        response.status(200).json({
            takein,
            message: "....."
        })
    }
    //fix
    public async updateTakein({params, request,response,auth, bouncer}: HttpContextContract){
        await auth.use("api").user
        const body= request.body()
        try{
            const takein = await Takein.findOrFail(params.id)
            try{
                await bouncer.with("TakeinPolicy").authorize("fix",takein)
                takein.invoiceNumberImport = body.invoiceNumberImport
                takein.productId = body.productId
                takein.supplierId = body.supplierId
                takein.amount = body.amount
                await takein.save()
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
    //get
    public async getTakein({response,auth,bouncer,params}: HttpContextContract){
        await auth.use("api").user
        try{
            const takein = await Takein.findOrFail(params.id)
            try{
                await bouncer.with("TakeinPolicy").authorize("view", takein)
                return response.status(200).json({
                    takein,
                    message:"tìm thấy"
                })
            }
            catch(error){
                return response.status(400).json({
                    message:"Không đủ thẩm quyền"
                })
            }
        }
        catch(error){
            return response.status(400).json({
                message: "Không tìm thấy thông tin"
            })
        }
    } 
    
    //delete
    public async deleteTakein({response,auth,bouncer,params}:HttpContextContract){
        await auth.use("api").user
        try{
            const takein = await Takein.findOrFail(params.id)
            try{
                await bouncer.with("TakeinPolicy").authorize("delete", takein)
                await takein.delete()
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

