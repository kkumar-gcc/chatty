import { AnySchema, object } from "yup";
import { Request, Response, NextFunction } from "express";
import log from "../logger";

const validate = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params,
        }, { abortEarly: false });
        return next();
    } catch (e: any) {
        if (e.name === "ValidationError") {
           const errors = {} as any;

            e.inner.forEach((x: any) => {
                if (x.path !== undefined) {
                  const  z =(x.path).slice(5);
                    errors[z] = x.errors;
                }
            });
            req.flash("errors",errors);
            return  res.redirect("back");
        }
        return res.status(500).send("Something went wrong");
    }
}

export default validate;