export interface HeritageItem {
  id: string;
  name: string;
  subName: string;
  dynasty: string;
  description: string;
  gender: 'all' | 'male' | 'female';
  formFeatures: string[];
  recommendedOccasions: string[];
  historicalContext: string;
  taboosRules: string[];
  svgType: 'ngu_than' | 'ao_tac' | 'nhat_binh';
  defaultColor: string;
}

export interface TabooRule {
  id: string;
  title: string;
  ruleCode: 'NO_CHINESE_BUTTON' | 'MUST_HAVE_DON_Y' | 'NO_IMPERIAL_YELLOW' | 'NO_CLASH_MODERN_SHOES';
  severity: 'critical' | 'warning';
  penaltyScore: number;
  explanation: string;
  genZQuote: string;
  remedyAction: string;
}

export const CULTURAL_TABOOS: TabooRule[] = [
  {
    id: 'taboo-1',
    ruleCode: 'NO_CHINESE_BUTTON',
    title: 'Tuyệt đối không dùng Cúc Vải (Cúc Tàu) cho Áo Ngũ Thân',
    severity: 'critical',
    penaltyScore: 25,
    explanation: 'Quy chuẩn Y quan thời Nguyễn từ thời chúa Nguyễn Phúc Khoát và vua Minh Mạng quy định nút áo Ngũ Thân luôn là khuy tròn rời gắn vào khuyết, làm bằng kim loại (đồng, bạc, vàng chạm) hoặc gỗ quý, đá ngọc. Cúc bện bằng vải (cúc bàn đinh kiểu Mãn Thanh/Sườn xám) là lai căng, sai lệch văn hóa y quan Việt.',
    genZQuote: '“Ủa bạn hiền ơi, Áo Ngũ Thân Việt Nam chuẩn đét cúc đồng, cúc ngọc sang chảnh quyền quý mà sao lại gắn cúc vải Tàu zậy nè? Đổi ngay cúc kim loại cho đúng điệu vương triều nha!”',
    remedyAction: 'Đổi sang Cúc Kim Loại (Đồng/Bạc) hoặc Cúc Ngọc'
  },
  {
    id: 'taboo-2',
    ruleCode: 'MUST_HAVE_DON_Y',
    title: 'Bắt buộc phải có "Áo Đơn Y" (Áo lót trắng cổ đứng) bên trong',
    severity: 'critical',
    penaltyScore: 20,
    explanation: 'Áo đơn y là lớp áo trong màu trắng cổ đứng cao hơn áo ngoài chừng 2-3mm, tạo nên đường viền trắng tinh khiết nơi cổ áo. Không chỉ giữ vệ sinh để mồ hôi không làm ố lụa đắt tiền, Áo Đơn Y còn là biểu tượng cốt cách sạch sẽ, đoan chính của cổ nhân.',
    genZQuote: '“Outfit check mà thiếu Áo Đơn Y trắng viền cổ thì khác gì mặc vest triệu đô mà quên sơ mi lót bên trong đâu nè! Lộ da thịt là điểm trừ cực mạnh, thêm ngay lớp Đơn Y để tôn trọn khí chất quý tộc!”',
    remedyAction: 'Thêm lớp Áo Đơn Y trắng cổ đứng'
  },
  {
    id: 'taboo-3',
    ruleCode: 'NO_IMPERIAL_YELLOW',
    title: 'Cấm sắc Vàng Minh Hoàng & Họa tiết Rồng 5 móng cho thứ dân',
    severity: 'critical',
    penaltyScore: 30,
    explanation: 'Dưới triều Nguyễn, sắc Vàng Minh Hoàng (vàng tươi sáng rực) và Rồng 5 móng là biểu tượng tối thượng chỉ dành riêng cho Hoàng đế. Hoàng thân, quan lại và dân chúng chỉ được mặc vàng nghệ, vàng mơ nhạt hoặc các gam màu tao nhã: Xanh thiên thanh, Tím hoa cà, Đỏ bã trầu, Nâu chàm, Xanh búp chuối kèm họa tiết Tứ Quý, Bát Bửu, chữ Thọ/Phúc.',
    genZQuote: '“Này người đẹp ơi, diện Vàng Minh Hoàng rực lửa với rồng 5 móng này thời xưa là bị lính triều đình tuýt còi phạt nặng tội phạm thượng đấy! Gợi ý bạn hiền màu Tím hoa cà Huế mộng mơ hay Đỏ bã trầu vừa slay vừa quý phái!”',
    remedyAction: 'Chuyển sang màu Xanh Thiên Thanh, Tím Hoa Cà hoặc Đỏ Bã Trầu'
  },
  {
    id: 'taboo-4',
    ruleCode: 'NO_CLASH_MODERN_SHOES',
    title: 'Cảnh báo phối Cổ Phục Lễ Nghi với Sneakers hầm hố / Apple Watch',
    severity: 'warning',
    penaltyScore: 15,
    explanation: 'Khi mặc trang phục đại lễ như Áo Tấc, Áo Nhật Bình (vốn mang tính trang trọng, tĩnh tại), việc mang giày thể thao hầm hố (chunky sneakers), dép Crocs hay đồng hồ thông minh to bản dây cao su sẽ tạo sự cọc cạch thị giác cực mạnh, làm mất đi sự tôn nghiêm của di sản.',
    genZQuote: '“Biết là bạn hiền thích phong cách sporty năng động, nhưng Áo Tấc tay thụng tha thướt mà dẫm lên đôi chunky sneaker hầm hố hay quẹt Apple Watch thì trông hơi quẻ đấy! Thử ngay guốc mộc thanh lịch hoặc hài thêu mũi cong xem, bao sang xịn mịn!”',
    remedyAction: 'Thay bằng Guốc mộc quai nhung, Hài thêu hoặc Giày Loafer tối giản'
  }
];

