import { body } from "express-validator"
import { Error } from "mongoose"

const validateNewUser = () => {
    return [

        body('username')
            .trim()
            .trim().isLength({ min: 6 }).withMessage('Username en az 6 karakter olmalı')
            .isLength({ max: 20 }).withMessage('Username en fazla 20 karakter olmalı'),

        body('email')
            .trim().isEmail().withMessage('Geçerli bir Mail giriniz'),

        body('password')
            .trim().isLength({ min: 6 }).withMessage('Sifre en az 6 karakter olmalı')
            .isLength({ max: 20 }).withMessage('Sifre en fazla 20 karakter olmalı'),

          body('repassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords are not same');
            } 
            return true;
        }) 

    ];
}

export {

    validateNewUser,
}
