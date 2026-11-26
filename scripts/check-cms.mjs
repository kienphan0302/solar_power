import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
const read = p => JSON.parse(readFileSync(p,'utf8'));
const required = (v,k) => assert(typeof v === 'string' && v.trim(), k + ' is required');
const image = (v,k) => {
  if (!v) return;
  assert(typeof v === 'string' && /^\/images\/cms\/[a-zA-Z0-9_./-]+\.(?:webp|jpe?g|png)$/i.test(v) && !v.split('/').includes('..'), k + ': invalid image path');
  assert(existsSync(join('public',v.slice(1))),k + ': missing image ' + v);
};
const contact=read('src/config/contact.json');
for (const k of ["company","description","phone","zalo","email","address","hcmAddress"]) required(contact[k],'contact.'+k);
assert(/^(0|\+84)[0-9]{9,10}$/.test(contact.phone),'Invalid hotline');
assert(/^https:\/\/zalo\.me\/[a-zA-Z0-9._-]+\/?$/.test(contact.zalo),'Invalid Zalo URL');
assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email),'Invalid email');
const banner=read('src/config/banner.json');
for (const k of ['eyebrow','heading','accent','description','primaryLabel','secondaryLabel','seoTitle']) required(banner[k],'banner.'+k);
image(banner.image,'banner.image');
const articles=readdirSync('src/data/articles').filter(n=>n.endsWith('.json'));
for(const slug of ["chon-hoa-luoi-hay-luu-tru","chuan-bi-truoc-khao-sat","doc-bao-gia-dien-mat-troi"]) assert(articles.includes(slug+'.json'),'Preserve article URL: '+slug);
for(const filename of articles) {
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*\.json$/.test(filename),'Invalid article filename '+filename);
  const item=read(join('src/data/articles',filename));
  for(const k of ['title','tag','summary']) required(item[k],filename+':'+k);
  assert(Array.isArray(item.sections)&&item.sections.length,filename+': add at least one section');
  for(const s of item.sections){required(s.title,filename+': section.title');required(s.text,filename+': section.text');}
  image(item.cover,filename+':cover');
}
const products=read('src/data/products.json');
assert(Array.isArray(products)&&products.length>0,'No products');
assert(new Set(products.map(p=>p.id)).size===products.length,'Duplicate product ID');
assert(new Set(products.map(p=>p.slug)).size===products.length,'Duplicate product slug');
for(const p of products){
  assert(Number.isInteger(p.id)&&/^[a-z0-9-]+$/.test(p.slug),'Invalid product ID/slug');
  required(p.name,p.slug+':name');
  assert(['hoa-luoi','luu-tru'].includes(p.category),'Invalid category '+p.slug);
  assert(['system-grid','storage-5','storage-8','storage-12','storage-16','storage-20'].includes(p.image),'Invalid fallback image '+p.slug);
  assert(Number.isFinite(p.capacity)&&p.capacity>0&&Number.isFinite(p.price)&&p.price>0,'Invalid capacity/price '+p.slug);
  image(p.cmsImage,p.slug+':cmsImage');
}
for(const id of [458,468,478,485]) assert(products.some(p=>p.id===id),'Missing featured product '+id);
console.log('CMS data validated:',products.length,'products,',articles.length,'articles');
