/**
 * ==============================================================================
 * KNOWLEDGE BASE & PRODUCT CATEGORIES: VIỆT PHỤC REMIX - HERITSTYLE AI
 * File: src/data/data.js
 * Version: 1.0 (VietPhuc_Styling_Matrix_GenZ)
 * ==============================================================================
 * Bao gồm toàn bộ danh mục sản phẩm (Quần, Áo, Áo lót Đơn y, Khuy Cúc, Giày/Guốc, Phụ kiện)
 * theo 3 Dòng Sản Phẩm chính:
 * 1. HERITAGE CORE (Đúng chuẩn di sản)
 * 2. MODERN HERITAGE (Cách tân trong 30%)
 * 3. FUSION STREETWEAR (Lấy cảm hứng / Inspired by Việt Phục)
 * 
 * Tích hợp hệ thống luật gác cổng (Gatekeeper Rules), bối cảnh di sản & logic chấm điểm AI.
 */

// ==============================================================================
// 1. DÒNG SẢN PHẨM (PRODUCT LINES) & QUY TẮC ĐẶT TÊN (NAMING RULES)
// ==============================================================================
export const PRODUCT_LINES = {
  heritage_core: {
    id: 'heritage_core',
    name: 'Heritage Core',
    subName: 'Đúng Chuẩn Di Sản',
    desc: 'Bảo tồn 100% kết cấu y quan lịch sử triều Nguyễn: 5 thân, 5 cúc, cổ lập lĩnh, áo đơn y, khăn đóng.',
    namingRule: "Được gọi tên gốc: 'Áo Ngũ Thân tay chẽn', 'Áo Tấc', 'Áo Nhật Bình - đúng chuẩn'",
    immutable: 'Cổ lập lĩnh, 5 thân, 5 cúc cài nách, áo đơn y, tà sa, khăn đóng (nam), phụ kiện đồng bộ lịch sử.',
    forbidden: 'Màu vàng hoàng chính sắc (ngoài phục dựng hoàng tộc), khoét hở, kéo khóa thay cúc, giày cao gót lộ liễu.',
    allowedContexts: ['heritage'], // Chỉ đi chốn tôn nghiêm, lễ nghi, đại lễ
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  modern_heritage: {
    id: 'modern_heritage',
    name: 'Modern Heritage',
    subName: 'Cách Tân Trong 30%',
    desc: 'Ứng dụng phom dáng cổ phong vào đời sống: chất liệu linen, denim nhẹ, màu sắc Acubi / Quiet Luxury thanh lịch.',
    namingRule: "Được gọi 'Áo dài cách tân', 'Áo ngũ thân hiện đại'",
    immutable: 'Cổ đứng, tà xẻ 2 bên, khuy cài đúng vị trí, nguyên tắc kín đáo, không nút tàu cúc bện.',
    forbidden: 'Màu vàng hoàng, khoét ngực/lưng quá hở, tự xưng là "cổ phục đúng chuẩn".',
    allowedContexts: ['modern', 'heritage'], // Công sở, Tết gia đình, dạo phố
    badgeStyle: 'bg-emerald-100/90 text-emerald-800 border-emerald-200'
  },
  fusion_streetwear: {
    id: 'fusion_streetwear',
    name: 'Fusion Streetwear',
    subName: 'Lấy Cảm Hứng (Inspired by Việt Phục)',
    desc: 'Giao thoa cá tính giữa cảm hứng Á Đông và Streetwear Gen Z: phối cargo, baggy jeans, sneakers chunky, Dr. Martens.',
    namingRule: "CHỈ được gọi: 'Áo cổ đứng cách điệu', 'Heritage top', 'Inspired by Việt phục' - TUYỆT ĐỐI không ghi 'áo dài'/'cổ phục' trên nhãn",
    immutable: 'Chỉ lấy yếu tố cảm hứng (cổ đứng, họa tiết Tứ Quý/Bát Bửu/chữ Nôm cách điệu).',
    forbidden: 'KHÔNG được ghi "áo dài" hay "cổ phục" trên nhãn; KHÔNG mặc vào đền/chùa/lễ nghi.',
    allowedContexts: ['fusion'], // Cafe check-in, concert, dạo phố đêm
    badgeStyle: 'bg-yellow-100/90 text-yellow-800 border-yellow-200'
  }
};

// ==============================================================================
// 2. DANH MỤC PHÂN LOẠI (PRODUCT CATEGORIES)
// ==============================================================================
export const PRODUCT_CATEGORIES = [
  { id: 'ao', label: 'Áo Cổ Phục', icon: '👘', desc: 'Ngũ Thân tay chẽn, Áo Tấc, Nhật Bình (Triều Nguyễn)' },
  { id: 'lot', label: 'Áo Lót (Đơn y)', icon: '🥼', desc: 'Áo Đơn Y trắng cổ đứng, Camisole, Tee layer' },
  { id: 'cuc', label: 'Khuy Cúc', icon: '🪙', desc: 'Cúc Đồng Bát Bửu, Cúc Ngọc, Cúc Bạc, Cúc Xà Cừ' },
  { id: 'quan', label: 'Thân Dưới', icon: '👖', desc: 'Quần Ống Sớ Lụa, Linen, Váy Xếp Ly, Baggy Jeans' },
  { id: 'giay', label: 'Giày/Guốc', icon: '🪵', desc: 'Guốc Mộc, Hài Thêu, Chunky Loafers, Sneakers' },
  { id: 'phukien', label: 'Phụ Kiện', icon: '🪭', desc: 'Khăn Đóng, Khăn Vành, Quạt Giấy, Bội Ngọc, Kiềng Bạc' }
];

// ==============================================================================
// 3. DANH SÁCH ÁO (GARMENTS / TOPS)
// ==============================================================================
export const GARMENTS = [
  // --- A. ÁO NGŨ THÂN TAY CHẼN ---
  {
    id: 'ngu_than_tay_chen_nu_heritage',
    aliasId: 'ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn Nữ (Đúng chuẩn)',
    category: 'ao',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Áo Ngũ Thân chuẩn cổ truyền mang nét nghiêm cẩn, nếu phối phong cách đường phố nên chọn phiên bản Heritage Top cách điệu.'
    },
    gender: 'female',
    dynasty: 'Triều Nguyễn (Thế kỷ XVIII - XX)',
    structure: '5 thân vải ghép, cổ lập lĩnh 3.5cm, 5 cúc cài nách, tay chẽn may Raglan, tà dài quá bắp chân.',
    symbolism: '5 thân tượng trưng tứ thân phụ mẫu và người mặc; 5 cúc tượng trưng đạo Ngũ Thường (Nhân - Lễ - Nghĩa - Trí - Tín).',
    materials: ['Lụa tơ tằm', 'Gấm sa', 'Đũi thủ công'],
    defaultColorHex: '#2B5B84',
    colorName: 'Xanh Thanh Thiên',
    img: '👘',
    realImg: '/1.png',
    svgType: 'ngu_than',
    priceVnd: '2.500.000 - 5.000.000 VNĐ'
  },
  {
    id: 'ngu_than_tay_chen_nam_heritage',
    name: 'Áo Ngũ Thân Tay Chẽn Nam (Đúng chuẩn)',
    category: 'ao',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Áo Ngũ Thân nam chuẩn mực nếu mix streetwear bụi bặm sẽ bị cọc cạch phom dáng.'
    },
    gender: 'male',
    dynasty: 'Triều Nguyễn',
    structure: '5 thân vải, cổ đứng lập lĩnh, cài 5 khuy rời bên phải, tà qua gối, phom đứng đắn đĩnh đạc.',
    symbolism: 'Phong thái đĩnh đạc của bậc trượng phu, tượng trưng trật tự gia đạo và luân thường đạo lý.',
    materials: ['Gấm', 'Lụa tơ tằm', 'The', 'Đũi'],
    defaultColorHex: '#1C1917',
    colorName: 'Đen Trầm Mặc',
    img: '👘',
    realImg: '/1.png',
    svgType: 'ngu_than',
    priceVnd: '2.500.000 - 5.000.000 VNĐ'
  },
  {
    id: 'ngu_than_modern_nu',
    name: 'Áo Ngũ Thân Hiện Đại Nữ (Acubi Chic)',
    category: 'ao',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'fusion'],
    unfitNotice: {
      heritage: 'Áo cách tân hiện đại không phù hợp nghi lễ cung đình / đại lễ tôn nghiêm (chỉ chấp nhận cổ phục đúng chuẩn 100%).'
    },
    gender: 'female',
    dynasty: 'Đương Đại Remix',
    structure: 'Cổ đứng cách tân 2.5cm, tà xẻ hai bên, thân suông nhẹ nhàng, tay lỡ hoặc tay chẽn gọn gàng.',
    symbolism: 'Tôn vinh vẻ đẹp kín đáo của phụ nữ Việt trong nhịp sống đô thị hiện đại.',
    materials: ['Linen cao cấp', 'Lụa tơ tằm dệt thô', 'Cotton lụa'],
    defaultColorHex: '#334D3C',
    colorName: 'Xanh Rêu Trầm',
    img: '🎋',
    realImg: '/1.png',
    svgType: 'ngu_than',
    priceVnd: '800.000 - 1.800.000 VNĐ'
  },
  {
    id: 'ngu_than_modern_nam',
    name: 'Áo Ngũ Thân Hiện Đại Nam (Minimal Sartorial)',
    category: 'ao',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'fusion'],
    unfitNotice: {
      heritage: 'Áo cách tân công sở thiếu cấu trúc 5 thân và khăn đóng cổ truyền của nghi lễ trang trọng.'
    },
    gender: 'male',
    dynasty: 'Đương Đại Remix',
    structure: 'Cổ đứng tối giản, khuy cài gọn gàng, phom đứng nam tính thay thế sơ mi công sở.',
    symbolism: 'Sự đĩnh đạc, nho nhã của nam giới thế hệ mới, tinh thần Quiet Luxury.',
    materials: ['Linen tự nhiên', 'Denim nhẹ', 'Cotton cao cấp'],
    defaultColorHex: '#4A3525',
    colorName: 'Nâu Sồng Đất',
    img: '📜',
    realImg: '/1.png',
    svgType: 'ngu_than',
    priceVnd: '800.000 - 1.800.000 VNĐ'
  },
  {
    id: 'heritage_top_fusion_unisex',
    name: 'Heritage Top Cổ Đứng Cách Điệu (Unisex Streetwear)',
    category: 'ao',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'Áo cổ đứng Fusion mang phong cách streetwear, TUYỆT ĐỐI không mặc vào chốn tôn nghiêm đền chùa.',
      modern: 'Thiết kế boxy/crop quá nổi loạn so với chuẩn mực công sở thanh lịch.'
    },
    gender: 'unisex',
    dynasty: 'Fusion Subculture',
    structure: 'Cổ đứng lấy cảm hứng Ngũ Thân, phom boxy oversized hoặc crop top cá tính.',
    symbolism: 'Tuyên ngôn thời trang tự do của Gen Z: Giao lưu di sản vào nhịp sống đường phố.',
    materials: ['Cotton dày 280gsm', 'Denim wash', 'Kaki thô'],
    defaultColorHex: '#181820',
    colorName: 'Đen Khói Charcoal',
    img: '⚡',
    realImg: '/1.png',
    svgType: 'ngu_than',
    priceVnd: '400.000 - 1.000.000 VNĐ'
  },

  // --- B. ÁO TẤC (NGŨ THÂN TAY THỤNG / ÁO LỄ) ---
  {
    id: 'ao_tac_nu_heritage',
    aliasId: 'ao-tac',
    name: 'Áo Tấc Nữ (Lễ Phục Tay Thụng Đúng Chuẩn)',
    category: 'ao',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage'],
    unfitNotice: {
      modern: 'Áo Tấc tay thụng là đại lễ phục trang trọng, phom tay quá dài rộng bất tiện cho sinh hoạt thường nhật.',
      fusion: 'Lễ phục tôn nghiêm không phù hợp mix đồ đường phố bụi bặm.'
    },
    gender: 'female',
    dynasty: 'Đại Lễ Triều Nguyễn',
    structure: '5 thân vải gấm, TAY RỘNG buông lơi thướt tha, cổ đứng lập lĩnh, mặc ngoài áo đơn y.',
    symbolism: 'Lễ phục trang trọng bậc nhất của người Việt xưa trong hôn lễ, tế lễ tổ tiên.',
    materials: ['Gấm đoạn Bát Bửu', 'Sa dệt hoa văn', 'Nhung thêu kim tuyến'],
    defaultColorHex: '#7A222C',
    colorName: 'Đỏ Tấc Son',
    img: '🏮',
    realImg: '/01_163.jpg',
    svgType: 'ao_tac',
    priceVnd: '3.000.000 - 6.000.000 VNĐ'
  },
  {
    id: 'ao_tac_nam_heritage',
    name: 'Áo Tấc Nam (Đúng Chuẩn Nghi Lễ)',
    category: 'ao',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage'],
    unfitNotice: {
      modern: 'Đại lễ phục nam tay rộng chỉ nên diện vào dịp hôn lễ, giỗ tổ hoặc đại lễ di sản.',
      fusion: 'Tránh đem đại lễ phục tay rộng vào bối cảnh concert, đường phố.'
    },
    gender: 'male',
    dynasty: 'Đại Lễ Triều Nguyễn',
    structure: 'Phom tay rộng thụng chấm gối, cổ lập lĩnh, cài 5 khuy, đi cùng khăn đóng và quần lụa trắng.',
    symbolism: 'Biểu tượng của lòng hiếu lễ, sự tôn nghiêm trong các nghi thức quan trọng.',
    materials: ['Gấm Bát Bửu', 'Lụa sa', 'Nhung đen'],
    defaultColorHex: '#2B5B84',
    colorName: 'Xanh Lam Cố Đô',
    img: '🏮',
    realImg: '/01_163.jpg',
    svgType: 'ao_tac',
    priceVnd: '3.000.000 - 6.000.000 VNĐ'
  },
  {
    id: 'ao_tac_modern_nu',
    name: 'Áo Tấc Cách Tân Nữ (Modern Oversized Sleeves)',
    category: 'ao',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern'],
    unfitNotice: {
      heritage: 'Áo Tấc cách tân tay lỡ không phải lễ phục quy chuẩn triều Nguyễn.',
      fusion: 'Phom áo tay rộng nhẹ nhàng hợp tiệc/dạo phố thanh lịch hơn là phong cách hầm hố.'
    },
    gender: 'female',
    dynasty: 'Đương Đại Remix',
    structure: 'Giữ phom tay rộng phóng khoáng nhưng thu gọn độ dài để mặc dạo phố hay dự tiệc thanh lịch.',
    symbolism: 'Phong thái vương giả, uyển chuyển pha nét kiêu kỳ hiện đại.',
    materials: ['Lụa tơ tằm mềm', 'Linen pha lụa', 'Taffeta mỏng'],
    defaultColorHex: '#B95D4A',
    colorName: 'Đỏ Gạch Gốm',
    img: '🏮',
    realImg: '/01_163.jpg',
    svgType: 'ao_tac',
    priceVnd: '900.000 - 2.000.000 VNĐ'
  },
  {
    id: 'ao_tac_modern_nam',
    name: 'Áo Tấc Cách Tân Nam (Gentle Heritage)',
    category: 'ao',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern'],
    unfitNotice: {
      heritage: 'Chốn tôn nghiêm yêu cầu Áo Tấc tay thụng đúng chuẩn kèm khăn đóng.',
      fusion: 'Phom áo gentle heritage không ăn nhập với phong cách nổi loạn.'
    },
    gender: 'male',
    dynasty: 'Đương Đại Remix',
    structure: 'Tay rộng vừa phải, cổ đứng thanh thoát, dễ phối quần âu hoặc quần linen ống đứng.',
    symbolism: 'Vẻ phong trần lịch thiệp của nam nhân Á Đông thời đại mới.',
    materials: ['Linen thô', 'Cotton dệt viền', 'Denim mềm'],
    defaultColorHex: '#524338',
    colorName: 'Nâu Trầm Đất',
    img: '🏮',
    realImg: '/01_163.jpg',
    svgType: 'ao_tac',
    priceVnd: '900.000 - 2.000.000 VNĐ'
  },
  {
    id: 'ao_tac_outerwear_fusion',
    name: 'Heritage Outerwear Tay Thụng (Gothic / Dark Heritage)',
    category: 'ao',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'Áo khoác tay thụng nhung/denim Fusion tuyệt đối không diện nơi tôn nghiêm.',
      modern: 'Thiết kế Gothic Dark Heritage quá cá tính cho môi trường gia đình, công sở.'
    },
    gender: 'unisex',
    dynasty: 'Alternative Subculture',
    structure: 'Áo khoác ngoài lấy cảm hứng tay thụng Áo Tấc, tà xẻ tự do, mặc layer ngoài áo phông/hoodie.',
    symbolism: 'Aesthetic huyền bí, nổi loạn đầy tính nghệ thuật của Gen Z.',
    materials: ['Nhung tuyết (Velvet)', 'Kaki dày', 'Vải dệt kim tuyến tối màu'],
    defaultColorHex: '#140D18',
    colorName: 'Tím Đen Huyền Bí',
    img: '🦇',
    realImg: '/01_163.jpg',
    svgType: 'ao_tac',
    priceVnd: '500.000 - 1.200.000 VNĐ'
  },

  // --- C. ÁO NHẬT BÌNH & TRIỀU PHỤC ---
  {
    id: 'nhat_binh_nu_heritage',
    aliasId: 'ao-nhat-binh',
    name: 'Áo Nhật Bình Nữ Hoàng Tộc (Đúng chuẩn cung đình)',
    category: 'ao',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage'],
    unfitNotice: {
      modern: 'Áo Nhật Bình hoàng tộc là triều phục quý tộc cung đình, quá lộng lẫy cho đời thường.',
      fusion: 'Triều phục hoàng tộc không được mix đồ Y2K/streetwear phá cách.'
    },
    gender: 'female',
    dynasty: 'Hoàng Cung Triều Nguyễn',
    structure: 'CỔ VUÔNG BẢN LỚN viền gấm dệt hoa, tay có DẢI NGŨ SẮC 5 màu tượng trưng Ngũ Hành, nẹp trước có dải thùy lưu.',
    symbolism: 'Thánh đức mẫu nghi, quyền uy quý phái của Hoàng Hậu, Công Chúa và Mệnh phụ triều đình.',
    materials: ['Gấm đoạn dệt Phượng/Loan/Bát Bửu', 'Sa thêu chỉ kim tuyến', 'Nhung'],
    defaultColorHex: '#5E3A58',
    colorName: 'Tím Chính Sắc (Phi Tần)',
    img: '👑',
    realImg: '/edit-1-nb1-scaled-1670575399862737277046-1670642953514-16706444444071464666990-1670721786049-16707217861771215069289.webp',
    svgType: 'nhat_binh',
    priceVnd: '3.500.000 - 7.000.000 VNĐ'
  },
  {
    id: 'nhat_binh_modern_nu',
    name: 'Áo Cổ Vuông Nhật Bình Cách Tân (Modern Princess)',
    category: 'ao',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern'],
    unfitNotice: {
      heritage: 'Áo cổ vuông cách tân không đủ quy chuẩn ngũ sắc và nẹp thùy lưu hoàng cung.',
      fusion: 'Tone màu pastel thanh nhã hợp tiệc cưới/dạo phố hơn là phong cách đường phố.'
    },
    gender: 'female',
    dynasty: 'Đương Đại Remix',
    structure: 'Giữ đặc trưng cổ vuông viền họa tiết tương phản, phom suông thanh lịch, phối màu pastel dịu dàng.',
    symbolism: 'Hóa thân thành công chúa hiện đại, vừa đài các vừa trẻ trung.',
    materials: ['Lụa tơ tằm dệt hoa', 'Satin cao cấp', 'Linen mịn'],
    defaultColorHex: '#A27B88',
    colorName: 'Hồng Tro Thạch Anh',
    img: '🌸',
    realImg: '/edit-1-nb1-scaled-1670575399862737277046-1670642953514-16706444444071464666990-1670721786049-16707217861771215069289.webp',
    svgType: 'nhat_binh',
    priceVnd: '1.000.000 - 2.200.000 VNĐ'
  },
  {
    id: 'nhat_binh_crop_fusion_nu',
    name: 'Top Cổ Vuông Royal Y2K (Fusion Streetwear)',
    category: 'ao',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'Áo croptop cổ vuông hở eo VI PHẠM NGHIÊM TRỌNG quy chế chốn tôn nghiêm đền chùa.',
      modern: 'Áo croptop không phù hợp với chuẩn mực thanh lịch công sở.'
    },
    gender: 'female',
    dynasty: 'Y2K Revival',
    structure: 'Áo croptop cổ vuông viền họa tiết Tứ Quý cách điệu, tay lỡ hoặc tay rộng cá tính.',
    symbolism: 'Phong cách Royal Y2K cực slay, thời thượng cho các bạn nữ đi concert/cafe.',
    materials: ['Satin dệt bóng', 'Cotton thun co giãn', 'Denim in graphic'],
    defaultColorHex: '#E297A6',
    colorName: 'Hồng Phấn Y2K',
    img: '💖',
    realImg: '/edit-1-nb1-scaled-1670575399862737277046-1670642953514-16706444444071464666990-1670721786049-16707217861771215069289.webp',
    svgType: 'nhat_binh',
    priceVnd: '450.000 - 1.100.000 VNĐ'
  },
  {
    id: 'ao_chau_nam_heritage',
    name: 'Áo Chầu / Bổ Tử Nam (Triều phục tương đương Nhật Bình)',
    category: 'ao',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage'],
    unfitNotice: {
      modern: 'Áo Chầu thêu Bổ Tử là phẩm phục quan lại triều đình, không dùng cho thường nhật.',
      fusion: 'Phẩm phục quan lại không được dùng cho phong cách đường phố.'
    },
    gender: 'male',
    dynasty: 'Quan Chế Triều Nguyễn',
    structure: 'Triều phục quan lại: tay rộng, ngực đính Bổ Tử thêu chim/thú theo phẩm hàm văn võ, đi cùng mũ cánh chuồn.',
    symbolism: 'Lưu ý lịch sử: Nhật Bình chỉ dành cho Nữ. Nam giới tương đương là Áo Chầu / Bổ Tử.',
    materials: ['Gấm đoạn thêu Bổ Tử', 'Sa dệt hoa', 'Nhung'],
    defaultColorHex: '#1D3B53',
    colorName: 'Cam Bích Lam Đậm',
    img: '📜',
    realImg: '/01_163.jpg',
    svgType: 'ao_tac',
    priceVnd: '3.500.000 - 7.000.000 VNĐ'
  },
  {
    id: 'co_vuong_modern_nam',
    name: 'Áo Cổ Vuông Nam (Gender-fluid Modern Heritage)',
    category: 'ao',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'fusion'],
    unfitNotice: {
      heritage: 'Áo sơ mi cổ vuông nam chỉ mang tính cảm hứng, không phải triều phục lịch sử.'
    },
    gender: 'male',
    dynasty: 'Đương Đại Remix',
    structure: 'Áo sơ mi cổ vuông viền tương phản tinh tế lấy cảm hứng từ cấu trúc cổ bàn lĩnh.',
    symbolism: 'Thời trang phi giới tính (gender-fluid) thanh lịch và mang đậm dấu ấn Á Đông.',
    materials: ['Linen cao cấp', 'Cotton dệt thủ công'],
    defaultColorHex: '#2E3532',
    colorName: 'Xám Than Lạnh',
    img: '👔',
    realImg: '/1.png',
    svgType: 'ngu_than',
    priceVnd: '800.000 - 1.800.000 VNĐ'
  }
];

