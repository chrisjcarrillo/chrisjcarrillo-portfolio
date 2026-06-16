// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
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
