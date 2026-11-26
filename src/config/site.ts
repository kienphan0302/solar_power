import contact from './contact.json';
export const site = {
  brand: 'HƯỚNG DƯƠNG SOLAR',
  company: contact.company,
  description: contact.description,
  // Public contact details; hotline confirmed by the owner on 23/11/2026.
  phone: contact.phone,
  phoneDisplay: /^0\d{9}$/.test(contact.phone) ? contact.phone.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3') : contact.phone,
  supportPhone: contact.phone,
  zalo: contact.zalo,
  email: contact.email,
  address: contact.address,
  hcmAddress: contact.hcmAddress,
  sourceUrl: 'https://diennangluongmattroisolar.com',
  productionUrl: 'https://solar-power-5w7.pages.dev',
  // Set false if a future staging copy should be excluded from indexing.
  readyToIndex: true
};
