import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import * as cors from 'cors';
import * as path from 'path';
import routes from "../routes";
import { DashboardRoutes } from "../routes/DashboardRoutes";

const BODY_PARSER_LIMIT = process.env.BODY_PARSER_LIMIT || '50mb';
class App {
    public app: express.Application;

    public constructor() {
        this.app = express();
        this.config();
    }

    private config(): void {
        // enable logging
        switch (process.env.NODE_ENV) {
            case 'production':
                this.app.use(morgan('combined'));
            case 'development':
                this.app.use(morgan('dev'));
            default:
                break;
        }
        // support application/json type post data
        this.app.use(bodyParser.json());
        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        this.app.use(bodyParser.urlencoded({ limit: BODY_PARSER_LIMIT, extended: false }));

        // parse application/json
        this.app.use(bodyParser.json({ limit: BODY_PARSER_LIMIT }));

        // set the default view engine to ejs
        this.app.set('view engine', 'ejs');

        // set the views directory for load tmplates
        this.app.set('views', path.join(__dirname, '../templates'));

        // set public directory for assests
        this.app.use('/assets', express.static(path.join(__dirname, '../public')));

        this.app.use(function(req, res, next) {
            console.log(' Route => ',req.route);
            if (!req.route){
            }
                // return DashboardRoutes.notFound(res);
            next();
        });

        // Call midlewares
        this.app.use(cors());
        this.app.use("/", routes);
    }

}

export default new App().app;