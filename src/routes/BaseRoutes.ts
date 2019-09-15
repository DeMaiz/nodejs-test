import { Router } from "express";
import { Request, Response } from "express";

export abstract class BaseRoutes {
    protected router = Router; 

    public constructor() {
        this.router = new Router();
    }

    public getRouter(): Router {
        return this.router;
    }

    public abstract routes(): void;

    public layout(response: Response, data ={}): string {

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