// ==============================================================================
// 4. DANH SÁCH ÁO LÓT (INNER LAYERS / ĐƠN Y)
// ==============================================================================
export const INNER_LAYERS = [
  {
    id: 'layer-don-y-white',
    aliasId: 'lot-don-y',
    name: 'Áo Đơn Y Trắng Cổ Đứng (Chuẩn mực y quan)',
    category: 'lot',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Layer Đơn Y cổ đứng có thể quá trang nghiêm nếu bạn đang phối croptop hay áo khoác streetwear.'
    },
    sub: 'Lớp lót trắng cao hơn áo ngoài 2-3mm, giữ sạch lụa đắt tiền và thể hiện sự đoan chính.',
    isTaboo: false,
    penalty: 0,
    img: '🥼',
    realImg: '/1.png'
  },
  {
    id: 'layer-tee-graphic-fusion',
    name: 'Áo Thun Graphic Tee Trắng/Đen (Layer Streetwear)',
    category: 'lot',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'Áo thun in graphic đường phố làm mất trọn nét trang trọng của cổ phục đại lễ.',
      modern: 'Nên chọn áo lót trắng kín đáo thay cho áo thun in hình khi đi làm.'
    },
    sub: 'Layer trong cho các bản phối áo khoác cổ đứng / áo tay thụng Streetwear.',
    isTaboo: false,
    penalty: 0,
    img: '👕',
    realImg: '/1.png'
  },
  {
    id: 'layer-camisole-satin',
    name: 'Áo Hai Dây Camisole Satin (Layer Y2K)',
    category: 'lot',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion', 'modern'],
    unfitNotice: {
      heritage: 'Áo hai dây mặc trong làm lộ da thịt viền cổ, vi phạm quy chế y quan chốn tôn nghiêm.'
    },
    sub: 'Mặc lót nhẹ nhàng bên trong áo croptop cổ vuông Nhật Bình.',
    isTaboo: false,
    penalty: 0,
    img: '🎀',
    realImg: '/1.png'
  },
  {
    id: 'layer-none',
    aliasId: 'lot-none',
    name: 'Không Mặc Áo Lót Đơn Y (Taboo Alert)',
    category: 'lot',
    styleLine: 'heritage_core',
    allowedTiers: ['fusion'], // Cho phép ở Fusion Streetwear phá cách (càng phá cách điểm slay càng tăng)
    unfitNotice: {
      heritage: 'CẢNH BÁO PHẠM QUY: Chốn tôn nghiêm bắt buộc phải có Áo Đơn Y trắng lót trong! Lộ da thịt là điểm trừ cực nặng.',
      modern: 'Thiếu áo lót bên trong làm mất nếp áo và giảm độ trang nhã.',
      fusion: 'Phá cách không mặc đơn y theo vibe streetwear hiện đại.'
    },
    sub: 'Cảnh báo phạm quy: Thiếu Đơn Y làm lộ da thịt, vi phạm cốt cách trang phục truyền thống.',
    isTaboo: true,
    penalty: 25,
    img: '⚠️',
    realImg: ''
  }
];