export const HERITAGE_GARMENTS: HeritageItem[] = [
  {
    id: 'ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    subName: 'Trang phục thường nhật & linh hoạt bậc nhất thời Nguyễn',
    dynasty: 'Triều Nguyễn (TK 18 - 20)',
    description: 'Chiếc áo tiền thân trực tiếp của Áo Dài hiện đại. Với thiết kế 5 thân áo ghép lại, cổ đứng thanh lịch, tay áo bó sát cẳng tay (chẽn) gọn gàng, thuận tiện cho sinh hoạt thường nhật, dạo phố, làm việc và dự tiệc nhẹ.',
    gender: 'all',
    formFeatures: [
      'Tay chẽn ôm sát cổ tay gọn gàng',
      'Cổ đứng thẳng 3-4cm cài khuy',
      'Vạt áo kép 5 thân tạo dáng phong lưu',
      '5 cúc cài bằng đồng, bạc hoặc ngọc'
    ],
    recommendedOccasions: ['Dạo phố cuối tuần', 'Cà phê check-in', 'Lễ Tết', 'Đám cưới', 'Sự kiện thời trang'],
    historicalContext: 'Được định hình từ cải cách trang phục của chúa Nguyễn Phúc Khoát (1744) và chuẩn hóa toàn quốc dưới triều vua Minh Mạng (1827 - 1837) để tạo bản sắc độc lập cho văn hóa trang phục Việt Nam.',
    taboosRules: ['NO_CHINESE_BUTTON', 'MUST_HAVE_DON_Y', 'NO_IMPERIAL_YELLOW'],
    svgType: 'ngu_than',
    defaultColor: '#1e3a5f'
  },
  {
    id: 'ao-tac',
    name: 'Áo Tấc (Áo Tay Thụng)',
    subName: 'Đại lễ phục trang trọng của Y quan Triều Nguyễn',
    dynasty: 'Triều Nguyễn (Đại Lễ Phục)',
    description: 'Thực chất là Áo Ngũ Thân nhưng có phần tay áo may thụng rộng buông dài (từ 30cm đến 40cm). Thường mặc kèm khăn đóng và áo đơn y lót trong. Khi hành lễ hai tay khoanh trước ngực tạo vẻ tôn nghiêm, khiêm nhường sâu sắc.',
    gender: 'all',
    formFeatures: [
      'Tay thụng rộng buông thõng uy nghi',
      'Phom dáng ngũ thân truyền thống',
      'Cổ đứng cài 5 cúc kim loại',
      'Tà áo xòe nhẹ tha thướt khi di chuyển'
    ],
    recommendedOccasions: ['Lễ tế giao & đình miếu', 'Đại lễ cưới hỏi cổ truyền', 'Lễ tốt nghiệp trang trọng', 'Triển lãm văn hóa'],
    historicalContext: 'Trang phục trang trọng bậc nhất dùng trong các dịp đại lễ của mọi tầng lớp từ vua quan đến sĩ tử, dân gian triều Nguyễn, thể hiện sự thành kính với tổ tiên và quy chuẩn Nho gia.',
    taboosRules: ['NO_CHINESE_BUTTON', 'MUST_HAVE_DON_Y', 'NO_IMPERIAL_YELLOW', 'NO_CLASH_MODERN_SHOES'],
    svgType: 'ao_tac',
    defaultColor: '#4a2545'
  },
  {
    id: 'ao-nhat-binh',
    name: 'Áo Nhật Bình',
    subName: 'Cung phục quý tộc & mệnh phụ chốn Hoàng Thành',
    dynasty: 'Triều Nguyễn (Hoàng gia & Mệnh phụ)',
    description: 'Áo khoác ngoài cao quý của Hoàng hậu, Công chúa và các bậc mệnh phụ triều Nguyễn. Đặc trưng bởi dải cổ áo vạt to bản thêu hoa văn tinh xảo, khi cài lại tạo thành hình chữ nhật trước ngực. Tay áo viền dải ngũ sắc ngũ hành.',
    gender: 'female',
    formFeatures: [
      'Cổ áo hình chữ nhật vạt vuông trước ngực',
      'Viền cổ thêu Phượng Ổ, Kim Tuyến lấp lánh',
      'Tay áo dải ngũ hành ngũ sắc rực rỡ',
      'Họa tiết Thủy Ba Tam Sơn sóng nước ở vạt dưới'
    ],
    recommendedOccasions: ['Lễ rước dâu cung đình', 'Chụp ảnh di sản hoàng gia', 'Dạ hội nghệ thuật', 'Sự kiện ngoại giao'],
    historicalContext: 'Được chế định quy củ trong Khâm Định Đại Nam Hội Điển Sự Lệ. Màu sắc áo thể hiện cấp bậc nghiêm ngặt: Hoàng Hậu dùng màu vàng, Công chúa dùng màu đỏ/xanh, Cung tần dùng màu tím/lam.',
    taboosRules: ['MUST_HAVE_DON_Y', 'NO_IMPERIAL_YELLOW', 'NO_CLASH_MODERN_SHOES'],
    svgType: 'nhat_binh',
    defaultColor: '#7a1f2b'
  }
];

export interface ColorOption {
  name: string;
  vietnameseName: string;
  hex: string;
  isImperialRestricted: boolean;
  meaning: string;
  recommendedFor: string;
}

export const TRADITIONAL_COLORS: ColorOption[] = [
  {
    name: 'Thanh Thiên',
    vietnameseName: 'Xanh Thanh Thiên (Trời quang)',
    hex: '#2B5B84',
    isImperialRestricted: false,
    meaning: 'Biểu tượng của trời quang mây tạnh, sự trung chính, an nhiên và tri thức sâu rộng.',
    recommendedFor: 'Áo Ngũ Thân & Áo Tấc nam nữ'
  },
  {
    name: 'Tím Hoa Cà',
    vietnameseName: 'Tím Hoa Cà Cố Đô',
    hex: '#5E3A58',
    isImperialRestricted: false,
    meaning: 'Sắc tím trầm mặc xứ Huế, gợi vẻ đoan trang, kín đáo, sâu lắng của người phụ nữ.',
    recommendedFor: 'Áo Nhật Bình & Áo Tấc'
  },
  {
    name: 'Đỏ Bã Trầu',
    vietnameseName: 'Đỏ Bã Trầu (Huyết Dụ)',
    hex: '#7A222C',
    isImperialRestricted: false,
    meaning: 'Tượng trưng cho sự hoan hỷ, hôn lễ cát tường, vinh hoa phú quý và sức sống dồi dào.',
    recommendedFor: 'Áo Nhật Bình, Lễ phục cưới'
  },
  {
    name: 'Ngọc Bích',
    vietnameseName: 'Xanh Lục Ngọc Bích',
    hex: '#1D5C42',
    isImperialRestricted: false,
    meaning: 'Sự sinh sôi nảy nở, cốt cách thanh tao như ngọc lành không tì vết.',
    recommendedFor: 'Áo Ngũ Thân hiện đại'
  },
  {
    name: 'Nâu Chàm',
    vietnameseName: 'Nâu Chàm Cổ Phong',
    hex: '#3E2A1E',
    isImperialRestricted: false,
    meaning: 'Màu sắc truyền thống mộc mạc, bền bỉ của lụa tơ tằm nhuộm củ nâu và lá chàm.',
    recommendedFor: 'Áo Ngũ Thân phong cách Minimalist'
  },
  {
    name: 'Bạch Tuyết Đơn Y',
    vietnameseName: 'Trắng Ngà Bạch Lụa (Đơn Y)',
    hex: '#F4EFE6',
    isImperialRestricted: false,
    meaning: 'Màu của sự thuần khiết, thanh cao, là lớp áo nền tảng bắt buộc của người mặc y quan.',
    recommendedFor: 'Áo Đơn Y lót trong'
  },
  {
    name: 'Vàng Minh Hoàng',
    vietnameseName: 'Vàng Minh Hoàng (Cấm Kỵ Triều Đình)',
    hex: '#F5B014',
    isImperialRestricted: true,
    meaning: 'Màu tối thượng của bậc Thiên Tử Triều Nguyễn. Thứ dân mặc sẽ phạm quy chế y quan!',
    recommendedFor: 'Chỉ dành cho Thiên Tử thời xưa'
  }
];

