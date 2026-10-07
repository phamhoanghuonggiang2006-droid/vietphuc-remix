/**
 * BỘ ẢNH PRODUCT CATEGORIES CHUẨN XÁC 100% ĐƯỢC ĐỒNG BỘ TỪ THƯ MỤC CỦA GIANG
 * (Thư mục /Users/dannie/Downloads/ẢNH EN EN EN/)
 * Khóa cứng an toàn vào mã nguồn tĩnh của Webapp, đồng bộ tuyệt đối 3 màn hình.
 */

export const DEFAULT_PRODUCT_IMAGES: Record<string, string> = {
  // 1. Áo Ngoài Cổ Phục (Garments)
  'ao-tac': '/products/ao-tac.jpg',
  'ao-nhat-binh': '/products/ao-nhat-binh.jpg',
  'ngu-than-tay-chen': '/products/ngu-than-tay-chen.jpeg',

  // 2. Khuy Cúc Áo (Buttons)
  'btn-metal-copper': '/1.png',
  'btn-jade-green': '/2.png',
  'btn-wood-agarwood': '/3.png',
  'btn-silver-lotus': '/products/btn-silver-lotus.png',
  'btn-mother-of-pearl': '/products/btn-mother-of-pearl.png',
  'btn-chinese-cloth': '/products/btn-chinese-cloth.png',

  // 3. Lót Trong Đơn Y (Layer)
  'layer-don-y-white': '/products/layer-don-y-white.png',
  'layer-none': '',

  // 4. Thân Dưới (Bottoms)
  'bottom-silk-wide-pants': '/products/bottom-silk-wide-pants.jpg',
  'bottom-linen-wide-pants': '/5.png',
  'bottom-pleated-midi-skirt': '/6.png',
  'bottom-high-waist-jeans': '/7.png',
  'bottom-tailored-wide-leg': '/products/bottom-tailored-wide-leg.png',
  'bottom-cargo-pants': '/products/bottom-cargo-pants.jpeg',
  'bottom-jorts-denim': '/products/bottom-jorts-denim.png',
  'bottom-y2k-pleated-skirt': '/products/bottom-y2k-pleated-skirt.png',

  // 5. Giày / Guốc (Shoes)
  'shoes-wooden-clogs': '/8.png',
  'shoes-embroidered-slippers': '/9.png',
  'shoes-flat-straw-slippers': '/products/shoes-flat-straw-slippers.png',
  'shoes-white-sneakers': '/10.png',
  'shoes-chunky-loafers': '/products/shoes-chunky-loafers.jpeg',
  'shoes-mules-leather': '/products/shoes-mules-leather.png',
  'shoes-boots-dr-martens': '/products/shoes-boots-dr-martens.jpeg',
  'shoes-skater-vans': '/products/shoes-skater-vans.jpeg',
  'shoes-platform-mary-jane': '/products/shoes-platform-mary-jane.jpeg',

  // 6. Phụ Kiện (Accessories)
  'acc-khan-dong': '/products/acc-khan-dong.jpg',
  'acc-khan-vanh-day': '/products/acc-khan-vanh-day.png',
  'acc-tram-phuong': '/products/acc-tram-phuong.jpg',
  'acc-kim-uoc': '/products/acc-kim-uoc.jpg',
  'acc-kieng-bac': '/products/acc-kieng-bac.jpeg',
  'acc-leather-tote': '/products/acc-leather-tote.png',
  'acc-sunglasses-gold': '/products/acc-sunglasses-gold.png',
  'acc-silver-chain-cuban': '/products/acc-silver-chain-cuban.png',
  'acc-bucket-hat': '/products/acc-bucket-hat.png',
  'acc-chest-bag': '/products/acc-chest-bag.png',
  'acc-chunky-sunglasses': '/products/acc-chunky-sunglasses.png',
  'acc-metal-earrings': '/products/acc-metal-earrings.png',
  'acc-smartwatch': '/products/acc-smartwatch.png',
  'acc-paper-fan': '/11.png',
  'acc-jade-pendant': '/13.png',
  'acc-turban': '/products/acc-turban.jpg'
};