// ==============================================================================
// 5. DANH SÁCH KHUY CÚC (BUTTONS / CLOSURES)
// ==============================================================================
export const BUTTONS = [
  {
    id: 'btn-metal-copper',
    name: 'Cúc Đồng Đúc Bát Bửu (Đồng cổ đĩnh đạc)',
    category: 'cuc',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern', 'fusion'],
    unfitNotice: {},
    nguThuong: 'Đạo Ngũ Thường (Nhân, Nghĩa, Lễ, Trí, Tín)',
    sub: 'Chuẩn quy chuẩn Nguyễn, khuy tròn rời gắn khuyết, tượng trưng trật tự đạo đức.',
    isTaboo: false,
    penalty: 0,
    img: '🪙',
    realImg: '/1.png'
  },
  {
    id: 'btn-jade-green',
    name: 'Cúc Ngọc Bích Cẩm Thạch (Vương giả)',
    category: 'cuc',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Cúc ngọc cẩm thạch vương giả hơi lạc quẻ với phong cách đường phố gồ ghề.'
    },
    nguThuong: 'Chữ Nhân (Ôn nhuận như ngọc)',
    sub: 'Sang trọng hoàng tộc, thanh nhã cung đình, tôn vinh tấm lòng nhân ái ôn nhu.',
    isTaboo: false,
    penalty: 0,
    img: '🟢',
    realImg: '/2.png'
  },
  {
    id: 'btn-wood-agarwood',
    name: 'Cúc Gỗ Trầm Hương Khắc Chữ Thọ (Nho nhã)',
    category: 'cuc',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Cúc gỗ trầm hương mang vibe tĩnh tại của tao nhân ẩn sĩ, khó hòa hợp với nhịp sống hối hả đường phố.'
    },
    nguThuong: 'Chữ Tín & Lễ (Trường thọ an khang)',
    sub: 'Hương trầm thoang thoảng tao nhã, cốt cách văn nhân quân tử xứ Cố Đô.',
    isTaboo: false,
    penalty: 0,
    img: '🪵',
    realImg: '/3.png'
  },
  {
    id: 'btn-silver-lotus',
    name: 'Cúc Bạc Chạm Hoa Sen (Mới - Thanh tao)',
    category: 'cuc',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'heritage', 'fusion'],
    unfitNotice: {},
    nguThuong: 'Chữ Liêm & Trí (Thanh cao thoát tục)',
    sub: 'Đúc bạc trắng sáng chạm hoa sen thanh khiết, tượng trưng khí chất thanh bạch minh triết.',
    isTaboo: false,
    penalty: 0,
    img: '🪷',
    realImg: '/1.png'
  },
  {
    id: 'btn-mother-of-pearl',
    name: 'Cúc Xà Cừ Khảm Ốc Ánh Kim (Mới - Tinh xảo)',
    category: 'cuc',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'heritage', 'fusion'],
    unfitNotice: {},
    nguThuong: 'Chữ Mỹ & Lễ (Mỹ nghệ cung đình ngũ sắc)',
    sub: 'Vỏ ốc xà cừ óng ánh ngũ sắc khảm kim chỉ, đỉnh cao mỹ nghệ cung đình Huế.',
    isTaboo: false,
    penalty: 0,
    img: '✨',
    realImg: '/2.png'
  },
  {
    id: 'btn-chinese-cloth',
    name: 'Cúc Vải Tết Dây / Cúc Tàu (Taboo Alert)',
    category: 'cuc',
    styleLine: 'fusion_streetwear',
    allowedTiers: [], // Cấm kỵ tuyệt đối trên mọi bối cảnh
    unfitNotice: {
      heritage: 'CẤM KỴ ĐỎ: Cúc vải tết Mãn Thanh là xâm lấn văn hóa! Cổ phục Việt luôn là khuy rời đúc bằng kim loại, gỗ, ngọc, xà cừ.',
      modern: 'Cúc bàn đinh vải bện lai căng phong cách sườn xám Trung Hoa.',
      fusion: 'Cúc vải tàu vi phạm bản chất y quan Việt Nam.'
    },
    nguThuong: 'Vi phạm quy chế y quan triều Nguyễn',
    sub: 'Cúc bàn đinh vải bện kiểu Mãn Thanh/Sườn xám. Cổ phục Việt chuẩn luôn là khuy đúc rời!',
    isTaboo: true,
    penalty: 35,
    img: '❌',
    realImg: '/4.png'
  }
];