// ========================================================
// CÁC BIẾN LINK ẢNH CỐ ĐỊNH CHUẨN QUY CHẾ (THEO YÊU CẦU CỦA NGƯỜI DÙNG)
// ========================================================
// 1. Hạt Khuy Cúc Áo (Ngũ Thường)
export const LINK_ANH_CUC_KIM_LOAI = '/1.png';
export const LINK_ANH_CUC_NGOC = '/2.png';
export const LINK_ANH_CUC_GO = '/3.png';
export const LINK_ANH_CUC_VAI = '/4.png';
export const LINK_ANH_CUC_AO = LINK_ANH_CUC_KIM_LOAI;

// 2. Thân Dưới Phối Cùng (Quần / Chân Váy Hiện Đại)
export const LINK_ANH_QUAN_LINEN = '/5.png';
export const LINK_ANH_VAY_XEP_LY = '/6.png';
export const LINK_ANH_QUAN_JEANS = '/7.png';
export const LINK_ANH_THAN_DUOI = LINK_ANH_QUAN_LINEN;

// 3. Giày / Guốc
export const LINK_ANH_GUOC_MOC = '/8.png';
export const LINK_ANH_HAI_THEU = '/9.png';
export const LINK_ANH_SNEAKERS = '/10.png';
export const LINK_ANH_GIAY = LINK_ANH_GUOC_MOC;

// 4. Phụ Kiện Đi Kèm
export const LINK_ANH_QUAT_GIAY = '/11.png';
export const LINK_ANH_KHAN_DONG = '/12.png';
export const LINK_ANH_BOI_NGOC = '/13.png';
export const LINK_ANH_DONG_HO = '/14.png';
export const LINK_ANH_PHU_KIEN = LINK_ANH_QUAT_GIAY;

export interface ModernRemixItem {
  id: string;
  category: 'bottom' | 'shoes' | 'accessory' | 'layer' | 'button';
  name: string;
  styleVibe: string;
  isCulturallyRespectful: boolean;
  tabooTrigger?: 'NO_CHINESE_BUTTON' | 'MUST_HAVE_DON_Y' | 'NO_CLASH_MODERN_SHOES';
  description: string;
  thumbnailUrl?: string;
  canvas2dUrl?: string;
}

export const REMIX_ITEMS: ModernRemixItem[] = [
  // Buttons (Khuy cúc áo - gán biến LINK_ANH_*)
  {
    id: 'btn-metal-copper',
    category: 'button',
    name: 'Cúc Kim Loại (Đồng Chạm Bát Bửu)',
    styleVibe: 'Chuẩn quy chuẩn Nguyễn',
    isCulturallyRespectful: true,
    description: 'Khuy kim loại đúc thủ công tròn trịa, sáng bóng bền đẹp, tượng trưng Ngũ Thường.',
    thumbnailUrl: LINK_ANH_CUC_KIM_LOAI
  },
  {
    id: 'btn-jade-green',
    category: 'button',
    name: 'Cúc Ngọc (Ngọc Bích / Cẩm Thạch)',
    styleVibe: 'Hoàng tộc sang trọng',
    isCulturallyRespectful: true,
    description: 'Chất liệu ngọc phỉ thúy tôn nét quyền quý, làm điểm nhấn thanh nhã cung đình.',
    thumbnailUrl: LINK_ANH_CUC_NGOC
  },
  {
    id: 'btn-wood-agarwood',
    category: 'button',
    name: 'Cúc Gỗ (Trầm Hương Khắc Chữ Thọ)',
    styleVibe: 'Tao nhã cổ điển',
    isCulturallyRespectful: true,
    description: 'Gỗ thơm tự nhiên, ấm áp và đượm phong thái văn nhân tao nhã xứ An Nam.',
    thumbnailUrl: LINK_ANH_CUC_GO
  },
  {
    id: 'btn-chinese-cloth',
    category: 'button',
    name: 'Cúc Vải / Cúc Tàu (Bện Dây Sườn Xám)',
    styleVibe: 'Vi phạm quy chuẩn y quan',
    isCulturallyRespectful: false,
    tabooTrigger: 'NO_CHINESE_BUTTON',
    description: 'Cúc bện vải của trang phục Mãn Thanh / Trung Hoa, hoàn toàn cấm kỵ trong y quan Việt.',
    thumbnailUrl: LINK_ANH_CUC_VAI
  },

  // Layer (Áo lót Đơn Y) - LOẠI BỎ HOÀN TOÀN ẢNH MINH HỌA THEO YÊU CẦU 1
  {
    id: 'layer-don-y-white',
    category: 'layer',
    name: 'Áo Đơn Y Trắng Cổ Đứng Lót Trong',
    styleVibe: 'Chuẩn cốt cách cổ phong',
    isCulturallyRespectful: true,
    description: 'Lớp lót trắng ngà viền quanh cổ áo ngoài 2mm, giữ phong thái lịch sự và sạch sẽ.'
  },
  {
    id: 'layer-none',
    category: 'layer',
    name: 'Không mặc Áo Lót Đơn Y (Để lộ cổ & ngực)',
    styleVibe: 'Thiếu chuẩn mực',
    isCulturallyRespectful: false,
    tabooTrigger: 'MUST_HAVE_DON_Y',
    description: 'Không mặc đơn y làm mất đi tỉ lệ vàng cổ áo và dễ gây phản cảm khi vận động.'
  },

  // Bottoms (Thân Dưới Phối Cùng - gán biến LINK_ANH_*)
  {
    id: 'bottom-linen-wide-pants',
    category: 'bottom',
    name: 'Quần Ống Rộng Linen',
    styleVibe: 'Thanh lịch mộc mạc',
    isCulturallyRespectful: true,
    description: 'Chất vải linen tự nhiên buông rủ thoáng mát, giữ trọn nét thanh tao thuần khiết.',
    thumbnailUrl: LINK_ANH_QUAN_LINEN,
    canvas2dUrl: '/canvas/canvas-quan-linen.png'
  },
  {
    id: 'bottom-pleated-midi-skirt',
    category: 'bottom',
    name: 'Chân Váy Xếp Ly Hiện Đại',
    styleVibe: 'Chic Neo-Tradition',
    isCulturallyRespectful: true,
    description: 'Nếp xếp ly đều tăm tắp uyển chuyển tạo vẻ hiện đại, nữ tính và cực kỳ tôn dáng.',
    thumbnailUrl: LINK_ANH_VAY_XEP_LY,
    canvas2dUrl: '/canvas/canvas-vay-xep-ly.png'
  },
  {
    id: 'bottom-high-waist-jeans',
    category: 'bottom',
    name: 'Quần Jeans Cạp Cao',
    styleVibe: 'Gen Z Heritage Streetwear',
    isCulturallyRespectful: true,
    description: 'Chất denim đứng phom cạp cao tôn dáng, giao thoa tuyệt vời giữa cổ phong và đường phố.',
    thumbnailUrl: LINK_ANH_QUAN_JEANS,
    canvas2dUrl: '/canvas/canvas-quan-jeans.png'
  },

  // Shoes (Giày / Guốc - gán biến LINK_ANH_*)
  {
    id: 'shoes-wooden-clogs',
    category: 'shoes',
    name: 'Guốc Mộc Truyền Thống',
    styleVibe: 'Hồn xưa thanh nhã',
    isCulturallyRespectful: true,
    description: 'Guốc gỗ quai nhung êm ái, gõ nhịp lộc cộc khoan thai đặc trưng nét duyên Cố Đô.',
    thumbnailUrl: LINK_ANH_GUOC_MOC,
    canvas2dUrl: '/canvas/canvas-guoc-moc.png'
  },
  {
    id: 'shoes-embroidered-slippers',
    category: 'shoes',
    name: 'Hài Thêu Hoa Văn',
    styleVibe: 'Cung đình cổ kính',
    isCulturallyRespectful: true,
    description: 'Mũi hài vểnh nhẹ dáng thuyền rồng, thêu chỉ kim tuyến hoa sen tinh xảo vương giả.',
    thumbnailUrl: LINK_ANH_HAI_THEU,
    canvas2dUrl: '/canvas/canvas-hai-theu.png'
  },
  {
    id: 'shoes-white-sneakers',
    category: 'shoes',
    name: 'Sneakers Trắng Tối Giản',
    styleVibe: 'Tối giản năng động',
    isCulturallyRespectful: true,
    tabooTrigger: 'NO_CLASH_MODERN_SHOES',
    description: 'Giày sneaker phom thấp gọn gàng, phù hợp dạo phố thường nhật cùng Áo Tay Chẽn.',
    thumbnailUrl: LINK_ANH_SNEAKERS,
    canvas2dUrl: '/canvas/canvas-sneakers.png'
  },

  // Accessories (Phụ Kiện Đi Kèm - gán biến LINK_ANH_*)
  {
    id: 'acc-paper-fan',
    category: 'accessory',
    name: 'Quạt Giấy Trầm Hương',
    styleVibe: 'Phong lưu tao nhã',
    isCulturallyRespectful: true,
    description: 'Phụ kiện bất ly thân của văn nhân, tỏa hương trầm nhẹ nhàng khi phe phẩy.',
    thumbnailUrl: LINK_ANH_QUAT_GIAY,
    canvas2dUrl: '/canvas/canvas-quat-giay.png'
  },
  {
    id: 'acc-khan-dong',
    category: 'accessory',
    name: 'Khăn Đóng Vải Gấm',
    styleVibe: 'Trọng thể tôn nghiêm',
    isCulturallyRespectful: true,
    description: 'Khăn đội đầu tạo diện mạo chỉnh tề, chuẩn mực cho người mặc cổ phục.',
    thumbnailUrl: LINK_ANH_KHAN_DONG,
    canvas2dUrl: '/canvas/canvas-khan-dong.png'
  },
  {
    id: 'acc-jade-pendant',
    category: 'accessory',
    name: 'Bội Ngọc / Dây Đeo',
    styleVibe: 'Vương giả thanh thuần',
    isCulturallyRespectful: true,
    description: 'Tiếng ngọc va nhẹ mang ý nghĩa trừ tà, thể hiện đức hạnh của người quân tử.',
    thumbnailUrl: LINK_ANH_BOI_NGOC,
    canvas2dUrl: '/canvas/canvas-boi-ngoc.png'
  },
  {
    id: 'acc-smartwatch',
    category: 'accessory',
    name: 'Đồng Hồ Thông Minh',
    styleVibe: 'Lạc quẻ thời đại',
    isCulturallyRespectful: false,
    tabooTrigger: 'NO_CLASH_MODERN_SHOES',
    description: 'Màn hình điện tử sáng chói lạc điệu hoàn toàn trong bối cảnh hoài cổ.',
    thumbnailUrl: LINK_ANH_DONG_HO,
    canvas2dUrl: '/canvas/canvas-dong-ho.png'
  }
];

