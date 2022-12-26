import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import {schema} from'@ioc:Adonis/Core/Validator'

export default class CategoriesController {
    // tạo mới
    public async insertCategory({request, response,auth, bouncer}: HttpContextContract){
        await auth.use("api").user
        try{
            await bouncer.authorize("checkAdmin")
            const newCategory = schema.create({
                name: schema.string({trim: true}),
                description: schema.string({trim: true}),
            })
            const payload = await request.validate({schema: newCategory})
            const category = await Category.create(payload)
            response.status(200).json({
                category,
                message: "tạo mới thành công"
            })
        }
        catch(err){
            return response.status(400).json({
                message: "không đủ thẩm quyền"
            })
        }   
    }
// sửa
    public async editCategory ({params,auth,request, response,bouncer}: HttpContextContract){
        const a = await auth.use("api").user
        console.log(a)
        const body = request.body()
        try{
            await bouncer.authorize("checkAdmin")
            try{
                const category = await Category.findOrFail(params.id)
                category.name = body.name
                category.description = body.description
                await category.save()
                return response.status(200).json({
                    body,
                    message: "thay đổi thông tin thành công"
                })
            }
            catch(error){
                return response.status(400).json({
                    message: "Không tìm thấy thông tin"
                })
            }    
        }
        catch(error){
            return response.status(400).json({
                error,
                message: "Không đủ thẩm quyền"
            })
        }
    }
        //lấy thông tin
        public async getCategory({response}: HttpContextContract){
        
            try{
                const category = await Category.query().select("*").orderBy("name","asc")
                return response.status(200).json({
                    category,
                    message:"Lấy thông tin danh mục thành công"
                })
            }
            catch(error){
                return response.status(400).json({
                    message:"không tìm thấy thông tin"
                })
            }
    }
    //xóa danh mục
    public async destroyCategory({params, response,bouncer}: HttpContextContract){
        try{
            await bouncer.authorize("checkAdmin")
            try{
                const category = await Category.findOrFail(params.id)
                await category.delete()
                return response.status(200).json({
                    category,
                    message:"xóa thông tin danh mục thành công"
                })
            }
            catch(error){
                return response.status(400).json({
                    message:"không tìm thấy thông tin"
                })
            }
        }
        catch (error){
            return response.status(500).json({
                message: "Không đủ thẩm quyền"
            })
        }
    }
}