// ==============================================================================
// 6. DANH SÁCH THÂN DƯỚI (BOTTOMS - QUẦN / CHÂN VÁY)
// ==============================================================================
export const BOTTOMS = [
  // --- A. DÒNG HERITAGE CORE ---
  {
    id: 'bottom-silk-wide-pants',
    name: 'Quần Ống Sớ Lụa Trắng (Đúng chuẩn di sản)',
    category: 'quan',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Quần lụa ống sớ truyền thống quá mềm mại so với phong cách đường phố cá tính.'
    },
    sub: 'Lụa tơ tằm cổ điển buông rủ tha thướt, dài che mu bàn chân, chuẩn mực trang phục cổ.',
    isTaboo: false,
    img: '👖',
    realImg: '/5.png'
  },
  {
    id: 'bottom-silk-black-pants',
    name: 'Quần Rộng Lụa Đen (Nam / Nữ di sản)',
    category: 'quan',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Quần lụa đen mềm rủ hợp không gian hoài cổ, thiếu chất bụi bặm của streetwear.'
    },
    sub: 'Quần lụa đen ống suông, phối cùng ngũ thân nam hoặc nữ dịp trang trọng.',
    isTaboo: false,
    img: '👖',
    realImg: '/5.png'
  },

  // --- B. DÒNG MODERN HERITAGE ---
  {
    id: 'bottom-linen-wide-pants',
    name: 'Quần Linen Ống Đứng (Thanh Lịch Đời Thường)',
    category: 'quan',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'fusion'],
    unfitNotice: {
      heritage: 'Chốn tôn nghiêm ưu tiên quần ống sớ lụa tơ tằm cổ điển buông rủ tha thướt.'
    },
    sub: 'Linen tự nhiên thoáng mát, phom đứng đắn thanh lịch, phối áo dài cách tân đi làm/đi chơi.',
    isTaboo: false,
    img: '🌾',
    realImg: '/5.png'
  },
  {
    id: 'bottom-tailored-wide-leg',
    name: 'Quần Tây Wide-Leg Be/Xám (Quiet Luxury)',
    category: 'quan',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'fusion'],
    unfitNotice: {
      heritage: 'Quần tây âu hiện đại thiếu nét đoan trang cổ truyền của y quan chốn đền chùa cung đình.'
    },
    sub: 'Phom quần âu ống rộng cạp cao tone be/xám than, xu hướng Acubi thanh lịch 2026.',
    isTaboo: false,
    img: '👖',
    realImg: '/5.png'
  },
  {
    id: 'bottom-pleated-midi-skirt',
    name: 'Chân Váy Xếp Ly Suông (Chic Neo-Tradition)',
    category: 'quan',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern'],
    unfitNotice: {
      heritage: 'Chân váy xếp ly hiện đại không đúng quy chế y phục tôn nghiêm (cần quần lụa ống sớ truyền thống).',
      fusion: 'Chân váy midi suông nhã nhặn hợp tiệc nhẹ hơn là phong cách nổi loạn.'
    },
    sub: 'Chân váy xếp ly chuyển động uyển chuyển nhẹ nhàng theo từng bước đi.',
    isTaboo: false,
    img: '👗',
    realImg: '/6.png'
  },

  // --- C. DÒNG FUSION STREETWEAR ---
  {
    id: 'bottom-cargo-pants',
    name: 'Quần Cargo Túi Hộp Siêu Rộng (Olive / Đen)',
    category: 'quan',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'CẢNH BÁO LỆCH CHUẨN: Quần túi hộp hầm hố phá vỡ hoàn toàn sự trang nghiêm chốn tôn kính!',
      modern: 'Quần cargo quá bụi bặm cho môi trường công sở thanh lịch.'
    },
    sub: 'Phom cargo baggy túi hộp cá tính, tạo tương phản mạnh mẽ với tà áo cổ đứng.',
    isTaboo: false,
    img: '🪖',
    realImg: '/7.png'
  },
  {
    id: 'bottom-high-waist-jeans',
    name: 'Quần Jeans Cạp Cao Wash Xám (Heritage Streetwear)',
    category: 'quan',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion', 'modern'],
    unfitNotice: {
      heritage: 'CẢNH BÁO LỆCH CHUẨN: Quần jeans bụi bặm làm mất đi sự tôn kính, trang nhã nơi cửa chùa/đại lễ.'
    },
    sub: 'Baggy denim đứng phom tôn dáng, sự kết hợp kinh điển trong trào lưu Tet-Core.',
    isTaboo: false,
    img: '👖',
    realImg: '/7.png'
  },
  {
    id: 'bottom-jorts-denim',
    name: 'Jorts (Quần Short Denim Rộng Gen Z)',
    category: 'quan',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'VI PHẠM NGHIÊM TRỌNG: Quần ngắn hở bắp chân TUYỆT ĐỐI BỊ CẤM tại nơi tôn nghiêm đền miếu!',
      modern: 'Quần ngố jorts không phù hợp với dress code công sở hay sum họp gia đình.'
    },
    sub: 'Phối phá cách cùng áo top cổ đứng và giày chunky sneaker.',
    isTaboo: false,
    img: '🩳',
    realImg: '/7.png'
  },
  {
    id: 'bottom-y2k-pleated-skirt',
    name: 'Chân Váy Xếp Ly Ngắn Y2K (Royal Y2K Core)',
    category: 'quan',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'VI PHẠM QUY CHẾ: Váy ngắn hở đùi là đại kỵ số một chốn tâm linh, trang trọng!',
      modern: 'Váy ngắn Y2K không đủ kín đáo cho môi trường làm việc hay gặp gỡ trang trọng.'
    },
    sub: 'Phối cùng áo Nhật Bình crop top và Mary Jane đế thô.',
    isTaboo: false,
    img: '💖',
    realImg: '/6.png'
  }
];

