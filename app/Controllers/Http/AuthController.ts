import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {schema, rules} from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class AuthController {
    
    // đăng kí
    public async register({request,response, auth}:HttpContextContract){
        const validation = await schema.create ({
            name: schema.string(),
            phone: schema.number([
                rules.unique({table: "users", column:"phone"})
            ]),
            password:schema.string({},[
                rules.confirmed(),
                rules.minLength(6),
                rules.maxLength(50),  
            ]),
            image: schema.string()
        })
        try{
            const data = await request.validate ({schema:validation})
     
            const user = await User.create({
                name: data.name,
                phone: data.phone,
                password:data.password,
                image: data.image
                })
            return response.status(200).json({
                user,
                message:"đăng kí thành công"
            })
        }
        catch (error) {
            return response.status(400).json({
                error,
                message:"đăng kí thất bại"
            })    
        }
    }
    //đăng nhập
    public async login ({ auth, request, response }: HttpContextContract) {
        const phone = request.input('phone')
        const password = request.input('password')
        try {
            const token = await auth.use('api').attempt(phone, password)
            const data = await auth.use('api').verifyCredentials(phone, password)
            return response.status(200).json({
                data, 
                token,
                message: "Đăng nhập thành công!"
            })
          } catch (error) {
            return response.status(400).json({
                error,
                message: "SĐT hoặc mật khẩu không đúng"
            })
        }
    }      

    //sửa thông tin
     public async changeInfo ({request, response, params}:HttpContextContract) {
        
        const body = request.body()
        try{
            const user = await User.findOrFail(params.id)
            user.name = body.name
            user.password = body.password
            await user.save()
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

    //change pass
    public async changePassword ({request, response,auth}: HttpContextContract){
        const user = await auth.use("api").user
        const oldPass = request.input("oldPassword")
        const password = request.input("password")
        if(user){
            if(await Hash.verify(user.password, oldPass)){
                await user.merge({password:password}).save()
                return response.status(200).json({
                    user,
                    message:"Thay doi thanh cong"
                })
            }
            else{
                return response.status(400).json({
                    message: "MK cu ko chinh xac"
                })
            }
        }
        else{
            return response.status(400).json({
                message: "ko tim thay user"
            })
        }
    }
}
