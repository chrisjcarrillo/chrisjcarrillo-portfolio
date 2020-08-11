import { count } from 'console';
import next from 'next';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let ipify = require ('ipify');
let axios = require('axios');
let requestIp = require('request-ip');

var options = {
  "method": "get",
  "url": "https://freegeoip.app/json/",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json"
  }
};

// require request-ip and register it as middleware

const connectMiddleware = handler => async (req, res) => {
  
  return handler(req, res);
}


export default async (req, res) => {
  
  const getNewIp = requestIp.getClientIp(req);
  console.log(getNewIp);

  const resultIp = await ipify({useIPv6: true});
  const response = await axios(options);
  const currentData = response.data;
  const countryCode = currentData.country_code;
  const stateCode = currentData.region_code;
  const cityCode = currentData.city;

  res.statusCode = 200;
  
  res.json({ 
    alias: 'Chris',
    firstName: 'Christopher',
    lastName: 'Carrillo',
    email: 'chrisjcarrillo@hotmail.com',
    // countryCode: '+1',
    // phoneNumber: '786-868-3438',
    ipAddress: getNewIp,
    country: countryCode,
    state: stateCode, 
    city: cityCode,
    linkedIn: 'https://www.linkedin.com/in/christopherjcarrillo/',
    instagram: 'https://www.instagram.com/chrisjcarrillo/',
    github: 'https://github.com/chrisjcarrillo',
  });

}