// ==============================================================================
// 7. DANH SÁCH GIÀY / GUỐC (FOOTWEAR)
// ==============================================================================
export const SHOES = [
  // --- A. DÒNG HERITAGE CORE ---
  {
    id: 'shoes-wooden-clogs',
    name: 'Guốc Mộc Quai Nhung (Cố Đô Huế)',
    category: 'giay',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Guốc mộc mộc mạc khó di chuyển linh hoạt cho phong cách trượt ván / streetwear đường phố.'
    },
    sub: 'Hồn xưa thanh nhã, đế gỗ tự nhiên phát tiếng cạch cạch nhịp nhàng.',
    isTaboo: false,
    img: '🪵',
    realImg: '/8.png'
  },
  {
    id: 'shoes-embroidered-slippers',
    name: 'Hài Thêu Cung Đình (Chỉ Kim Tuyến)',
    category: 'giay',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage'],
    unfitNotice: {
      modern: 'Hài thêu hoa văn cung đình quá cầu kỳ và dễ bám bẩn khi đi làm/đi mưa hàng ngày.',
      fusion: 'Hài thêu đại lễ tương phản lệch tông với phong cách đường phố.'
    },
    sub: 'Thêu tay hoa văn mây sóng thủy ba tinh xảo, phụ kiện đại lễ hoàng triều.',
    isTaboo: false,
    img: '🥿',
    realImg: '/9.png'
  },
  {
    id: 'shoes-flat-straw-slippers',
    name: 'Dép Lát Đế Phẳng (Mộc Mạc)',
    category: 'giay',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Dép lát dân dã thiếu nét nổi loạn và cá tính của văn hóa đường phố.'
    },
    sub: 'Dép bện sợi cói tự nhiên mộc mạc, nhẹ nhàng êm chân.',
    isTaboo: false,
    img: '🩴',
    realImg: '/8.png'
  },

  // --- B. DÒNG MODERN HERITAGE ---
  {
    id: 'shoes-white-sneakers',
    name: 'Sneakers Trắng Tối Giản (Stan Smith / Minimal)',
    category: 'giay',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'fusion'],
    unfitNotice: {
      heritage: 'CẢNH BÁO LỆCH CHUẨN: Giày sneakers thể thao phá vỡ nét tôn nghiêm y quan cổ truyền triều Nguyễn (hãy chọn Guốc mộc hoặc Hài thêu).'
    },
    sub: 'Combo viral nhất của giới trẻ: Áo ngũ thân hiện đại mix cùng sneaker trắng tinh khôi.',
    isTaboo: false,
    penaltyCeremonial: 20, // Cảnh báo khi phối với Áo Tấc / Nhật Bình chốn lễ nghi
    img: '👟',
    realImg: '/10.png'
  },
  {
    id: 'shoes-chunky-loafers',
    name: 'Chunky Loafers Da (Modern Sartorial Chic)',
    category: 'giay',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'fusion'],
    unfitNotice: {
      heritage: 'Giày da âu phục hiện đại không đồng bộ với cổ phục đại lễ tôn nghiêm.'
    },
    sub: 'Giày da đế bánh mì thời thượng, tạo phom đứng đắn đĩnh đạc.',
    isTaboo: false,
    img: '👞',
    realImg: '/10.png'
  },
  {
    id: 'shoes-mules-leather',
    name: 'Mules Da Đế Bệt (Thanh Nhã)',
    category: 'giay',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'fusion'],
    unfitNotice: {
      heritage: 'Dép mules hở gót không đủ trang trọng cho nghi thức tâm linh hay bái lễ.'
    },
    sub: 'Dễ dàng xỏ chân, tạo cảm giác nhẹ nhõm, phù hợp dạo phố Tết.',
    isTaboo: false,
    img: '👡',
    realImg: '/9.png'
  },

  // --- C. DÒNG FUSION STREETWEAR ---
  {
    id: 'shoes-boots-dr-martens',
    name: 'Boots Dr. Martens 1460 (Đế Thô Cá Tính)',
    category: 'giay',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'CẢNH BÁO LỆCH CHUẨN: Boots da hầm hố đi ngược lại sự thanh tịnh, tôn nghiêm chốn cửa Phật / cung miếu.',
      modern: 'Boots đế thô quá hầm hố cho môi trường công sở chuẩn mực.'
    },
    sub: 'Tương phản giữa chất lụa/gấm mềm mại và da thuộc cứng cáp, cốt lõi Tet-Core.',
    isTaboo: false,
    img: '👢',
    realImg: '/10.png'
  },
  {
    id: 'shoes-skater-vans',
    name: 'Vans Old Skool / Sk8-Hi (Skater Vibe)',
    category: 'giay',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'CẢNH BÁO LỆCH CHUẨN: Giày trượt ván đường phố không được chấp nhận trong nghi lễ trang trọng.',
      modern: 'Giày sneaker trượt ván mang tính thể thao casual, thiếu vẻ lịch thiệp sartorial.'
    },
    sub: 'Cốt lõi streetwear đường phố Việt Nam, năng động và bụi bặm.',
    isTaboo: false,
    img: '🛹',
    realImg: '/10.png'
  },
  {
    id: 'shoes-platform-mary-jane',
    name: 'Platform Mary Jane + Tất Trắng Dài (Y2K Core)',
    category: 'giay',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'Giày Mary Jane đế thô và phong cách Y2K không hòa hợp với không gian tôn nghiêm.',
      modern: 'Mary Jane đế bánh mì hợp dạo phố, chụp ảnh hơn là môi trường trang trọng.'
    },
    sub: 'Vibe tiểu thư hoàng tộc Y2K cá tính, nổi bật giữa đám đông.',
    isTaboo: false,
    img: '👠',
    realImg: '/10.png'
  }
];