/**
 * BỘ ẢNH MA NƠ CANH 2D TÁCH NỀN (CANVAS 2D LAYER)
 * Được nạp trực tiếp từ thư mục 2D chuyên biệt của Giang (/Users/dannie/Downloads/ẢNH 2D MANOCANH/)
 * Giữ nguyên định dạng PNG trong suốt, xếp lớp chuẩn form cơ thể ma-nơ-canh.
 */
export const DEFAULT_2D_CANVAS_IMAGES: Record<string, string> = {
  // 1. Thân Dưới (Bottoms)
  'bottom-silk-wide-pants': '/canvas/canvas-bottom-silk-wide-pants.png',
  'bottom-linen-wide-pants': '/canvas/canvas-quan-linen.png',
  'bottom-pleated-midi-skirt': '/canvas/canvas-vay-xep-ly.png',
  'bottom-high-waist-jeans': '/canvas/canvas-quan-jeans.png',
  'bottom-tailored-wide-leg': '/canvas/canvas-bottom-tailored-wide-leg.png',
  'bottom-cargo-pants': '/canvas/canvas-bottom-cargo-pants.png',
  'bottom-jorts-denim': '/canvas/canvas-bottom-jorts-denim.png',
  'bottom-y2k-pleated-skirt': '/canvas/canvas-bottom-y2k-pleated-skirt.png',

  // 2. Giày / Guốc (Shoes)
  'shoes-wooden-clogs': '/canvas/canvas-guoc-moc.png',
  'shoes-embroidered-slippers': '/canvas/canvas-hai-theu.png',
  'shoes-flat-straw-slippers': '/canvas/canvas-shoes-flat-straw-slippers.png',
  'shoes-white-sneakers': '/canvas/canvas-sneakers.png',
  'shoes-chunky-loafers': '/canvas/canvas-shoes-chunky-loafers.png',
  'shoes-mules-leather': '/canvas/canvas-shoes-mules-leather.png',
  'shoes-boots-dr-martens': '/canvas/canvas-shoes-boots-dr-martens.png',
  'shoes-skater-vans': '/canvas/canvas-shoes-skater-vans.png',
  'shoes-platform-mary-jane': '/canvas/canvas-shoes-platform-mary-jane.png',

  // 3. Phụ Kiện (Accessories)
  'acc-khan-dong': '/canvas/canvas-acc-khan-dong.png',
  'acc-khan-vanh-day': '/canvas/canvas-acc-khan-vanh-day.png',
  'acc-tram-phuong': '/canvas/canvas-acc-tram-phuong.png',
  'acc-kim-uoc': '/canvas/canvas-acc-kim-uoc.png',
  'acc-kieng-bac': '/canvas/canvas-acc-kieng-bac.png',
  'acc-leather-tote': '/canvas/canvas-acc-leather-tote.png',
  'acc-sunglasses-gold': '/canvas/canvas-acc-sunglasses-gold.png',
  'acc-silver-chain-cuban': '/canvas/canvas-acc-silver-chain-cuban.png',
  'acc-bucket-hat': '/canvas/canvas-acc-bucket-hat.png',
  'acc-chest-bag': '/canvas/canvas-acc-chest-bag.png',
  'acc-chunky-sunglasses': '/canvas/canvas-acc-chunky-sunglasses.png',
  'acc-metal-earrings': '/canvas/canvas-acc-metal-earrings.png',
  'acc-smartwatch': '/canvas/canvas-dong-ho.png',
  'acc-paper-fan': '/canvas/canvas-quat-giay.png',
  'acc-jade-pendant': '/canvas/canvas-boi-ngoc.png',
  'acc-turban': '/products/acc-turban.jpg'
};

export default DEFAULT_PRODUCT_IMAGES;