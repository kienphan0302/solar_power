import data from './products.json';
import grid from '../assets/solar/system-grid.png';
import storage5 from '../assets/solar/storage-5.png';
import storage8 from '../assets/solar/storage-8.png';
import storage12 from '../assets/solar/storage-12.png';
import storage16 from '../assets/solar/storage-16.png';
import storage20 from '../assets/solar/storage-20.png';
import type { ImageMetadata } from 'astro';
const images: Record<string, ImageMetadata> = { 'system-grid': grid, 'storage-5': storage5, 'storage-8': storage8, 'storage-12': storage12, 'storage-16': storage16, 'storage-20': storage20 };
export const products = data.map(p => ({ ...p, image: images[p.image], categoryLabel: p.category === 'luu-tru' ? 'Hybrid lưu trữ' : 'Hòa lưới bám tải' }));
export type Product = (typeof products)[number];
export const money = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(price);
export const productHref = (slug: string) => `/san-pham/${slug}/`;
export const categories = [
  { slug: 'hoa-luoi', name: 'Hòa lưới bám tải', eyebrow: 'TẬN DỤNG ĐIỆN BAN NGÀY', description: 'Giải pháp cần được tính toán theo phụ tải sử dụng trong ngày và điều kiện đấu nối tại công trình.', ideal: 'Gia đình, cửa hàng hoặc cơ sở có nhu cầu dùng điện ban ngày.', checks: ['Biểu đồ sử dụng điện trong ngày', 'Công suất tải và phương án bám tải', 'Diện tích, hướng mái và bóng che', 'Điều kiện đấu nối tại công trình'] },
  { slug: 'luu-tru', name: 'Hybrid lưu trữ', eyebrow: 'CÂN NHẮC NHU CẦU DỰ PHÒNG', description: 'Kết hợp hệ thống điện mặt trời và phương án lưu trữ theo nhu cầu dùng điện ngoài giờ nắng.', ideal: 'Khách hàng cần đánh giá thêm nhu cầu sử dụng điện buổi tối hoặc dự phòng.', checks: ['Thiết bị cần cấp điện và công suất tải', 'Thời gian dự phòng mong muốn', 'Dung lượng lưu trữ và thiết bị tương thích', 'Phạm vi tải dự phòng được thiết kế'] }
];