export interface HeritageQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  pointsChange: number; // +10 if correct, -25 or -30 if taboo
  badgeTitle: string; // "Chuẩn đét! 10 điểm không có nhưng" or "CẢNH BÁO PHẠM HÚY TRIỀU ĐÌNH!"
  culturalExplanation: string;
  stylistFeedback: string;
  ruleCode?: string;
}

export interface HeritageQuizItem {
  id: string;
  questionNumber: number;
  question: string;
  scenarioContext: string;
  options: HeritageQuizOption[];
}

export const COURT_TABOO_QUIZ: HeritageQuizItem[] = [
  {
    id: 'quiz-1',
    questionNumber: 1,
    question: 'Khi may Áo Ngũ Thân hoặc Nhật Bình, bạn chọn cúc bện bằng vải lụa (cúc Tàu / cúc bàn đinh) cho mềm mại. Lựa chọn này đúng hay sai?',
    scenarioContext: 'Quy chuẩn Khuy Cúc Áo thời Nguyễn',
    options: [
      {
        id: 'q1-wrong',
        text: 'Đúng - Cúc vải vừa mềm, tiện lợi và cũng là phong cách truyền thống Á Đông.',
        isCorrect: false,
        pointsChange: -25,
        badgeTitle: 'CẢNH BÁO PHẠM HÚY TRIỀU ĐÌNH!',
        culturalExplanation: 'Quy chuẩn Y quan thời Nguyễn từ thời chúa Nguyễn Phúc Khoát và vua Minh Mạng quy định nút áo Ngũ Thân luôn là khuy tròn rời gắn vào khuyết, làm bằng kim loại (đồng, bạc, vàng chạm) hoặc gỗ quý, ngọc thạch. Cúc bện bằng vải (kiểu Mãn Thanh / Sườn xám) là lai căng, sai lệch văn hóa y quan Việt!',
        stylistFeedback: 'Ối giồi ôi người đẹp ơi! Áo Ngũ Thân nước mình bao đời cúc đồng, cúc ngọc sang chảnh quyền quý mà sao lại gắn cúc vải Tàu zậy nè? Bị trừ ngay 25 điểm oan uổng nhé!',
        ruleCode: 'NO_CHINESE_BUTTON'
      },
      {
        id: 'q1-correct',
        text: 'Sai - Nút áo Ngũ Thân bắt buộc là khuy rời bằng kim loại, ngọc hoặc gỗ quý; cấm tuyệt cúc vải bện kiểu Tàu.',
        isCorrect: true,
        pointsChange: 10,
        badgeTitle: 'Chuẩn đét! 10 điểm không có nhưng',
        culturalExplanation: 'Chính xác 100%! 5 chiếc cúc rời bằng kim loại hoặc ngọc thạch tượng trưng cho Ngũ Thường (Nhân - Lễ - Nghĩa - Trí - Tín), gắn chặt với cốt cách đoan chính của cổ nhân nước Nam.',
        stylistFeedback: 'Mười điểm cho bạn hiền! Kiến thức lịch sử vững như bàn thạch, đơm cúc kim loại chạm khắc hoa văn vừa slay vừa giữ vẹn nguyên khí chất vương triều!',
        ruleCode: 'NO_CHINESE_BUTTON'
      }
    ]
  },
  {
    id: 'quiz-2',
    questionNumber: 2,
    question: 'Người dùng phổ thông khi diện cổ phục dạo phố có được tự do chọn sắc Vàng Minh Hoàng hoặc thêu Rồng 5 móng?',
    scenarioContext: 'Quy chế Sắc phục & Đồ án Hoàng gia',
    options: [
      {
        id: 'q2-wrong',
        text: 'Có thể chọn - Màu vàng rực rỡ và rồng 5 móng chụp ảnh rất nổi bật, tôn dáng hoàng gia.',
        isCorrect: false,
        pointsChange: -30,
        badgeTitle: 'CẢNH BÁO PHẠM HÚY TRIỀU ĐÌNH!',
        culturalExplanation: 'Đại kỵ khi quân phạm thượng! Dưới triều Nguyễn, sắc Vàng Minh Hoàng (vàng tươi sáng rực) và Rồng 5 móng là BIỂU TƯỢNG TỐI THƯỢNG chỉ dành riêng cho Hoàng đế. Người dân chỉ được mặc vàng nghệ nhạt, tím hoa cà, xanh thiên thanh, đỏ bã trầu kèm hoa văn Tứ Quý, Bát Bửu.',
        stylistFeedback: 'Báo động đỏ cấp độ tối cao! Thời xưa mà thứ dân tự ý diện Vàng Minh Hoàng với rồng 5 móng là bị lính triều đình tuýt còi phạt nặng tội phạm thượng đấy! Trừ 30 điểm liền tay!',
        ruleCode: 'NO_IMPERIAL_YELLOW'
      },
      {
        id: 'q2-correct',
        text: 'Tuyệt đối cấm - Sắc Vàng Minh Hoàng & Rồng 5 móng là đặc quyền Thiên Tử; dân gian nên chọn Tím hoa cà, Xanh, Đỏ bã trầu.',
        isCorrect: true,
        pointsChange: 10,
        badgeTitle: 'Chuẩn đét! 10 điểm không có nhưng',
        culturalExplanation: 'Am hiểu điển lệ sâu sắc! Giới trẻ hiện đại chuộng sắc Tím Huế mộng mơ, Xanh thiên thanh trung chính hay Đỏ bã trầu cát tường vừa sang trọng vừa đúng tinh thần khiêm nhu di sản.',
        stylistFeedback: 'Xuất sắc luôn người đẹp ơi! Tinh tế nhận ra ranh giới vương quyền và dân gian chính là đẳng cấp của một stylist cổ phục chân chính!',
        ruleCode: 'NO_IMPERIAL_YELLOW'
      }
    ]
  },
  {
    id: 'quiz-3',
    questionNumber: 3,
    question: 'Khi diện Áo Ngũ Thân hoặc Nhật Bình, có thể bỏ qua lớp "Áo Đơn Y" (áo lót trắng cổ đứng) bên trong để cho thoáng mát?',
    scenarioContext: 'Quy chuẩn Lớp Lót Cốt Cách',
    options: [
      {
        id: 'q3-wrong',
        text: 'Được chứ - Thời tiết nhiệt đới oi bức thì nên bỏ bớt lớp lót để thoải mái vận động.',
        isCorrect: false,
        pointsChange: -20,
        badgeTitle: 'CẢNH BÁO PHẠM HÚY TRIỀU ĐÌNH!',
        culturalExplanation: 'Lệch chuẩn trang phục nghiêm trọng! Không có Áo Đơn Y sẽ làm lộ da thịt gây phản cảm, mồ hôi trực tiếp làm ố hỏng lụa gấm đắt tiền và làm mất đi đường viền cổ trắng 2mm chuẩn mực của cổ nhân.',
        stylistFeedback: 'Ủa alo bạn hiền ơi, mặc cổ phục nghìn đô mà quên áo Đơn Y trắng lót trong thì khác gì mang vest xịn mà quên mặc sơ mi! Trừ 20 điểm vì làm mất đi nét đoan chính nha!',
        ruleCode: 'MUST_HAVE_DON_Y'
      },
      {
        id: 'q3-correct',
        text: 'Bắt buộc phải mặc - Áo Đơn Y trắng nhô cao hơn 2-3mm giữ vệ sinh lụa quý và biểu trưng cho cốt cách đoan chính.',
        isCorrect: true,
        pointsChange: 10,
        badgeTitle: 'Chuẩn đét! 10 điểm không có nhưng',
        culturalExplanation: 'Chuẩn không cần chỉnh! Cổ áo trắng hé lộ 2mm tạo nên độ tương phản quang học hoàn mỹ làm sáng bừng khuôn mặt và phong thái thanh lịch của người mặc.',
        stylistFeedback: 'Trời ơi xuất sắc! Chi tiết cổ áo Đơn Y trắng hé lộ nhẹ nhàng chính là "vũ khí bí mật" khiến diện mạo cổ phục sáng bừng thần thái quý tộc!',
        ruleCode: 'MUST_HAVE_DON_Y'
      }
    ]
  },
  {
    id: 'quiz-4',
    questionNumber: 4,
    question: 'Khi diện Áo Tấc (Đại lễ phục tay thụng rộng) tham dự đám cưới truyền thống, bạn phối cùng đôi Chunky Sneakers hầm hố. Cách phối này có được khuyến khích?',
    scenarioContext: 'Phối Giày Dép với Lễ Phục',
    options: [
      {
        id: 'q4-wrong',
        text: 'Rất khuyến khích - Phối sneakers tạo phong cách phá cách Gen Z năng động.',
        isCorrect: false,
        pointsChange: -15,
        badgeTitle: 'CẢNH BÁO PHẠM HÚY TRIỀU ĐÌNH!',
        culturalExplanation: 'Xung đột thị giác và giảm trang trọng! Áo Tấc là đại lễ phục mang tính trang trọng, tĩnh tại. Đế giày sneaker hầm hố gây nặng nề và xung đột dữ dội với nét tha thướt của y phục lễ nghi.',
        stylistFeedback: 'Biết là bạn hiền thích phong cách sporty chiến đét, nhưng Áo Tấc tay thụng uy nghi mà dẫm lên đôi sneaker khủng bố thì trông lạc quẻ lắm! Trừ 15 điểm để bạn hiền đổi guốc mộc nhé!',
        ruleCode: 'NO_CLASH_MODERN_SHOES'
      },
      {
        id: 'q4-correct',
        text: 'Không nên - Phục trang đại lễ nghiêm trang nên thay bằng Guốc mộc quai nhung hoặc Hài thêu hoa sen.',
        isCorrect: true,
        pointsChange: 10,
        badgeTitle: 'Chuẩn đét! 10 điểm không có nhưng',
        culturalExplanation: 'Lựa chọn điểm mười! Tiếng gõ guốc lộc cộc khoan thai hay mũi hài thêu hoa sen tinh xảo mới là người bạn đồng hành hoàn mỹ của Áo Tấc.',
        stylistFeedback: 'Quá sang xịn mịn luôn chủ nhân ơi! Guốc mộc quai nhung gõ nhịp khoan thai hay hài thêu mũi cong mới đích thực là chân ái của Áo Tấc!',
        ruleCode: 'NO_CLASH_MODERN_SHOES'
      }
    ]
  }
];

