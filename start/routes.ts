/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post("/auth/register","AuthController.register")
Route.post("/auth/login","AuthController.login")
Route.get("/auth/logout","AuthController.logout")

Route.group(() => {
  Route.post("/create","CategoriesController.insertCategory")
  Route.put("/edit/:id","CategoriesController.editCategory")
  Route.get("/get","CategoriesController.getCategory")
  Route.delete("/delete/:id","CategoriesController.destroyCategory")
}).prefix("category")

Route.group(() => {
  Route.post("/create","CustomersController.createCustomer")
  Route.put("/edit/:id","CustomersController.editCustomer")
  Route.get("/get/:id","CustomersController.getCustomer")
  Route.get("/get","CustomersController.searchCustomer")
  Route.delete("/delete/:id","CustomersController.destroyCustomer")
}).prefix("customer")

Route.group(() => {
  Route.put("/edit/:id","ProductsController.updateProduct")
  Route.get("/get/:id","ProductsController.getProduct")
  Route.get("/get","ProductsController.searchProduct")
  Route.delete("/delete/:id","ProductsController.destroyProduct")
  Route.post("/create","ProductsController.insertProduct")
}).prefix("product")

Route.group(() =>{
  Route.post("/create","SuppliersController.createSupplier")
  Route.put("/edit/:id","SuppliersController.updateSupplier")
  Route.get("/get/:id","SuppliersController.getSupplier")
  Route.get("/get","SuppliersController.getAllSuppliers")
}).prefix("supplier")

Route.group(() =>{
  Route.post("/create","OrdersController.createOrder")
  Route.put("/edit/:id","OrdersController.updateOrder")
  Route.get("/get","OrdersController.getOrder")
  Route.delete("/delete/:id","OrdersController.deleteOrder")
}).prefix("order")

Route.group(() => {
  Route.post("/create","TakeinsController.createTake")
  Route.put("/edit/:id","TakeinsController.updateTakein")
  Route.get("/get/:id","TakeinsController.getTakein")
  Route.delete("/delete/:id","TakeinsController.deleteTakein")
}).prefix("takein")