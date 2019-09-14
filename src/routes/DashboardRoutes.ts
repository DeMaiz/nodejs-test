import { BaseRoutes } from './BaseRoutes';
import { Request, Response } from "express";
import { request } from 'https';

export class DashboardRoutes extends BaseRoutes {
    public constructor() {
        super();
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
        this.router.get('/upload',(request: Request, response: Response )=>{
            response.send('<h1>Upload page</h1>')
        });
        this.router.get('/invoices',(request: Request, response: Response )=>{
            response.send('<h1>Upload page</h1>')
        });
    }

    private layout(response: Response, data ={}): string {

        return response.render('layout/index',data);
    }

    public notFound(response: Response):void {
        // this.render(response,'404');
    }

    public render(response: Response, name: string, data ={},callback):object {
        response.render(name, data, (err,html)=>{
            if(err){
                console.log('error', err);
                return callback({
                    status: false
                });
            }else{
                return callback({
                    status: true,
                    html,
                })
            }
        });
        return
    }


}