export interface HeritageStoryDetail {
  id: string;
  title: string;
  shortDesc: string;
  iconName: string;
  tagline: string;
  deepDive: string;
  genZTone: string;
  points: { label: string; text: string }[];
  visualPrompt: string;
}

export const HERITAGE_STORIES: HeritageStoryDetail[] = [
  {
    id: 'story-5-panels',
    title: 'Ý Nghĩa 5 Thân Áo & Đạo Hiếu Tứ Thân Phụ Mẫu',
    shortDesc: 'Bí ẩn đằng sau 5 thân lụa ghép thành kiệt tác Áo Ngũ Thân.',
    iconName: 'Shield',
    tagline: 'Gia đình là điểm tựa, cha mẹ là lá chắn',
    deepDive: 'Chiếc Áo Ngũ Thân không phải may tùy hứng mà được ghép từ 5 mảnh vải (thân áo). Hai thân trước ghép lại bằng đường may chính giữa (đường trung phẫu), hai thân sau tương tự tạo thành 4 thân tượng trưng cho "Tứ Thân Phụ Mẫu": cha mẹ đẻ và cha mẹ chồng/vợ. Thân thứ năm nhỏ hơn nằm kín đáo ở bên trong (gọi là thân con hay vạt con), tượng trưng cho chính người mặc được cha mẹ yêu thương, che chở bọc lấy.',
    genZTone: '“Gen Z chúng mình hay nói về ‘chỗ dựa tinh thần’, thì đây nè: Áo Ngũ Thân chính là bản tuyên ngôn thời trang ấm áp nhất về gia đình! Mặc áo lên người là mang theo tình thương của 4 bề cha mẹ che chở cho bạn hiền. Đi đâu cũng có gia đình bảo bọc, tự tin flex phong thái con ngoan trò giỏi!”',
    points: [
      { label: '2 Thân Trước', text: 'Tượng trưng cho Cha Mẹ đẻ luôn ở phía trước dẫn lối bảo bọc.' },
      { label: '2 Thân Sau', text: 'Tượng trưng cho Cha Mẹ chồng/vợ luôn là hậu phương vững chắc phía sau.' },
      { label: '1 Thân Con Ẩn', text: 'Tượng trưng cho người con nằm giữa lòng gia đình, luôn giữ đạo hiếu.' }
    ],
    visualPrompt: 'five_panels_diagram'
  },
  {
    id: 'story-5-buttons',
    title: '5 Cúc Ngũ Thường & Vì Sao Cấm Tuyệt Cúc Vải Tàu',
    shortDesc: '5 hạt khuy tròn nhỏ nhưng chứa đựng cả đạo làm người của tiền nhân.',
    iconName: 'CircleDot',
    tagline: 'Nhân - Lễ - Nghĩa - Trí - Tín đúc kết trong từng hạt cúc',
    deepDive: 'Hàng 5 chiếc cúc cài chéo từ cổ sang nách và dọc sườn tượng trưng cho Ngũ Thường của đạo Nho: Nhân (lòng trắc ẩn), Lễ (sự tôn trọng mực thước), Nghĩa (lẽ công bằng), Trí (sự sáng suốt) và Tín (chữ tín danh dự). Người xưa quan niệm gài cúc áo là cài đặt phẩm hạnh của bản thân trước khi bước ra thế giới. Cúc áo Ngũ Thân bắt buộc phải là cúc rời bằng kim loại (đồng, bạc, vàng chạm) hoặc ngọc/gỗ quý cài vào khuyết. Tuyệt đối không dùng cúc vải bện kiểu Mãn Thanh (Sườn xám) vì làm mất đi tính chuẩn hóa y quan thuần Việt của chúa Nguyễn.',
    genZTone: '“Outfit có thể cháy, nhưng nhân cách thì phải vững! 5 chiếc cúc áo chính là ‘checklist đạo đức’ của người Việt xưa: Nhân - Lễ - Nghĩa - Trí - Tín. Nhớ kỹ nha các chiến thần phối đồ: Cúc áo là kim loại hoặc ngọc sáng loáng, đừng dại mà gắn cúc vải Tàu kẻo Stylist giận tím người!”',
    points: [
      { label: 'Cúc 1 (Cổ)', text: 'Chữ NHÂN: Giữ lời nói và tấm lòng hướng thiện với mọi người.' },
      { label: 'Cúc 2 (Cổ áo mở)', text: 'Chữ LỄ: Ứng xử lễ phép, tôn ti trật tự chốn cộng đồng.' },
      { label: 'Cúc 3 (Nách)', text: 'Chữ NGHĨA: Hành hiệp trượng nghĩa, không phụ lòng người tri kỷ.' },
      { label: 'Cúc 4 (Sườn trên)', text: 'Chữ TRÍ: Sáng suốt trau dồi tri thức, giữ tâm trí tỉnh táo.' },
      { label: 'Cúc 5 (Vạt dưới)', text: 'Chữ TÍN: Giữ trọn lời hứa, một chữ tín quý hơn vàng.' }
    ],
    visualPrompt: 'five_buttons_diagram'
  },
  {
    id: 'story-phuong-o',
    title: 'Họa Tiết Phượng Ổ - Quyền Năng Phái Đẹp Cung Đình',
    shortDesc: 'Biểu tượng tối cao của phẩm hạnh và nét quý phái trên Áo Nhật Bình.',
    iconName: 'Crown',
    tagline: 'Phẩm hạnh đoan trang, kiêu sa như loài chim quý',
    deepDive: 'Hoa văn Phượng Ổ (chim Phượng Hoàng cuộn tròn trong một hình tròn viên mãn) là đồ án trang trí kinh điển trên cổ áo và thân áo Nhật Bình của bậc Hoàng Hậu, Công Chúa. Chim Phượng biểu trưng cho vẻ đẹp đức hạnh, lòng từ bi, sự tái sinh rực rỡ và uy quyền của nữ nhân chốn cung đình Triều Nguyễn.',
    genZTone: '“Các nàng thơ thích vibe ‘chị đại vương triều’ đâu rồi? Hoa văn Phượng Ổ trên Áo Nhật Bình chính là bảo chứng visual quyền lực tối thượng! Chim phượng thêu kim tuyến uốn lượn tinh tế trên nền lụa đỏ thắm hay tím huế giúp người đẹp giật trọn spotlight mọi buổi tiệc!”',
    points: [
      { label: 'Hình Tròn Viên Mãn', text: 'Tượng trưng cho sự viên mãn, trời tròn đất vuông, hạnh phúc vẹn toàn.' },
      { label: 'Chim Phượng Thêu Chỉ Vàng', text: 'Tôn vinh đức hạnh 5 điều tốt lành của người phụ nữ Á Đông.' },
      { label: 'Vị Trí Cổ Áo Chữ Y', text: 'Tạo khung đối xứng tôn vinh khuôn mặt và cốt cách thanh tú.' }
    ],
    visualPrompt: 'phuong_o_pattern'
  },
  {
    id: 'story-thuy-ba',
    title: 'Thủy Ba Tam Sơn - Sóng Nước & Non Bồng Vững Bền',
    shortDesc: 'Đồ án sóng nước ba tầng và ngọn núi vững chãi nơi gấu áo.',
    iconName: 'Waves',
    tagline: 'Giang sơn trường tồn, phúc đức sâu tựa đại dương',
    deepDive: 'Thủy Ba (sóng nước cuộn trào nhiều màu sắc) kết hợp cùng Tam Sơn (ba ngọn núi nổi lên giữa sóng) là đồ án thêu hoặc dệt ở phần gấu áo và tay áo của Nhật Bình và triều phục. Ba ngọn núi tượng trưng cho tam sơn bồng lai vững chãi không gì lay chuyển nổi, sóng nước ngụ ý phúc lộc dồi dào như biển cả bao la.',
    genZTone: '“Nhìn vạt dưới Áo Nhật Bình như một bức tranh nghệ thuật sóng nước thủy ba ngũ sắc chuyển động theo từng bước chân! Đây không đơn thuần là hoa văn đâu, mà là lời chúc ‘vững như bàn thạch, tài lộc trào dâng’ đỉnh chóp của tiền nhân gửi lại!”',
    points: [
      { label: 'Sóng Nước Tam Điệp', text: 'Ba tầng sóng biểu trưng cho sự mềm mại, biến chuyển linh hoạt.' },
      { label: 'Tam Sơn Trung Tâm', text: 'Ba ngọn núi thiêng biểu trưng cho giang sơn vững bền và ý chí kiên định.' },
      { label: 'Dải Ngũ Sắc Ngũ Hành', text: 'Kim - Mộc - Thủy - Hỏa - Thổ cân bằng âm dương hộ mệnh cho người mặc.' }
    ],
    visualPrompt: 'thuy_ba_waves'
  },
  {
    id: 'story-don-y',
    title: 'Áo Đơn Y - Tấm Khiên Cốt Cách Cổ Phong',
    shortDesc: 'Tại sao mặc cổ phục nhất định phải có lớp áo lót trắng cổ đứng?',
    iconName: 'Sparkles',
    tagline: 'Sạch sẽ bên trong, rạng rỡ bên ngoài',
    deepDive: 'Áo Đơn Y là lớp áo lót màu trắng dệt từ lụa tơ tằm mềm, cổ đứng ôm khít gáy, luôn được mặc đầu tiên trước khi khoác Áo Ngũ Thân hay Nhật Bình. Phần cổ áo trắng sẽ nhô cao hơn cổ áo ngoài từ 2 đến 3 milimet. Về công năng, nó ngăn mồ hôi làm bẩn gấm vóc đắt tiền; về mỹ học, đường viền trắng tinh tế tạo nên điểm nhấn tương phản quang học sang trọng, là dấu hiệu khẳng định người mặc là người có giáo dưỡng và sạch sẽ.',
    genZTone: '“Đừng bao giờ để outfit nghìn đô bị flop chỉ vì thiếu chiếc áo Đơn Y trắng vài trăm nghìn bạn hiền nhé! Cổ áo trắng lộ ra nhè nhẹ chính là chi tiết ‘nhỏ nhưng có võ’ khiến ai nhìn vào cũng phải gật gù khen bạn tinh tế và am hiểu văn hóa thật sự!”',
    points: [
      { label: 'Đường Viền Cổ Bạch Lụa', text: 'Tạo hiệu ứng thị giác tương phản làm nổi bật khuôn mặt và màu áo ngoài.' },
      { label: 'Bảo Vệ Lụa Quý', text: 'Giúp vải gấm thêu kim sa không tiếp xúc trực tiếp mồ hôi cơ thể.' },
      { label: 'Quy Chuẩn Đoan Trang', text: 'Đảm bảo cổ áo kín đáo, lịch thiệp tuyệt đối trong mọi tư thế.' }
    ],
    visualPrompt: 'don_y_collar'
  },
  {
    id: 'story-colors',
    title: 'Sắc Phục Triều Nguyễn: Ranh Giới Hoàng Đế & Dân Gian',
    shortDesc: 'Quy chế màu sắc nghiêm ngặt tránh họa phạm húy thời xưa.',
    iconName: 'Palette',
    tagline: 'Mỗi gam màu mang một cấp bậc và thông điệp văn hóa',
    deepDive: 'Triều Nguyễn áp dụng chặt chẽ quy chế sắc phục: Màu Vàng Minh Hoàng (vàng tươi của kim loại quý) là sắc màu độc quyền của Thiên Tử tượng trưng cho Trung Ương Mậu Kỷ Thổ. Thường dân nếu mặc vàng tươi sẽ bị coi là tiếm việt phạm thượng. Thay vào đó, dân gian chuộng sắc xanh chàm, xanh thanh thiên, tím hoa cà, đỏ thẫm bã trầu, đen tuyền bóng mỡ gà... tạo nên bảng màu y quan Việt trầm ấm, khiêm nhường nhưng cực kỳ sang trọng.',
    genZTone: '“Thế nên đi thuê hay sắm cổ phục, nếu bạn thấy tiệm nào gạ mua Áo Ngũ Thân màu vàng tươi chói lóa có rồng cuồn cuộn thì hãy ‘né vội’ nha! Hãy chọn tông Tím Huế mộng mơ, Xanh lục ngọc hoặc Đỏ bã trầu để diện lên vừa chuẩn gu hoàng triều vừa đúng lễ nghi di sản!”',
    points: [
      { label: 'Vàng Minh Hoàng', text: 'Đặc quyền Thiên Tử thời phong kiến - Người hiện đại nên tránh để giữ sự khiêm nhu.' },
      { label: 'Xanh Thanh Thiên & Ngọc Bích', text: 'Tượng trưng cho mầm sống, sự bình yên và tính tình thanh bạch.' },
      { label: 'Tím Hoa Cà & Đỏ Huyết Dụ', text: 'Sắc thái cung đình hoài cổ mang đậm linh hồn xứ Huế.' }
    ],
    visualPrompt: 'color_spectrum'
  }
];

