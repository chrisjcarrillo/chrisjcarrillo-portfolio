import { count } from 'console';
import next from 'next';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let ipify = require ('ipify');
let axios = require('axios');
let requestIp = require('request-ip');


// require request-ip and register it as middleware

const connectMiddleware = handler => async (req, res) => {
  
  return handler(req, res);
}


export default async (req, res) => {
  
  res.statusCode = 200;
  
  res.json({ 
    alias: 'Chris',
    firstName: 'Christopher',
    lastName: 'Carrillo',
    email: 'chrisjcarrillo@hotmail.com',
    linkedIn: 'https://www.linkedin.com/in/christopherjcarrillo/',
    instagram: 'https://www.instagram.com/chrisjcarrillo/',
    github: 'https://github.com/chrisjcarrillo',
  });

}