// ==============================================================================
// 8. DANH SÁCH PHỤ KIỆN (ACCESSORIES)
// ==============================================================================
export const ACCESSORIES = [
  // --- A. DÒNG HERITAGE CORE ---
  {
    id: 'acc-khan-dong',
    name: 'Khăn Đóng Chữ Nhân (Bắt buộc cho Nam)',
    category: 'phukien',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Khăn đóng chữ nhân quá trang trọng cho phong cách đường phố (hãy thử Bandana hoặc Bucket hat).'
    },
    sub: 'Khăn xếp tạo vẻ chỉnh tề, đoan trang vương triều; điểm nhận dạng bắt buộc của ngũ thân nam.',
    isTaboo: false,
    img: '🎩',
    realImg: '/12.png'
  },
  {
    id: 'acc-khan-vanh-day',
    name: 'Khăn Vành Dây Hoàng Cung (Nữ Đại Lễ)',
    category: 'phukien',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage'],
    unfitNotice: {
      modern: 'Khăn vành nhiều lớp là lễ phục hoàng triều cực trang trọng, không dùng cho dạo phố/đi làm.',
      fusion: 'Khăn vành hoàng cung không thể mix cùng phong cách Y2K/streetwear.'
    },
    sub: 'Khăn quấn nhiều vòng bằng gấm hoàng cung lộng lẫy, phối Áo Tấc & Nhật Bình.',
    isTaboo: false,
    img: '👑',
    realImg: '/12.png'
  },
  {
    id: 'acc-tram-phuong',
    name: 'Trâm Phượng Hoàng Cung (Bạc / Vàng Mạ)',
    category: 'phukien',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage'],
    unfitNotice: {
      modern: 'Trâm phượng cung đình quá lộng lẫy và dễ vướng víu cho hoạt động đời thường.',
      fusion: 'Trâm phượng hoàng tộc lạc tông với phụ kiện kim loại đường phố.'
    },
    sub: 'Trâm cài tóc phượng hoàng buông rũ, biểu tượng mệnh phụ quý tộc.',
    isTaboo: false,
    img: '🪶',
    realImg: '/13.png'
  },
  {
    id: 'acc-kim-uoc',
    name: 'Kim Ước / Kim Khánh (Khánh Cung Đình)',
    category: 'phukien',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage'],
    unfitNotice: {
      modern: 'Kim khánh chạm rồng phượng thuộc về phẩm phục triều đình, không mang tính ứng dụng cao.',
      fusion: 'Khánh vàng triều đình đối lập với ngôn ngữ thiết kế streetwear.'
    },
    sub: 'Dây chuyền cung đình chạm khắc chữ Phúc, Thọ, hoa văn sóng nước.',
    isTaboo: false,
    img: '🥇',
    realImg: '/13.png'
  },
  {
    id: 'acc-paper-fan',
    name: 'Quạt Giấy Trầm Hương / Quạt Mo Thêu',
    category: 'phukien',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Quạt trầm phong nhã tao nhã hơn là phong cách hiphop đường phố náo nhiệt.'
    },
    sub: 'Phụ kiện cầm tay phong nhã của tao nhân mặc khách, tỏa hương trầm dịu nhẹ.',
    isTaboo: false,
    img: '🪭',
    realImg: '/11.png'
  },
  {
    id: 'acc-jade-pendant',
    name: 'Bội Ngọc Bích (Treo Tà Áo)',
    category: 'phukien',
    styleLine: 'heritage_core',
    allowedTiers: ['heritage', 'modern'],
    unfitNotice: {
      fusion: 'Bội ngọc vương giả dễ va chạm rơi vỡ trong các hoạt động đường phố năng động.'
    },
    sub: 'Ngọc bội buông tà phát tiếng leng keng phong lưu mỗi khi cất bước.',
    isTaboo: false,
    img: '💎',
    realImg: '/13.png'
  },

  // --- B. DÒNG MODERN HERITAGE ---
  {
    id: 'acc-kieng-bac',
    name: 'Kiềng Bạc Chạm Uốn Lượn (Nét Đài Các)',
    category: 'phukien',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'heritage', 'fusion'],
    unfitNotice: {},
    sub: 'Kiềng bạc ôm tròn quanh cổ áo, nét thanh tân đài các thiếu nữ Việt.',
    isTaboo: false,
    img: '💍',
    realImg: '/13.png'
  },
  {
    id: 'acc-leather-tote',
    name: 'Túi Tote Da Cấu Trúc (Quiet Luxury)',
    category: 'phukien',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern'],
    unfitNotice: {
      heritage: 'Túi tote da hiện đại không hòa hợp với không gian y quan cổ xưa (nên dùng tay nải lụa hoặc quạt cầm tay).',
      fusion: 'Túi tote da công sở có phần gò bó so với vibe túi đeo chéo tự do.'
    },
    sub: 'Thiết kế tối giản, tông màu be/nâu/đen, tiện dụng cho ngày làm việc văn phòng.',
    isTaboo: false,
    img: '👜',
    realImg: '/11.png'
  },
  {
    id: 'acc-sunglasses-gold',
    name: 'Kính Râm Gọng Mảnh Vàng Champagne',
    category: 'phukien',
    styleLine: 'modern_heritage',
    allowedTiers: ['modern', 'fusion'],
    unfitNotice: {
      heritage: 'Đeo kính râm khi làm lễ trong đền chùa cung miếu bị coi là thiếu tôn kính bề trên.'
    },
    sub: 'Điểm nhấn sang trọng, tạo vẻ thời thượng khi dạo phố Hội An hay phố cổ.',
    isTaboo: false,
    img: '🕶️',
    realImg: '/14.png'
  },

  // --- C. DÒNG FUSION STREETWEAR ---
  {
    id: 'acc-silver-chain-cuban',
    name: 'Vòng Cổ Xích Bạc Cuban Link (Streetwear)',
    category: 'phukien',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'CẢNH BÁO LỆCH CHUẨN: Xích bạc to bản hầm hố phá vỡ vẻ trang nhã, đoan chính của cổ phục đại lễ!',
      modern: 'Xích kim loại cuban quá ngổ ngáo cho môi trường lịch sự.'
    },
    sub: 'Layer dây chuyền kim loại hầm hố, phong cách hiphop Á Đông thời thượng.',
    isTaboo: false,
    img: '⛓️',
    realImg: '/13.png'
  },
  {
    id: 'acc-bucket-hat',
    name: 'Bucket Hat / Mũ Lưỡi Trai Snapback',
    category: 'phukien',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'CẢNH BÁO LỆCH CHUẨN: Đội mũ lưỡi trai/bucket hat vào nơi tôn nghiêm là bất kính và phản cảm.',
      modern: 'Mũ xô đường phố không hòa nhập với trang phục công sở nhã nhặn.'
    },
    sub: 'Phụ kiện streetwear bất hủ cho các bạn trẻ đi concert, trượt ván.',
    isTaboo: false,
    img: '🧢',
    realImg: '/12.png'
  },
  {
    id: 'acc-chest-bag',
    name: 'Túi Crossbody Chest Bag Đeo Chéo',
    category: 'phukien',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'Túi đeo ngực công nghệ làm cấn tà áo cổ phục và lạc điệu chốn thiêng liêng.',
      modern: 'Túi chest bag quá bụi bặm cho phong cách Quiet Luxury thanh nhã.'
    },
    sub: 'Tiện lợi, năng động, mang hơi thở thành thị hiện đại.',
    isTaboo: false,
    img: '🎒',
    realImg: '/14.png'
  },
  {
    id: 'acc-chunky-sunglasses',
    name: 'Kính Râm Gọng Dày Bản To (Chunky Black Shades)',
    category: 'phukien',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'CẢNH BÁO LỆCH CHUẨN: Kính râm gọng dày bản to ngổ ngáo hoàn toàn cấm kỵ ở nơi tôn nghiêm miếu vũ!',
      modern: 'Kính gọng dày quá hầm hố cho phong cách thanh lịch công sở.'
    },
    sub: 'Kính râm gọng dày vuông vức góc cạnh, chuẩn vibe hiphop underground và street style.',
    isTaboo: false,
    img: '🕶️',
    realImg: '/14.png'
  },
  {
    id: 'acc-metal-earrings',
    name: 'Khuyên Tai Kim Loại Gai Góc (Punk Metal Piercings)',
    category: 'phukien',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['fusion'],
    unfitNotice: {
      heritage: 'CẢNH BÁO LỆCH CHUẨN: Khuyên tai gai góc kim loại phá hỏng hoàn toàn nét đoan chính của cổ phục!',
      modern: 'Khuyên tai punk quá nổi loạn so với chuẩn mực thanh nhã.'
    },
    sub: 'Khuyên tai xích kim loại và khuyên gai bạc nổi loạn, điểm nhấn cực slay cho outfit Fusion.',
    isTaboo: false,
    img: '⚡',
    realImg: '/13.png'
  },
  {
    id: 'acc-smartwatch',
    name: 'Đồng Hồ Thông Minh Smartwatch (Taboo Alert)',
    category: 'phukien',
    styleLine: 'fusion_streetwear',
    allowedTiers: ['modern', 'fusion'],
    unfitNotice: {
      heritage: 'CẢNH BÁO LỆCH CHUẨN: Màn hình điện tử smartwatch chớp sáng trên cổ tay lạc điệu hoàn toàn với không gian hoài cổ tôn nghiêm!'
    },
    sub: 'Màn hình điện tử sáng chói lạc điệu hoàn toàn trong bối cảnh hoài cổ đại lễ.',
    isTaboo: true,
    penaltyCeremonial: 15,
    img: '⌚',
    realImg: '/14.png'
  }
];

// ==============================================================================
// 9. BẢNG MÀU SẮC PHỤC (COLOR PALETTES & REGULATIONS)
// ==============================================================================
export const COLOR_PALETTES = {
  heritage_core: [
    { name: 'Xanh Thanh Thiên', hex: '#2B5B84', element: 'Thủy / Mộc', desc: 'Trời quang mây tạnh, thanh nhã nho sĩ', allowedTiers: ['heritage', 'modern', 'fusion'], isRestricted: false },
    { name: 'Tím Chính Sắc', hex: '#5E3A58', element: 'Hỏa giao Thổ', desc: 'Đoan trang, cung đình Cố Đô Huế', allowedTiers: ['heritage', 'modern', 'fusion'], isRestricted: false },
    { name: 'Đỏ Tấc Son', hex: '#7A222C', element: 'Hỏa', desc: 'Đại lễ cát tường, vinh hoa phú quý', allowedTiers: ['heritage', 'modern', 'fusion'], isRestricted: false },
    { name: 'Xanh Rêu Trầm', hex: '#334D3C', element: 'Mộc', desc: 'Rêu phong cổ kính, khí chất ẩn sĩ', allowedTiers: ['heritage', 'modern', 'fusion'], isRestricted: false },
    { name: 'Nâu Sồng Đất', hex: '#4A3525', element: 'Thổ', desc: 'Mộc mạc, bền bỉ, củ nâu quê hương', allowedTiers: ['heritage', 'modern', 'fusion'], isRestricted: false },
    { name: 'Trắng Ngà Lụa Hà Đông', hex: '#F2EAD8', element: 'Kim', desc: 'Bạch lụa thuần khiết, thanh cao', allowedTiers: ['heritage', 'modern', 'fusion'], isRestricted: false },
    { name: 'Đen Trầm Mặc', hex: '#1C1917', element: 'Thủy', desc: 'Đĩnh đạc, trang nghiêm lễ giỗ', allowedTiers: ['heritage', 'modern', 'fusion'], isRestricted: false },
    {
      name: 'Vàng Minh Hoàng',
      hex: '#F5B014',
      element: 'Thổ Hoàng Cực',
      desc: 'CẤM KỴ HOÀNG GIA: Chỉ dành riêng cho Thiên Tử (Hoàng Đế)',
      allowedTiers: [], // Cấm kỵ tuyệt đối
      unfitNotice: {
        heritage: 'CẤM KỴ HOÀNG GIA: Sắc Vàng Minh Hoàng chỉ dành riêng cho Thiên Tử. Thứ dân sử dụng là phạm thượng trọng tội!',
        modern: 'Màu vàng hoàng cung quá chói lọi và phạm quy chế sắc phục hoàng triều.',
        fusion: 'Màu sắc cấm kỵ lịch sử triều Nguyễn.'
      },
      isRestricted: true
    }
  ],
  modern_heritage: [
    { name: 'Tone Kem Acubi', hex: '#F9F8F6', desc: 'Sáng nhã, ấm áp, tối giản', allowedTiers: ['modern', 'heritage', 'fusion'] },
    { name: 'Xám Than Lạnh', hex: '#2C302E', desc: 'Trưởng thành, thanh lịch công sở', allowedTiers: ['modern', 'heritage', 'fusion'] },
    { name: 'Xanh Rêu Rừng', hex: '#2F4F4F', desc: 'Gần gũi thiên nhiên, điềm đạm', allowedTiers: ['modern', 'heritage', 'fusion'] },
    { name: 'Đỏ Gạch Nung', hex: '#A85A48', desc: 'Giảm bão hòa từ đỏ tấc, ấm cúng', allowedTiers: ['modern', 'heritage', 'fusion'] },
    { name: 'Be Cát Sa Mạc', hex: '#D7C4B7', desc: 'Chic nhẹ nhàng, dễ phối đồ', allowedTiers: ['modern', 'heritage', 'fusion'] },
    { name: 'Xanh Navy Đậm', hex: '#1E2D3B', desc: 'Lịch lãm, hiện đại', allowedTiers: ['modern', 'heritage', 'fusion'] }
  ],
  fusion_streetwear: [
    { name: 'Đen Tuyệt Đối', hex: '#0F0F12', desc: 'Bí ẩn, đường phố cá tính', allowedTiers: ['fusion', 'modern'] },
    { name: 'Xám Xi Măng', hex: '#4A4A5A', desc: 'Vibe bê tông đô thị', allowedTiers: ['fusion', 'modern'] },
    { name: 'Rêu Quân Đội (Olive)', hex: '#3E4E3A', desc: 'Cargo military aesthetic', allowedTiers: ['fusion', 'modern'] },
    { name: 'Đỏ Rượu Vang (Burgundy)', hex: '#581825', desc: 'Dark heritage gothic', allowedTiers: ['fusion', 'modern'] },
    { name: 'Bạc Kim Loại', hex: '#CBD5E1', desc: 'Điểm nhấn dây xích bạc cuban', allowedTiers: ['fusion', 'modern'] }
  ]
};

