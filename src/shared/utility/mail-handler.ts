/* eslint-disable prettier/prettier */

import FormData from "form-data";
/* import config from 'config'; */
import axios from "axios";
import { envs } from "config/env";


export const sendEmail = async(
    to: string,
    templateName: string,
    subject: string,
    templateVars: Record<string, any> = {},
) => {
    try {
        const form = new FormData();
    form.append('to', to);
    form.append('template', templateName);
    form.append('subject', subject);
    form.append(
        'from',
         'mailgun@sandbox737df8377dd44d7ab5d4ad340942e8c9.mailgun.org'
        );
    Object.keys(templateVars).forEach((key) => {
        form.append(`v:${key}`, templateVars[key]);
    });

    const username = 'api';
    const password = envs.privateApiKey;
    const token = Buffer.from(`${username}:${password}`).toString('base64');

    const response = await axios({
        method: 'post',
        url: `https://api.mailgun.net/v3/${envs.testDomain}/messages`,
        headers:{
            Autorization: `Basic ${token}`,
            contentType: 'multipart/form-data',
        },
        data:form,
    });    
    return response;
    } catch (error) {
        console.error(error);
    }
    
};