import { count } from 'console';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
let ipify = require ('ipify');
let axios = require('axios');

var options = {
  "method": "get",
  "url": "https://freegeoip.app/json/",
  "headers": {
    "accept": "application/json",
    "content-type": "application/json"
  }
};

export default async (req, res) => {

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
    ipAddress: resultIp,
    country: countryCode,
    state: stateCode, 
    city: cityCode,
    linkedIn: 'https://www.linkedin.com/in/christopherjcarrillo/',
    instagram: 'https://www.instagram.com/chrisjcarrillo/',
    github: 'https://github.com/chrisjcarrillo',
  });

}
