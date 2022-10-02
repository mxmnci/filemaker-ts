import { Http } from './helpers/Http';

export const test = () => {
  const http = new Http({
    host: 'https://crm.primesolarsolutions.com',
    database: 'Prime_Solar',
    password: '#BDxfy6dXsE6k%AR3cJ&!ejGP',
    user: 'export@primehomesolutions.com',
  });

  console.log(http.get('/Leads_DAPI/records/1'));
};