export interface RentalLocation {
  id: string;
  name: string;
  category: 'rental' | 'tailor' | 'museum';
  city: 'Hà Nội' | 'Huế' | 'TP. Hồ Chí Minh' | 'Hội An';
  address: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  phone: string;
  openHours: string;
  priceRange: string;
  services: string[];
  highlight: string;
  coordinates: { x: number; y: number }; // Percentage on simulated map canvas
}

export const RENTAL_LOCATIONS: RentalLocation[] = [
  {
    id: 'loc-1',
    name: 'V\'Style - Không Gian Cổ Phục Việt',
    category: 'rental',
    city: 'Hà Nội',
    address: 'Số 18, Ngõ Tràng Tiền, Hoàn Kiếm, Hà Nội',
    distanceKm: 1.2,
    rating: 4.9,
    reviewCount: 384,
    phone: '0912 345 678',
    openHours: '08:30 - 20:30',
    priceRange: '250.000đ - 650.000đ / ngày',
    services: ['Thuê Áo Ngũ Thân & Nhật Bình', 'Makeup Cổ Phong', 'Chụp ảnh Hồ Gươm', 'Phụ kiện hài thêu & quạt trầm'],
    highlight: 'Hơn 200 bộ cổ phục may đo lụa tơ tằm Vạn Phúc đúng quy chuẩn triều Nguyễn.',
    coordinates: { x: 48, y: 18 }
  },
  {
    id: 'loc-2',
    name: 'Y Vân Hiên - Phục Dựng Di Sản Y Quan',
    category: 'tailor',
    city: 'Hà Nội',
    address: 'Số 42, Phố Hàng Bạc, Hoàn Kiếm, Hà Nội',
    distanceKm: 2.1,
    rating: 5.0,
    reviewCount: 512,
    phone: '0988 776 655',
    openHours: '09:00 - 19:00',
    priceRange: 'May đo: 3.500.000đ - 18.000.000đ',
    services: ['May đo bespoke chuẩn y quan', 'Dệt lụa tơ tằm theo hoa văn hoàng gia', 'Cúc ngọc chạm thủ công', 'Tư vấn phom dáng'],
    highlight: 'Đơn vị tiên phong phục dựng cổ phục triều Nguyễn cho các phim điện ảnh và nghiên cứu sinh.',
    coordinates: { x: 52, y: 22 }
  },
  {
    id: 'loc-3',
    name: 'Đại Nam Tạp Kỷ - Cổ Phục Cố Đô',
    category: 'rental',
    city: 'Huế',
    address: '79 Nguyễn Huệ, TP. Huế, Thừa Thiên Huế',
    distanceKm: 3.4,
    rating: 4.9,
    reviewCount: 420,
    phone: '0905 123 456',
    openHours: '08:00 - 21:00',
    priceRange: '200.000đ - 550.000đ / ngày',
    services: ['Thuê Nhật Bình & Áo Tấc hoàng cung', 'Chụp ảnh Đại Nội & Lăng Tẩm', 'Hướng dẫn viên phong thái', 'Khăn vành dây cổ truyền'],
    highlight: 'Nằm ngay trung tâm bờ nam sông Hương, chuyên cho thuê cổ phục phục vụ dạo Đại Nội.',
    coordinates: { x: 56, y: 52 }
  },
  {
    id: 'loc-4',
    name: 'Bảo Tàng Cổ Vật Cung Đình Huế',
    category: 'museum',
    city: 'Huế',
    address: 'Số 3 Lê Trực, Phường Đông Ba, TP. Huế',
    distanceKm: 4.0,
    rating: 4.8,
    reviewCount: 890,
    phone: '0234 352 4462',
    openHours: '07:30 - 17:30',
    priceRange: 'Vé tham quan: 50.000đ / người',
    services: ['Trưng bày bảo vật y quan triều Nguyễn', 'Áo bào hoàng đế & hoàng hậu thực tế', 'Tư liệu lịch sử Hội Điển', 'Thuyết minh di sản'],
    highlight: 'Nơi lưu giữ hiện vật long bào, hoàng bào, áo Nhật Bình nguyên bản quý giá nhất Việt Nam.',
    coordinates: { x: 60, y: 48 }
  },
  {
    id: 'loc-5',
    name: 'Hoa Niên - Năm Tháng Tươi Đẹp',
    category: 'rental',
    city: 'TP. Hồ Chí Minh',
    address: '154/8 Nguyễn Đình Chính, Phú Nhuận, TP.HCM',
    distanceKm: 1.8,
    rating: 4.9,
    reviewCount: 670,
    phone: '0933 889 900',
    openHours: '09:00 - 21:00',
    priceRange: '300.000đ - 700.000đ / ngày',
    services: ['Cổ phục chụp studio & concept Gen Z', 'Remix phụ kiện hiện đại', 'Makeup tone cổ phong Sài Gòn xưa', 'Cho thuê theo nhóm'],
    highlight: 'Địa chỉ quen thuộc của giới trẻ Sài Thành yêu thích remix cổ phục với gu thời trang cá tính.',
    coordinates: { x: 42, y: 82 }
  },
  {
    id: 'loc-6',
    name: 'Bảo Tàng Lịch Sử TP. Hồ Chí Minh',
    category: 'museum',
    city: 'TP. Hồ Chí Minh',
    address: 'Số 2 Nguyễn Bỉnh Khiêm, Bến Nghé, Quận 1, TP.HCM',
    distanceKm: 2.7,
    rating: 4.7,
    reviewCount: 1200,
    phone: '028 3829 8146',
    openHours: '08:00 - 17:00',
    priceRange: 'Vé vào cửa: 30.000đ / người',
    services: ['Chuyên đề Trang Phục Việt Qua Các Thời Kỳ', 'Giao lưu văn hóa y quan', 'Không gian chụp ảnh kiến trúc Đông Dương'],
    highlight: 'Không gian kiến trúc Indochine giao hòa với các phòng trưng bày trang phục cổ truyền đặc sắc.',
    coordinates: { x: 46, y: 86 }
  },
  {
    id: 'loc-7',
    name: 'Nam Phương Cổ Phục - Phố Cổ Hội An',
    category: 'rental',
    city: 'Hội An',
    address: 'Số 48 Trần Phú, Phường Minh An, TP. Hội An',
    distanceKm: 0.8,
    rating: 4.9,
    reviewCount: 310,
    phone: '0979 555 444',
    openHours: '08:00 - 21:30',
    priceRange: '250.000đ - 600.000đ / ngày',
    services: ['Thuê cổ phục dạo phố lồng đèn', 'Chụp thuyền hoa đăng', 'Guốc mộc & quạt trầm Hội An', 'Hài thêu thủ công'],
    highlight: 'Tọa lạc giữa lòng phố cổ Hội An, cho thuê Áo Tấc & Ngũ Thân lộng lẫy dưới ánh đèn lồng.',
    coordinates: { x: 62, y: 58 }
  }
];
