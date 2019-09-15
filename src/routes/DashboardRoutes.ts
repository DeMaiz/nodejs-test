import { BaseRoutes } from './BaseRoutes';
import { Request, Response } from "express";
import { request } from 'https';
import { resolve } from 'dns';
const multer = require('../middlewares/multer');

import {InvoiceService} from '../services/InvoiceService';
import { Invoice } from '../entities/Invoice';

export class DashboardRoutes extends BaseRoutes {
    private invoiceService: InvoiceService;
    public constructor() {
        super();
        this.invoiceService = new InvoiceService();
        this.routes();
    }

    public routes(): void {
        this.router.get('/', (request: Request, response: Response)=>{
            this.render(response,'dashboard',{},(result)=>{
                let data = {
                    content : ''
                }
                if(result && result.status){
                        data.content = result.html ;
                }
                this.layout(response,data);
            });
        });
        this.router.post('/invoice/upload',multer.single('invoice_csv'),async (req :Request, res: Response)=>{
            let file = req.file;
            const invoice = new InvoiceService();
            try {
                let invoiceData :any= await invoice.upload(file);
                for(let i=0; i < invoiceData.length; i++){
                    let row = invoiceData[i];
                    await this.invoiceService.create(row)
                }
                res.send(invoiceData);
            } catch (error) {
                console.log(error);
                res.send(error);
            }
            
        });
        this.router.get('/invoice/upload',(request: Request, response: Response )=>{
            this.render(response,'upload',{},(result)=>{
                let data = {
                    content : ''
                }
                if(result && result.status){
                        data.content = result.html ;
                }
                this.layout(response,data);
            });
        });
        this.router.get('/invoice/list',async (request:Request,response:Response)=>{
            try {
                const user:Invoice[] = await this.invoiceService.getAll();
                response.status(201).send({
                    status:true,
                    message: "Invoices data",
                    data: user
                });
            } catch (error) {
                response.status(404).send({
                    status: false,
                    error,
                    data:[]
                });
            }
        });
    }

}