// ==============================================================================
// 10. MA TRẬN ĐỊA ĐIỂM (LOCATION MAPPING & GATEKEEPER LOGIC)
// ==============================================================================
export const LOCATION_MAPPING = {
  heritage: [
    { id: 'dai_noi_hue', name: 'Đại Nội Huế & Cung An Định', city: 'Huế', rule: 'Chỉ Heritage Core' },
    { id: 'lang_khai_dinh', name: 'Lăng Khải Định & Lăng Minh Mạng', city: 'Huế', rule: 'Chỉ Heritage Core' },
    { id: 'van_mieu', name: 'Văn Miếu - Quốc Tử Giám', city: 'Hà Nội', rule: 'Heritage Core / Modern Heritage' },
    { id: 'den_hung', name: 'Khu Di Tích Đền Hùng', city: 'Phú Thọ', rule: 'Nghi lễ trang nghiêm' },
    { id: 'chua_huong', name: 'Chùa Hương & Chùa Một Cột', city: 'Hà Nội', rule: 'Tuyệt đối kín đáo, cấm khoét hở' }
  ],
  modern: [
    { id: 'cong_so', name: 'Văn Phòng / Coworking Space', city: 'TP.HCM / Hà Nội', rule: 'Modern Heritage thanh lịch' },
    { id: 'cafe_co', name: 'Cà Phê Cổ (Giảng, Đinh, Cộng)', city: 'Hà Nội', rule: 'Vibe mộc mạc thư thái' },
    { id: 'pho_di_bo', name: 'Phố Đi Bộ Nguyễn Huệ / Hồ Gươm', city: 'TP.HCM / Hà Nội', rule: 'Dạo chơi cuối tuần' },
    { id: 'hoi_an_ban_ngay', name: 'Phố Cổ Hội An (Ban Ngày)', city: 'Quảng Nam', rule: 'Tone vàng ấm áp' },
    { id: 'buu_dien_sg', name: 'Bưu Điện Trung Tâm Sài Gòn', city: 'TP.HCM', rule: 'Kiến trúc Pháp cổ' }
  ],
  fusion: [
    { id: 'bui_vien', name: 'Phố Tây Bùi Viện / Lê Thánh Tôn', city: 'TP.HCM', rule: 'Streetwear tự do' },
    { id: 'ta_hien', name: 'Phố Tạ Hiện / Hàng Bài', city: 'Hà Nội', rule: 'Vibe đêm nhộn nhịp' },
    { id: 'nguyen_trai', name: 'Phố Thời Trang Nguyễn Trãi', city: 'TP.HCM', rule: 'Local brand hub' },
    { id: 'concert_rap', name: 'Concert Âm Nhạc / Rap Việt Festival', city: 'Toàn quốc', rule: 'Trang phục bùng nổ' },
    { id: 'skate_park', name: 'Công Viên 30/4 / Skate Park', city: 'TP.HCM', rule: 'Skater culture' }
  ]
};

// ==============================================================================
// 11. HỆ THỐNG LUẬT GÁC CỔNG (GATEKEEPER & TABOOS RULES)
// ==============================================================================
export const TABOOS_RULES = [
  {
    id: 'RULE_NO_CHINESE_BUTTON',
    title: 'Tuyệt đối không dùng Cúc Vải (Cúc Tàu) cho Áo Ngũ Thân',
    severity: 'critical',
    penalty: 35,
    genzQuote: 'Ủa bạn hiền ơi, Áo Ngũ Thân Việt Nam chuẩn đét cúc đồng, cúc ngọc sang chảnh quyền quý mà sao lại gắn cúc vải Tàu zậy nè? Đổi ngay cúc kim loại cho đúng điệu vương triều nha!',
    remedy: 'Đổi sang Cúc Đồng Đúc Bát Bửu hoặc Cúc Bạc Hoa Sen.'
  },
  {
    id: 'RULE_MUST_HAVE_DON_Y',
    title: 'Bắt buộc phải có "Áo Đơn Y" (Áo lót trắng cổ đứng) bên trong',
    severity: 'critical',
    penalty: 25,
    genzQuote: 'Outfit check mà thiếu Áo Đơn Y trắng viền cổ thì khác gì mặc vest triệu đô mà quên sơ mi lót bên trong đâu nè! Lộ da thịt là điểm trừ cực mạnh, thêm ngay lớp Đơn Y để tôn trọn khí chất quý tộc!',
    remedy: 'Thêm lớp Áo Đơn Y trắng cổ đứng cao hơn áo ngoài 2mm.'
  },
  {
    id: 'RULE_NO_IMPERIAL_YELLOW',
    title: 'Cấm sắc Vàng Minh Hoàng & Họa tiết Rồng 5 móng cho thứ dân',
    severity: 'critical',
    penalty: 40,
    genzQuote: 'Này người đẹp ơi, diện Vàng Minh Hoàng rực lửa với rồng 5 móng này thời xưa là bị lính triều đình tuýt còi phạt nặng tội phạm thượng đấy! Đổi sang Xanh Thanh Thiên hay Tím Chính Sắc cho vừa slay vừa an toàn nào!',
    remedy: 'Chuyển sang màu Xanh Thanh Thiên, Tím Chính Sắc hoặc Đỏ Bã Trầu.'
  },
  {
    id: 'RULE_NO_FUSION_IN_TEMPLE',
    title: 'Không mang trang phục Fusion Streetwear vào Chốn Tôn Nghiêm',
    severity: 'critical',
    penalty: 30,
    genzQuote: 'Outfit này đi concert thì cháy phố, nhưng diện vào đền chùa là bị cancel liền đó nha! Đổi sang Guốc Mộc và Quần Lụa cho trang nghiêm thanh tịnh nào!',
    remedy: 'Chuyển sang Quần Lụa và Guốc Mộc truyền thống.'
  },
  {
    id: 'RULE_MALE_MUST_HAVE_KHAN_DONG',
    title: 'Áo Ngũ Thân Nam đúng chuẩn bắt buộc phải có Khăn Đóng',
    severity: 'warning',
    penalty: 15,
    genzQuote: 'Nam giới mặc ngũ thân triều Nguyễn mà thiếu khăn đóng thì phong thái giảm đi phân nửa rồi nè! Đội thêm Khăn Đóng Chữ Nhân cho chuẩn khí chất hiền sĩ nha!',
    remedy: 'Đội Khăn Đóng Chữ Nhân.'
  },
  {
    id: 'RULE_NO_NHAT_BINH_NAM',
    title: 'Không tự xưng "Nhật Bình Nam" (Sai lệch lịch sử)',
    severity: 'warning',
    penalty: 15,
    genzQuote: 'Nhật Bình lịch sử chỉ dành cho Nữ hoàng tộc thôi nè! Nam giới tương đương là Áo Chầu thêu Bổ Tử. Đừng gọi nhầm kẻo Cụ Nguồn bắt bẻ nha!',
    remedy: 'Gọi đúng là "Áo Chầu / Bổ Tử" hoặc "Áo cổ vuông cách điệu nam".'
  }
];

