import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema} from'@ioc:Adonis/Core/Validator'
import Category from 'App/Models/Category'
import Product from 'App/Models/Product'

export default class ProductsController {
//tạo mới
    public async insertProduct ({request,auth,response}: HttpContextContract){
        const user = await auth.use("api").user
        const newProduct = schema.create({
            name: schema.string({trim: true}),
            plu: schema.string({}),
            barCode: schema.string({}),
            description: schema.string({trim: true}),
            price: schema.number(),
            inventory: schema.number(),
            image: schema.string(),
            unit: schema.string({}),
            status: schema.string(),
            categoryId: schema.number(), 
        })
        const payload = await request.validate({schema: newProduct})
        const product = await Product.create({
            name: payload.name,
            plu: payload.plu,
            barCode: payload.barCode,
            description: payload.description,
            price: payload.price,
            inventory: payload.inventory,
            image: payload.image,
            unit: payload.unit,
            status: payload.status,
            categoryId: payload.categoryId,
        })
        try{
            await Category.findOrFail(payload.categoryId)
            product.merge({"shopId" : user?.id}).save()
            return response.status(200).json({
                product,
                message: "tạo mới thành công"
            })
        }
        catch(error){
            return response.status(400).json({
                error,
                message: "tạo mới thất bại"
            })
        }
    }
    //fix
    public async updateProduct({params, response, request, bouncer}: HttpContextContract){
        try{
            const data = request.only([
                "name",
                "plu",
                "barCode",
                "description",
                "price",
                "inventory",
                "image",
                "unit",
                "status",
                "categoryId"
            ])
            const product = await Product.findOrFail(params.id)
            try{
                await bouncer.with("ProductPolicy").authorize("fix",product)
                await product.merge(data).save()
                return response.status(200).json({
                    product,
                    message: "thay doi"
                    })
                }
            catch(err){
                return response.status(400).json({
                    err,
                    message:"không đủ thẩm quyền"
                })
            }
        }
        catch (error){
            return response.status(400).json({
                message: "Không tìm thấy thông tin"
            })
        }
    }
    //get
    public async getProduct({response,bouncer, params}: HttpContextContract){
        try{
            const product = await Product.findOrFail(params.id)
            try{
                await bouncer.with("ProductPolicy").authorize("view",product)
                return response.status(200).json({
                    product,
                    message: "lấy thông tin thành công"
                    })
                }
            catch (err){
                return response.status(400).json({
                    message: "Không đủ thẩm quyền"
                })
            }
        }
        catch(error){
            return response.status(400).json({
                message: "Không tìm  thấy thông tin"
            })
        }
    }
    //get by name
    public async searchProduct({request, response,auth}: HttpContextContract){
        const user = await auth.use("api").user
        const {key = "name", sort = "asc",...input} = request.qs()
        const result = await Product.query().filter(input).select("*").orderBy(key,sort).where("shop_id",user?.id)
        if (result.length == 0){
            return response.status(400).json({
                message: "Không tìm thấy thông tin"
            })
        }
        else{
            return response.status(200).json({
                result,
                message: "thông tin được tìm thấy"
            })
        }
    }
    // delete
    public async destroyProduct ({response, params, bouncer}: HttpContextContract){
        try{
            const product = await Product.findOrFail(params.id)
            try{
                await bouncer.with("ProductPolicy").authorize("delete",product)
                await product.delete()
                return response.status(200).json({
                    product,
                    message:"Xóa thông tin sản phẩm thành công"
                    })
                }
            catch(err){
                return response.status(400).json({
                    message: "không đủ thẩm quyền"
                })
            }
        }    
        catch(error){
            return response.status(400).json({
                message: "Không tìm thấy thông tin"
                })
            }
        }
}
