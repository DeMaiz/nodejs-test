import { User } from "../entities/User";
import { validate } from "class-validator";
import { getRepository } from "typeorm";
const csv_parse = require('csv-parse/lib/sync');
const Joi = require('@hapi/joi');
import * as fs from 'fs';
import { Invoice } from "../entities/Invoice";
import * as moment from "moment";


export class InvoiceService {
    public async create(invoice): Promise<Invoice> {
        //Try to save. If fails, the username is already in use
        const invoiceRepository = getRepository(Invoice);
        try {
            let invoiceData = new Invoice();
            invoiceData.invoiceId = invoice.id;
            invoiceData.date = invoice.due_date;
            invoiceData.amount = invoice.amount;
            invoiceData.selling_price = this.calc_sellingPrice(invoice.amount,invoice.due_date);
            await invoiceRepository.save(invoiceData);
        } catch (e) {
            return Promise.reject(e);
        }

        //If all ok, send 201 response
        return Promise.resolve(invoice);
    }

    public async getAll(): Promise<Invoice[]> {
        const invoiceRepository = getRepository(Invoice);
        let invoices:Invoice[] = [];
        try {
            invoices = await invoiceRepository.find();
        } catch (error) {
            return Promise.reject({message: 'Unable to find the invoices, Please try again.'});
        }
        //If all ok, send 201 response
        return Promise.resolve(invoices);
    }

    public async upload(file){
        return new Promise((resolve,reject)=>{
            if(file){
                // ready file content
                const uploadFile = fs.readFileSync(file.path);
                // convert csv file content into JSON 
                let csvToJson :any = this.parse_csv(uploadFile);
                csvToJson.shift();
                csvToJson = this.validate(csvToJson);
                if (csvToJson.error) {
                   // throw error
                    reject(csvToJson.error.details);
                }else{
                    resolve(csvToJson);
                }
            }else{
                reject("File not found");
            }
        });
    }
    public parse_csv(file) {
        return csv_parse(file, {
            columns: ['id', 'amount', 'due_date'],
            skip_empty_lines: true
        });
    }

    public validate(data) {
        return Joi.validate(data, Joi.array().items({
            id: Joi.number().integer().required().label('Invoice Id'),
            amount: Joi.number().required().label('Invoice Amount'),
            due_date: Joi.string().isoDate().required().label('Due Date')
        }));
    }

    public calc_sellingPrice(amount, date) {
        let current = moment();
        let due_date = moment(date);
        let diff = due_date.diff(current, 'days');
        if (diff > 30) {
            return (amount * 0.5);
        } else {
            return (amount * 0.3);
        }
    }
}