// ==============================================================================
// 12. CÁC HÀM TIỆN ÍCH HỖ TRỢ TRUY XUẤT & TÍNH ĐIỂM (HELPER UTILITIES)
// ==============================================================================

/**
 * Lấy danh sách sản phẩm theo Category và Product Line
 */
export function getItemsByCategory(category, styleLine = null) {
  let pool = [];
  switch (category) {
    case 'ao':
      pool = GARMENTS;
      break;
    case 'lot':
      pool = INNER_LAYERS;
      break;
    case 'cuc':
      pool = BUTTONS;
      break;
    case 'quan':
      pool = BOTTOMS;
      break;
    case 'giay':
      pool = SHOES;
      break;
    case 'phukien':
      pool = ACCESSORIES;
      break;
    default:
      pool = [];
  }
  if (!styleLine) return pool;
  return pool.filter(item => item.styleLine === styleLine);
}

/**
 * Tìm kiếm sản phẩm theo ID
 */
export function getItemById(id) {
  const all = [
    ...GARMENTS,
    ...INNER_LAYERS,
    ...BUTTONS,
    ...BOTTOMS,
    ...SHOES,
    ...ACCESSORIES
  ];
  return all.find(item => item.id === id || item.aliasId === id) || null;
}

/**
 * Cấu hình 3 Màn Hình / 3 Bối Cảnh (3-Tier Engine)
 */
export const TIER_CONFIGS = {
  heritage: {
    id: 'heritage',
    title: 'Chốn Tôn Nghiêm',
    subtitle: 'Heritage Core - Chuẩn Di Sản Triều Nguyễn',
    icon: '⛩️',
    scoreLabel: 'Độ Chuẩn Y Quan',
    desc: 'Bảo tồn 100% kết cấu y quan lịch sử: Ngũ Thân tay chẽn, Áo Tấc, Nhật Bình, Áo Chầu, đơn y trắng, khuy cúc rời, quần lụa, guốc mộc/hài thêu.',
    themeColor: '#7A222C'
  },
  modern: {
    id: 'modern',
    title: 'Thanh Lịch Đời Thường',
    subtitle: 'Modern Heritage - Ứng Dụng Hằng Ngày',
    icon: '🍃',
    scoreLabel: 'Độ Thanh Lịch',
    desc: '70% di sản + 30% cách tân đời thường: Áo ngũ thân hiện đại, quần âu wide-leg, chân váy suông, mules, sneaker trắng tối giản.',
    themeColor: '#2B5B84'
  },
  fusion: {
    id: 'fusion',
    title: 'Đô Thị Phá Cách',
    subtitle: 'Fusion Streetwear - Đậm Chất Đường Phố Gen Z',
    icon: '⚡',
    scoreLabel: 'Slay Vibe Meter',
    desc: 'Lấy cảm hứng từ cổ phục: Heritage top, áo khoác tay thụng, phối cargo, baggy jeans, chunky sneakers, xích bạc cuban.',
    themeColor: '#D97706'
  }
};

/**
 * Kiểm tra tính hợp chuẩn của sản phẩm đối với Tier / Bối cảnh hiện tại.
 * @param {Object|string} itemOrId - Sản phẩm hoặc ID sản phẩm
 * @param {'heritage'|'modern'|'fusion'} currentTier - Tier hiện tại
 * @returns {{ isCompliant: boolean, notice: string, badgeText: string }}
 */
export function checkItemTierCompliance(itemOrId, currentTier = 'heritage') {
  const item = typeof itemOrId === 'string' ? getItemById(itemOrId) : itemOrId;
  if (!item) {
    return { isCompliant: true, notice: '', badgeText: '' };
  }

  // Nếu là item cấm kỵ tuyệt đối (allowedTiers rỗng)
  if (Array.isArray(item.allowedTiers) && item.allowedTiers.length === 0) {
    const notice = item.unfitNotice?.[currentTier] || item.unfitNotice?.heritage || 'Lệch chuẩn trang phục';
    return {
      isCompliant: false,
      notice,
      badgeText: 'Lệch chuẩn trang phục'
    };
  }

  // Nếu có danh sách allowedTiers
  if (Array.isArray(item.allowedTiers)) {
    const isCompliant = item.allowedTiers.includes(currentTier);
    const notice = isCompliant ? '' : (item.unfitNotice?.[currentTier] || 'Lệch chuẩn trang phục trong bối cảnh này.');
    return {
      isCompliant,
      notice,
      badgeText: isCompliant ? '' : 'Lệch chuẩn trang phục'
    };
  }

  return { isCompliant: true, notice: '', badgeText: '' };
}

/**
 * Lấy danh sách sản phẩm theo category kèm cờ compliance với currentTier
 */
export function getItemsWithTierCompliance(category, currentTier = 'heritage') {
  const items = getItemsByCategory(category);
  return items.map(item => ({
    ...item,
    compliance: checkItemTierCompliance(item, currentTier)
  }));
}

/**
 * Tính toán điểm số Slay Score & Độ Chuẩn Di Sản theo lựa chọn
 */
export function calculateDualScore(outfit, contextId = 'heritage') {
  let slay = 82;
  let heritage = 100;
  const triggeredTaboos = [];
  const unfitItems = [];

  const { garment, inner, button, bottom, shoes, accessory, color } = outfit;
  const activeItems = [
    { key: 'garment', item: garment, label: 'Áo cổ phục' },
    { key: 'inner', item: inner, label: 'Áo lót đơn y' },
    { key: 'button', item: button, label: 'Khuy cúc' },
    { key: 'bottom', item: bottom, label: 'Thân dưới' },
    { key: 'shoes', item: shoes, label: 'Giày/Guốc' },
    { key: 'accessory', item: accessory, label: 'Phụ kiện' }
  ];

  // Kiểm tra tính hợp chuẩn của từng món đồ
  activeItems.forEach(({ key, item, label }) => {
    if (!item) return;
    const comp = checkItemTierCompliance(item, contextId);
    if (!comp.isCompliant) {
      unfitItems.push({
        key,
        item,
        label,
        notice: comp.notice
      });
      if (contextId === 'heritage') {
        heritage -= 20;
        slay -= 10;
      } else if (contextId === 'modern') {
        slay -= 5;
        heritage -= 10;
      }
    }
  });

  // 1. Kiểm tra Đơn Y
  if (inner?.id === 'layer-none' || inner?.isTaboo) {
    heritage -= 25;
    slay -= 10;
    triggeredTaboos.push(TABOOS_RULES.find(r => r.id === 'RULE_MUST_HAVE_DON_Y'));
  }

  // 2. Kiểm tra Cúc vải Tàu
  if (button?.id === 'btn-chinese-cloth' || button?.isTaboo) {
    heritage -= 35;
    slay -= 15;
    triggeredTaboos.push(TABOOS_RULES.find(r => r.id === 'RULE_NO_CHINESE_BUTTON'));
  }

  // 3. Kiểm tra Vàng hoàng cấm kỵ
  if (color?.isRestricted || color?.name?.includes('Vàng Minh Hoàng')) {
    heritage -= 40;
    slay -= 15;
    triggeredTaboos.push(TABOOS_RULES.find(r => r.id === 'RULE_NO_IMPERIAL_YELLOW'));
  }

  // 4. Kiểm tra bối cảnh Chốn Tôn Nghiêm (Heritage Core)
  if (contextId === 'heritage') {
    if (shoes?.id === 'shoes-white-sneakers' || shoes?.id?.includes('boots') || bottom?.id === 'bottom-cargo-pants') {
      heritage -= 25;
      const rule = TABOOS_RULES.find(r => r.id === 'RULE_NO_FUSION_IN_TEMPLE');
      if (rule && !triggeredTaboos.some(t => t?.id === rule.id)) {
        triggeredTaboos.push(rule);
      }
    }
    if (accessory?.id === 'acc-smartwatch') {
      heritage -= 15;
      slay -= 5;
    }
  }

  // 5. Thưởng điểm Slay cho Fusion Streetwear
  if (contextId === 'fusion') {
    if (shoes?.id?.includes('chunky') || shoes?.id?.includes('boots') || bottom?.id?.includes('cargo') || bottom?.id?.includes('jeans')) {
      slay += 12;
    }
    if (accessory?.id?.includes('cuban') || accessory?.id?.includes('chest')) {
      slay += 8;
    }
  }

  return {
    slay: Math.min(99, Math.max(30, slay)),
    heritage: Math.min(100, Math.max(15, heritage)),
    triggeredTaboos: triggeredTaboos.filter(Boolean),
    unfitItems
  };
}

export default {
  PRODUCT_LINES,
  PRODUCT_CATEGORIES,
  GARMENTS,
  INNER_LAYERS,
  BUTTONS,
  BOTTOMS,
  SHOES,
  ACCESSORIES,
  COLOR_PALETTES,
  LOCATION_MAPPING,
  TABOOS_RULES,
  TIER_CONFIGS,
  getItemsByCategory,
  getItemById,
  checkItemTierCompliance,
  getItemsWithTierCompliance,
  calculateDualScore
};
