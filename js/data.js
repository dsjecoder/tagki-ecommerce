// tagki-clone Data with LocalStorage Persistence for Products, Categories, Settings & Flash Sales

const INITIAL_CATEGORIES = [
  { id: 'all', name: 'Tất cả sản phẩm', name_en: 'All Products', icon: 'grid', color: 'bg-primary' },
  { id: 'ai-tools', name: 'Công cụ AI', name_en: 'AI Tools', icon: 'bot', color: 'from-violet-600 to-violet-500', badge: 'HOT' },
  { id: 'developer', name: 'Lập trình & Dev', name_en: 'Developer Tools', icon: 'code-2', color: 'from-blue-600 to-cyan-500' },
  { id: 'design-tools', name: 'Thiết kế & Đồ họa', name_en: 'Design Suite', icon: 'sparkles', color: 'from-pink-500 to-rose-500' },
  { id: 'business', name: 'Văn phòng & Kinh doanh', name_en: 'Business & Office', icon: 'briefcase', color: 'from-blue-600 to-blue-500' },
  { id: 'education', name: 'Học tập & Ngoại ngữ', name_en: 'Education', icon: 'graduation-cap', color: 'from-orange-500 to-amber-500' },
  { id: 'entertainment', name: 'Giải trí & Âm nhạc', name_en: 'Entertainment', icon: 'gamepad-2', color: 'from-teal-500 to-emerald-400' },
  { id: 'security', name: 'Bảo mật & VPN', name_en: 'Security & VPN', icon: 'shield-check', color: 'from-slate-700 to-slate-600' },
  { id: 'services', name: 'Dịch vụ Kỹ thuật', name_en: 'IT Services', icon: 'wrench', color: 'from-indigo-600 to-purple-600' }
];

const INITIAL_PRODUCTS = [
  {
    id: "chatgpt-plus",
    isFeatured: true,
    name: "ChatGPT Plus (GPT-4o & Sora)",
    name_en: "ChatGPT Plus (GPT-4o & Sora)",
    category: "ai-tools",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Bán Chạy",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
    originalPrice: 490000,
    price: 249000,
    rating: 4.9,
    sold: 1420,
    description: "Tài khoản ChatGPT Plus chính chủ truy cập GPT-4o, DALL-E 3, Voice Mode nâng cao và ưu tiên xử lý dữ liệu tốc độ cực nhanh.",
    description_en: "Official ChatGPT Plus personal upgrade with GPT-4o, DALL-E 3, and high speed priority access.",
    features: [
      "Sử dụng mô hình GPT-4o, GPT-4 Turbo mới nhất",
      "Tạo ảnh đỉnh cao với DALL-E 3",
      "Kích hoạt trên chính Email cá nhân của bạn",
      "Bảo hành trọn thời gian sử dụng 100%"
    ],
    variants: [
      { label: "1 Tháng", price: 249000, originalPrice: 490000 },
      { label: "3 Tháng", price: 690000, originalPrice: 1470000 },
      { label: "1 Năm", price: 2390000, originalPrice: 5880000 }
    ]
  },
  {
    id: "antigravity-ultra",
    isFeatured: true,
    name: "Antigravity Ultra - Nâng cấp chính chủ",
    name_en: "Antigravity Ultra - Official Upgrade",
    category: "ai-tools",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Cực VIP",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    originalPrice: 980000,
    price: 489000,
    rating: 5.0,
    sold: 420,
    description: "Gói nâng cấp Antigravity Ultra chính chủ cao cấp nhất. Mở khóa dung lượng 30TB và quyền truy cập ưu tiên toàn bộ các mô hình AI thế hệ mới: Google Flow, Veo.",
    description_en: "Premium Antigravity Ultra official upgrade. Unlocks 30TB storage and priority access to Google Flow, Veo, and next-gen AI tools.",
    features: [
      "Dung lượng lưu trữ 30TB dùng chung cực khủng",
      "Truy cập ưu tiên Google Flow & Veo AI mới nhất",
      "Gia hạn trực tiếp qua Google Family liên kết an toàn",
      "Bảo hành 1 đổi 1 cam kết 100%"
    ],
    variants: [
      { label: "6 Tháng", price: 489000, originalPrice: 980000 },
      { label: "1 Năm", price: 890000, originalPrice: 1900000 }
    ]
  },
  {
    id: "claude-pro",
    isFeatured: true,
    name: "Claude AI Pro (Claude 3.5 Sonnet)",
    name_en: "Claude AI Pro (Claude 3.5 Sonnet)",
    category: "ai-tools",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Khuyên Dùng",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
    originalPrice: 520000,
    price: 280000,
    rating: 5.0,
    sold: 980,
    description: "Siêu AI hỗ trợ viết code, phân tích tài liệu PDF/Excel và văn bản chuyên sâu gấp 5 lần bản miễn phí.",
    description_en: "Advanced AI assistant for coding, document analysis, and deep writing tasks.",
    features: [
      "Hỗ trợ Claude 3.5 Sonnet & Claude 3 Opus",
      "Cửa sổ ngữ cảnh khổng lồ 200,000 tokens",
      "Tải lên tệp lớn, phân tích mã nguồn cực chính xác",
      "Nâng cấp trực tiếp tài khoản Anthropic của bạn"
    ],
    variants: [
      { label: "1 Tháng", price: 280000, originalPrice: 520000 },
      { label: "6 Tháng", price: 1550000, originalPrice: 3120000 }
    ]
  },
  {
    id: "gemini-advanced",
    name: "Google Gemini Advanced (Google One AI Premium)",
    name_en: "Google Gemini Advanced (Google One AI Premium)",
    category: "ai-tools",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    originalPrice: 490000,
    price: 250000,
    rating: 4.9,
    sold: 720,
    description: "Nâng cấp tài khoản Google cá nhân truy cập mô hình Gemini 1.5 Pro siêu việt cùng 2TB bộ nhớ Google Drive.",
    description_en: "Google One AI Premium upgrade with Gemini Advanced and 2TB Drive storage.",
    features: [
      "Trực tiếp sử dụng Gemini Advanced (1.5 Pro)",
      "Bao gồm 2TB lưu trữ Drive, Photos và Gmail",
      "Tích hợp Gemini trực tiếp vào Google Docs, Slides",
      "Bảo hành trọn thời hạn đăng ký"
    ],
    variants: [
      { label: "2 Tháng", price: 250000, originalPrice: 490000 }
    ]
  },
  {
    id: "cursor-pro",
    name: "Cursor Pro - IDE AI Cho Lập Trình Viên",
    name_en: "Cursor Pro - AI Code Editor",
    category: "developer",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80",
    originalPrice: 550000,
    price: 299000,
    rating: 4.9,
    sold: 1150,
    description: "Trình biên soạn mã nguồn tích hợp AI tiên tiến nhất hiện nay, tự động sinh code và refactor codebase lớn.",
    description_en: "AI-first code editor designed for pair programming and deep code refactoring.",
    features: [
      "500 Fast Premium Requests mỗi tháng",
      "Unlimited Slow Requests",
      "Truy cập Claude 3.5 Sonnet & GPT-4o ngay trong editor",
      "Bảo hành 1 đổi 1 trong suốt thời gian dùng"
    ],
    variants: [
      { label: "1 Tháng", price: 299000, originalPrice: 550000 },
      { label: "1 Năm", price: 2900000, originalPrice: 6600000 }
    ]
  },
  {
    id: "gpm-login",
    name: "GPM Login - Phần mềm nuôi tài khoản antidetect",
    name_en: "GPM Login Antidetect Browser Key",
    category: "developer",
    type: "Bản quyền chính hãng",
    type_en: "Official License",
    badge: "Bán Chạy",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    originalPrice: 450000,
    price: 250000,
    rating: 4.9,
    sold: 620,
    description: "Phần mềm tạo trình duyệt sạch nuôi tài khoản Facebook, eBay, Amazon chống bị quét thiết bị cực tốt.",
    description_en: "Manage multiple online profiles securely, preventing browser fingerprinting.",
    features: [
      "Thay đổi vân tay trình duyệt (Canvas, WebGL, Audio...)",
      "Quản lý hàng ngàn profile độc lập",
      "Hỗ trợ proxy đa dạng (HTTP, SOCKS5)",
      "Bảo hành trọn thời hạn sử dụng"
    ],
    variants: [
      { label: "1 Tháng / 50 Profiles", price: 250000, originalPrice: 450000 },
      { label: "1 Năm / 100 Profiles", price: 1950000, originalPrice: 3500000 }
    ]
  },
  {
    id: "autodesk-all",
    name: "Autodesk All Apps - Bản Quyền Sinh Viên 1 Năm",
    name_en: "Autodesk All Apps 1 Year Student License",
    category: "developer",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Kỹ Thuật",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    originalPrice: 1200000,
    price: 350000,
    rating: 4.8,
    sold: 310,
    description: "Kích hoạt bản quyền trọn bộ Autodesk bao gồm AutoCAD, Revit, 3ds Max, Maya chính chủ 365 ngày.",
    description_en: "Official AutoCAD, Revit, 3ds Max, Maya student license for 1 Year.",
    features: [
      "Kích hoạt trực tiếp bằng Email cá nhân của bạn",
      "Tải ứng dụng chính gốc từ trang chủ Autodesk",
      "Sử dụng full tính năng của 40+ phần mềm Autodesk",
      "Bảo hành 1 đổi 1 trong 1 năm"
    ],
    variants: [
      { label: "1 Năm", price: 350000, originalPrice: 1200000 }
    ]
  },
  {
    id: "canva-pro",
    name: "Canva Pro - Nâng Cấp Email Chính Chủ",
    name_en: "Canva Pro - Personal Email Upgrade",
    category: "design-tools",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Giá Cực Tốt",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
    originalPrice: 300000,
    price: 99000,
    rating: 4.9,
    sold: 3500,
    description: "Sử dụng kho 100M+ hình ảnh, template, video Premium và tính năng tách nền AI thần kỳ.",
    description_en: "Access 100M+ premium design templates, stock photos, and AI background remover.",
    features: [
      "Nâng cấp trực tiếp trên Email cá nhân của bạn",
      "Dung lượng lưu trữ 1TB Cloud",
      "Tính năng Magic Resize, Xóa nền ảnh 1 click",
      "Bảo hành trọn thời hạn đăng ký"
    ],
    variants: [
      { label: "1 Năm", price: 99000, originalPrice: 300000 },
      { label: "Vĩnh Viễn", price: 199000, originalPrice: 1200000 }
    ]
  },
  {
    id: "adobe-full-apps",
    name: "Adobe Creative Cloud Full Apps (100GB)",
    name_en: "Adobe Creative Cloud Full Apps (100GB)",
    category: "design-tools",
    type: "Tài khoản tạo sẵn",
    type_en: "Ready Account",
    badge: "Full Bộ",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=600&q=80",
    originalPrice: 1200000,
    price: 490000,
    rating: 4.8,
    sold: 870,
    description: "Trọn bộ 20+ ứng dụng Adobe: Photoshop, Illustrator, Premiere Pro, After Effects, Lightroom với Generative Fill AI.",
    description_en: "Complete 20+ Adobe suite including Photoshop, Illustrator, Premiere Pro with Generative Fill AI.",
    features: [
      "Bao gồm Generative Fill AI Photoshop mới nhất",
      "Dung lượng Cloud Adobe 100GB",
      "Cập nhật trực tiếp qua Adobe Creative Cloud Desktop",
      "Bảo hành uy tín toàn thời gian"
    ],
    variants: [
      { label: "3 Tháng", price: 490000, originalPrice: 1200000 },
      { label: "1 Năm", price: 1490000, originalPrice: 4200000 }
    ]
  },
  {
    id: "microsoft-365",
    name: "Microsoft 365 (Office 365 + 1TB OneDrive)",
    name_en: "Microsoft 365 (Office 365 + 1TB OneDrive)",
    category: "business",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Văn Phòng",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    originalPrice: 450000,
    price: 180000,
    rating: 4.9,
    sold: 2100,
    description: "Bản quyền Word, Excel, PowerPoint, Outlook mới nhất và 1TB lưu trữ an sau trên OneDrive.",
    description_en: "Official Word, Excel, PowerPoint license with 1TB OneDrive cloud storage.",
    features: [
      "Cài đặt tối đa 5 thiết bị (PC, Mac, iOS, Android)",
      "Tặng kèm 1,000GB (1TB) OneDrive tốc độ cao",
      "Nâng cấp trên Email chính chủ của bạn",
      "Bảo hành trọn thời hạn 100%"
    ],
    variants: [
      { label: "1 Năm", price: 180000, originalPrice: 450000 },
      { label: "Lifetime (Gia hạn hàng năm)", price: 450000, originalPrice: 1500000 }
    ]
  },
  {
    id: "google-one-upgrade",
    name: "Google One Upgrade - Nâng Cấp Dung Lượng Chính Chủ",
    name_en: "Google One Storage Upgrade",
    category: "business",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Phổ Biến",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    originalPrice: 350000,
    price: 180000,
    rating: 4.9,
    sold: 1450,
    description: "Tăng dung lượng lưu trữ cho Gmail, Google Drive và Google Photos của bạn thông qua nhóm gia đình.",
    description_en: "Increase your personal Google storage for Drive, Photos and Gmail.",
    features: [
      "Nâng cấp trên chính Gmail cá nhân của bạn",
      "Đảm bảo dữ liệu riêng tư 100% không ai xem được",
      "Nhận ngay 100GB hoặc 200GB hoặc 2TB tùy chọn",
      "Bảo hành đầy đủ cam kết"
    ],
    variants: [
      { label: "100GB / 1 Năm", price: 180000, originalPrice: 350000 },
      { label: "200GB / 1 Năm", price: 290000, originalPrice: 590000 },
      { label: "2TB / 1 Năm", price: 990000, originalPrice: 2200000 }
    ]
  },
  {
    id: "quetext-pro",
    name: "Quetext Pro - Phần Mềm Check Đạo Văn Chuyên Sâu",
    name_en: "Quetext Pro - Plagiarism Checker",
    category: "business",
    type: "Tài khoản tạo sẵn",
    type_en: "Ready Account",
    badge: "Văn Bản",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    originalPrice: 250000,
    price: 140000,
    rating: 4.8,
    sold: 190,
    description: "Công cụ kiểm tra trùng lặp văn bản, đạo văn chuẩn xác chuyên sâu dành cho học sinh, sinh viên và content writer.",
    description_en: "Professional plagiarism checker and citation assistant account.",
    features: [
      "Check trùng lặp văn bản lên tới 25,000 từ / tháng",
      "Công nghệ phân tích từ đồng nghĩa Deep Search",
      "Tải về báo cáo PDF chi tiết nguồn vi phạm",
      "Bảo hành 1 đổi 1 trọn thời hạn"
    ],
    variants: [
      { label: "1 Tháng", price: 140000, originalPrice: 250000 }
    ]
  },
  {
    id: "quizlet-plus",
    name: "Quizlet Plus - Nâng Cấp Email Chính Chủ",
    name_en: "Quizlet Plus Official Upgrade",
    category: "education",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Khuyên Dùng",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
    originalPrice: 390000,
    price: 180000,
    rating: 5.0,
    sold: 1250,
    description: "Học từ vựng thông minh bằng flashcard, sơ đồ và chế độ học ngoại tuyến không quảng cáo.",
    description_en: "Learn vocabulary, languages, and study sets offline and ad-free.",
    features: [
      "Nâng cấp trực tiếp trên Email cá nhân của bạn",
      "Mở khóa chế độ học thông minh Quizlet Learn",
      "Học không quảng cáo, tải bài học xem ngoại tuyến",
      "Bảo hành trọn thời hạn 365 ngày"
    ],
    variants: [
      { label: "1 Năm", price: 180000, originalPrice: 390000 }
    ]
  },
  {
    id: "blooket-plus",
    name: "Blooket Plus Premium - Tài Khoản Học Tập",
    name_en: "Blooket Plus Premium Upgrade",
    category: "education",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Học Tập",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80",
    originalPrice: 350000,
    price: 150000,
    rating: 4.9,
    sold: 430,
    description: "Giải pháp tạo game câu hỏi tương tác thú vị cho lớp học, nâng cấp trực tiếp tài khoản giáo viên.",
    description_en: "Interactive quiz game tool for teachers and students with premium assets.",
    features: [
      "Không giới hạn số lượng học sinh tham gia chơi",
      "Mở khóa tất cả các bộ Blook độc quyền",
      "Xem báo cáo kết quả chi tiết từng học sinh",
      "Bảo hành 1 đổi 1 trọn gói"
    ],
    variants: [
      { label: "1 Năm", price: 150000, originalPrice: 350000 }
    ]
  },
  {
    id: "deeplearning-ai",
    name: "DeepLearning.AI - Nâng cấp khóa học chính chủ",
    name_en: "DeepLearning.AI Courses Access Upgrade",
    category: "education",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Chứng Chỉ AI",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    originalPrice: 1200000,
    price: 390000,
    rating: 4.9,
    sold: 140,
    description: "Mở khóa học toàn bộ các khóa đào tạo trí tuệ nhân tạo, Deep Learning chuyên sâu của Andrew Ng.",
    description_en: "Get access to Andrew Ng's premium Deep Learning AI specialization courses.",
    features: [
      "Gia hạn học trọn vẹn giáo trình và bài tập thực hành",
      "Nhận chứng chỉ chính chủ Coursera sau khi học xong",
      "Học không giới hạn thời gian trong 1 năm",
      "Bảo hành 1 đổi 1 uy tín"
    ],
    variants: [
      { label: "1 Năm", price: 390000, originalPrice: 1200000 }
    ]
  },
  {
    id: "tidal-hifi-plus",
    name: "Tidal HiFi Plus - Nghe Nhạc Lossless Chất Lượng Cao",
    name_en: "Tidal HiFi Plus Subscription Upgrade",
    category: "entertainment",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Âm Thanh 24bit",
    image: "https://images.unsplash.com/photo-1614680376593-902f749f7ec0?auto=format&fit=crop&w=600&q=80",
    originalPrice: 420000,
    price: 190000,
    rating: 4.9,
    sold: 810,
    description: "Trải nghiệm âm thanh chất lượng Master MQA 24-bit/192kHz đỉnh cao dành cho Audiophile.",
    description_en: "Lossless Master MQA audio streaming for real audiophiles.",
    features: [
      "Chất lượng âm thanh phòng thu MQA & Dolby Atmos",
      "Nghe nhạc không quảng cáo phiền phức",
      "Tải nhạc và nghe ngoại tuyến chất lượng cao",
      "Gia hạn trên chính tài khoản cá nhân của bạn"
    ],
    variants: [
      { label: "6 Tháng", price: 190000, originalPrice: 420000 },
      { label: "1 Năm", price: 350000, originalPrice: 840000 }
    ]
  },
  {
    id: "spotify-premium",
    name: "Spotify Premium Chính Chủ",
    name_en: "Spotify Premium Upgrade",
    category: "entertainment",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Âm Nhạc",
    image: "https://images.unsplash.com/photo-1614680376593-902f749f7ec0?auto=format&fit=crop&w=600&q=80",
    originalPrice: 290000,
    price: 150000,
    rating: 4.9,
    sold: 4200,
    description: "Nghe nhạc chất lượng cao Very High 320kbps, tải nhạc nghe offline và không quảng cáo.",
    description_en: "Listen to 320kbps high quality audio, offline downloads, and ad-free music.",
    features: [
      "Kích hoạt gia hạn vào Family của bạn",
      "Giữ nguyên playlist, bài hát yêu thích",
      "Tải nhạc nghe ngoại tuyến mượt mà",
      "Bảo hành 1 đổi 1 tức thì"
    ],
    variants: [
      { label: "6 Tháng", price: 150000, originalPrice: 290000 },
      { label: "1 Năm", price: 260000, originalPrice: 590000 }
    ]
  },
  {
    id: "onepassword-upgrade",
    name: "1Password Upgrade - Phần Mềm Lưu Trữ Mật Khẩu Số 1",
    name_en: "1Password Password Manager Personal Upgrade",
    category: "security",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Bảo Mật",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    originalPrice: 350000,
    price: 160000,
    rating: 5.0,
    sold: 420,
    description: "Công cụ quản lý và mã hóa mật khẩu, thẻ ngân hàng bảo mật hàng đầu hiện nay, tự động đồng bộ đa thiết bị.",
    description_en: "The world's most trusted password manager for families and individuals.",
    features: [
      "Lưu trữ không giới hạn thông tin đăng nhập, thẻ tín dụng",
      "Đồng bộ hóa an toàn trên iOS, Android, PC, Mac",
      "Tính năng cảnh báo mật khẩu yếu, rò rỉ dữ liệu Watchtower",
      "Bảo hành trọn vẹn thời hạn 1 năm"
    ],
    variants: [
      { label: "1 Năm", price: 160000, originalPrice: 350000 }
    ]
  },
  {
    id: "adguard-premium",
    name: "AdGuard Premium - Bản Quyền Chặn Quảng Cáo Trọn Đời",
    name_en: "AdGuard Premium Lifetime License Key",
    category: "security",
    type: "License Key chính hãng",
    type_en: "Official License Key",
    badge: "Chặn Ads",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    originalPrice: 650000,
    price: 250000,
    rating: 4.9,
    sold: 830,
    description: "Giải pháp loại bỏ 100% quảng cáo rác, video youtube ads trên trình duyệt và ứng dụng hệ thống.",
    description_en: "Ad blocking, privacy protection, and parental control lifetime key.",
    features: [
      "Key kích hoạt trực tiếp trên trang chủ AdGuard cá nhân",
      "Bảo hành trọn đời từ nhà cung cấp",
      "Sử dụng cho 3 thiết bị đồng thời",
      "Hỗ trợ chặn quảng cáo ứng dụng và game di động"
    ],
    variants: [
      { label: "3 Thiết bị / Trọn Đời", price: 250000, originalPrice: 650000 }
    ]
  },
  {
    id: "nordvpn-ready",
    name: "NordVPN Premium (Tài Khoản Tạo Sẵn)",
    name_en: "NordVPN Premium Ready Account",
    category: "security",
    type: "Tài khoản tạo sẵn",
    type_en: "Ready Account",
    badge: "VPN Top 1",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    originalPrice: 380000,
    price: 160000,
    rating: 4.8,
    sold: 1310,
    description: "Mạng riêng ảo ẩn IP, mã hóa dữ liệu cao cấp giúp vượt rào cản địa lý và bảo vệ khi dùng Wifi công cộng.",
    description_en: "6000+ fast VPN servers across 111 countries with Threat Protection.",
    features: [
      "6000+ máy chủ siêu tốc tại 111 quốc gia",
      "Tính năng Threat Protection chặn quảng cáo & malware",
      "Tài khoản sẵn sàng đăng nhập ngay sau thanh toán",
      "Bảo hành đầy đủ cam kết"
    ],
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium + YouTube Music (Nâng cấp chính chủ)",
    name_en: "YouTube Premium & Music Official Upgrade",
    category: "entertainment",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Bán Chạy",
    image: "https://images.unsplash.com/photo-1614680376593-902f749f7ec0?auto=format&fit=crop&w=600&q=80",
    originalPrice: 450000,
    price: 189000,
    rating: 4.9,
    sold: 2450,
    description: "Dịch vụ nâng cấp YouTube Premium chính chủ trực tiếp trên tài khoản Gmail cá nhân của bạn. Xem video không quảng cáo và nghe nhạc background chất lượng cao.",
    description_en: "Official personal YouTube Premium and YouTube Music upgrade. Ad-free videos and high quality offline music playback.",
    features: [
      "Xem YouTube hoàn toàn không có quảng cáo rác",
      "Phát nhạc nền background khi tắt màn hình di động",
      "Nâng cấp trực tiếp trên chính Gmail cá nhân của bạn",
      "Bảo hành 1 đổi 1 suốt thời gian đăng ký"
    ],
    variants: [
      { label: "6 Tháng", price: 189000, originalPrice: 450000 },
      { label: "1 Năm", price: 349000, originalPrice: 900000 }
    ]
  },
  {
    id: "github-student-pack",
    name: "GitHub Student Developer Pack (Bao gồm JetBrains)",
    name_en: "GitHub Student Developer Pack & JetBrains All Apps",
    category: "developer",
    type: "Tài khoản nâng cấp",
    type_en: "Premium Account",
    badge: "Dev Pack",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80",
    originalPrice: 800000,
    price: 250000,
    rating: 4.9,
    sold: 580,
    description: "Gói công cụ lập trình siêu khủng dành cho lập trình viên. Mở khóa toàn bộ JetBrains All Products Pack, bản quyền GitHub Copilot, và nhiều tài nguyên học tập khác.",
    description_en: "Huge developer tools bundle including JetBrains All Products Pack, GitHub Copilot access, and other resources.",
    features: [
      "Bản quyền JetBrains All Products Pack trọn bộ",
      "Đăng nhập tài khoản Github dùng Copilot miễn phí",
      "Kèm credit của AWS, DigitalOcean, Heroku",
      "Bảo hành đầy đủ cam kết 1 đổi 1"
    ],
    variants: [
      { label: "1 Năm", price: 250000, originalPrice: 800000 }
    ]
  },
  {
    id: "ide-antigravity-ultra",
    isFeatured: true,
    name: "IDE Antigravity Ultra - Nâng cấp chính chủ",
    name_en: "IDE Antigravity Ultra - Official Upgrade",
    category: "ai-tools",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Siêu VIP",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=600&q=80",
    originalPrice: 1500000,
    price: 699000,
    rating: 5.0,
    sold: 180,
    description: "Môi trường lập trình tích hợp AI Antigravity Ultra tối tân. Hỗ trợ tự động hoàn thành code, sinh test và giải quyết bugs phức tạp.",
    description_en: "Ultimate AI integrated development environment. Unlocks advanced code completion, test generation, and complex debugging.",
    features: [
      "Không giới hạn số lượng AI code completions",
      "Hỗ trợ các mô hình AI độc quyền của Antigravity",
      "Phân tích toàn bộ mã nguồn lớn (Large Codebase Context)",
      "Bảo hành trọn thời gian gia hạn 100%"
    ],
    variants: [
      { label: "1 Tháng", price: 699000, originalPrice: 1500000 },
      { label: "1 Năm", price: 6590000, originalPrice: 15000000 }
    ]
  },
  {
    id: "kling-ai-pro",
    name: "Kling AI Pro - Tài khoản tạo sẵn",
    name_en: "Kling AI Pro Premium Account",
    category: "ai-tools",
    type: "Tài khoản tạo sẵn",
    type_en: "Ready Account",
    badge: "Tạo Video AI",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80",
    originalPrice: 950000,
    price: 450000,
    rating: 4.9,
    sold: 290,
    description: "Siêu AI tạo video từ văn bản hoặc hình ảnh chất lượng cao 1080p, chuyển động vật lý cực kỳ chân thực.",
    description_en: "State of the art text-to-video AI generating photorealistic 1080p videos with dynamic physics.",
    features: [
      "Nhận ngay tài khoản Kling AI Pro có sẵn credits",
      "Xuất video không dính watermark, chất lượng cao",
      "Ưu tiên hàng đợi kết xuất video nhanh gấp 10 lần",
      "Bảo hành 1 đổi 1 trong suốt thời gian đăng ký"
    ],
    variants: [
      { label: "1 Tháng (Mức Basic)", price: 450000, originalPrice: 950000 }
    ]
  },
  {
    id: "capcut-pro",
    name: "CapCut Pro - Nâng Cấp Email Chính Chủ",
    name_en: "CapCut Pro Official Upgrade",
    category: "design-tools",
    type: "Nâng cấp chính chủ",
    type_en: "Official Upgrade",
    badge: "Dựng Video",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
    originalPrice: 300000,
    price: 129000,
    rating: 4.9,
    sold: 1850,
    description: "Mở khóa toàn bộ hiệu ứng chuyển cảnh Pro, kho nhạc bản quyền, phụ đề tự động bằng AI và bộ lọc màu điện ảnh CapCut.",
    description_en: "Unlock all Pro transitions, ad-free music, AI auto-captions, and cinematic filters.",
    features: [
      "Nâng cấp trực tiếp trên tài khoản CapCut cá nhân của bạn",
      "Dung lượng lưu trữ đám mây CapCut 100GB",
      "Đồng bộ hóa mượt mà giữa điện thoại, máy tính và web",
      "Bảo hành 1 đổi 1 uy tín"
    ],
    variants: [
      { label: "1 Tháng", price: 129000, originalPrice: 300000 },
      { label: "1 Năm", price: 490000, originalPrice: 1200000 }
    ]
  },
  {
    id: "lagofast-premium",
    name: "LagoFast Premium - Key kích hoạt giảm ping giảm lag",
    name_en: "LagoFast Premium License Key",
    category: "services",
    type: "Bản quyền chính hãng",
    type_en: "Official License",
    badge: "Gaming",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
    originalPrice: 250000,
    price: 135000,
    rating: 4.9,
    sold: 740,
    description: "Phần mềm giảm ping, tối ưu hóa đường truyền internet chuyên dụng cho game thủ, khắc phục đứt cáp và giảm packet loss.",
    description_en: "Game booster and network optimizer to reduce ping and packet loss.",
    features: [
      "Hỗ trợ giảm lag cho 1000+ tựa game phổ biến (LOL, CS2, Valorant...)",
      "Key kích hoạt trực tiếp vào tài khoản LagoFast cá nhân",
      "Tối ưu hóa tài nguyên phần cứng máy tính (FPS Boost)",
      "Bảo hành trọn thời hạn sử dụng"
    ],
    variants: [
      { label: "1 Tháng / Không giới hạn giờ", price: 135000, originalPrice: 250000 }
    ]
  }
];

// Default Flash Sale Setup
const DEFAULT_FLASH_SALE = {
  endTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
  products: [
    { id: "chatgpt-plus", flashPrice: 179000, limitQty: 30, soldQty: 18 },
    { id: "canva-pro", flashPrice: 49000, limitQty: 50, soldQty: 41 },
    { id: "quizlet-plus", flashPrice: 120000, limitQty: 25, soldQty: 16 }
  ]
};

// Default Branding / Layout Configs (Fully configurable in Admin panel)
const DEFAULT_SETTINGS = {
  logoText: "TAGKI",
  hotline: "+84 908687510",
  facebook: "https://www.facebook.com/tagki686868",
  telegram: "https://t.me/tagki6868",
  whatsapp: "https://wa.me/84839888823",
  twitter: "https://x.com/tagki6868",
  zalo: "https://zalo.me/0839888823"
};

function getStoredProducts() {
  const localData = localStorage.getItem('tagki_products');
  if (localData) {
    try {
      return JSON.parse(localData);
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_PRODUCTS;
}

function saveStoredProducts(productsList) {
  localStorage.setItem('tagki_products', JSON.stringify(productsList));
  STORE_DATA.products = productsList;
}

function getStoredCategories() {
  const localCats = localStorage.getItem('tagki_categories');
  if (localCats) {
    try {
      return JSON.parse(localCats);
    } catch (e) {
      console.error(e);
    }
  }
  return INITIAL_CATEGORIES;
}

function saveStoredCategories(catList) {
  localStorage.setItem('tagki_categories', JSON.stringify(catList));
  STORE_DATA.categories = catList;
}

function getStoredFlashSale() {
  const localFS = localStorage.getItem('tagki_flash_sale');
  if (localFS) {
    try {
      return JSON.parse(localFS);
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_FLASH_SALE;
}

function saveStoredFlashSale(fsData) {
  localStorage.setItem('tagki_flash_sale', JSON.stringify(fsData));
  STORE_DATA.flashSale = fsData;
}

function getStoredSettings() {
  const localSettings = localStorage.getItem('tagki_settings');
  if (localSettings) {
    try {
      return JSON.parse(localSettings);
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_SETTINGS;
}

function saveStoredSettings(settingsData) {
  localStorage.setItem('tagki_settings', JSON.stringify(settingsData));
  STORE_DATA.settings = settingsData;
}

const DEFAULT_BANNERS = [
  {
    id: 1,
    title: "Flash Sale Công Nghệ 2026",
    subtitle: "Tài khoản AI Premium & Key Bản Quyền Giảm Giá Đến 70%",
    image: "https://images.unsplash.com/photo-1618005198143-e5283b519a7f?auto=format&fit=crop&w=1200&q=80",
    link: "#ai-tools",
    btnText: "Khám Phá Ngay"
  },
  {
    id: 2,
    title: "Hệ Sinh Thái AI Đỉnh Cao",
    subtitle: "ChatGPT Plus, Claude Pro, Cursor Ultra, Antigravity Pro kích hoạt chính chủ",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    link: "#ai-tools",
    btnText: "Nâng Cấp Ngay"
  }
];

function getStoredBanners() {
  const localBanners = localStorage.getItem('tagki_banners');
  if (localBanners) {
    try {
      const parsed = JSON.parse(localBanners);
      // Migration: force reset to green banners if old purple fluid banner is present
      const hasOldPurple = parsed.some(b => b.image && b.image.includes('photo-1618005182384-a83a8bd57fbe'));
      if (hasOldPurple) {
        localStorage.setItem('tagki_banners', JSON.stringify(DEFAULT_BANNERS));
        return DEFAULT_BANNERS;
      }
      return parsed;
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_BANNERS;
}

function saveStoredBanners(bannersData) {
  localStorage.setItem('tagki_banners', JSON.stringify(bannersData));
  if (typeof STORE_DATA !== 'undefined') {
    STORE_DATA.banners = bannersData;
  }
}

const STORE_DATA = {
  categories: getStoredCategories(),
  products: getStoredProducts(),
  flashSale: getStoredFlashSale(),
  settings: getStoredSettings(),
  banners: getStoredBanners(),

  promotions: [
    { code: "EMPIRE2026", discount: "10%", minOrder: 200000, note: "Giảm 10% cho đơn từ 200K" },
    { code: "WELCOME50K", discount: "50.000đ", minOrder: 500000, note: "Giảm 50K cho đơn hàng đầu tiên từ 500K" }
  ]
};

// Listen for storage changes across tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'tagki_products') {
    STORE_DATA.products = getStoredProducts();
    if (typeof renderProducts === 'function') renderProducts();
    if (typeof renderFeaturedProducts === 'function') renderFeaturedProducts();
  }
  if (e.key === 'tagki_categories') {
    STORE_DATA.categories = getStoredCategories();
    if (typeof renderCategories === 'function') renderCategories();
  }
  if (e.key === 'tagki_flash_sale') {
    STORE_DATA.flashSale = getStoredFlashSale();
    if (typeof renderFlashSale === 'function') renderFlashSale();
  }
  if (e.key === 'tagki_settings') {
    STORE_DATA.settings = getStoredSettings();
    if (typeof applySettingsToUI === 'function') applySettingsToUI();
  }
  if (e.key === 'tagki_banners') {
    STORE_DATA.banners = getStoredBanners();
    if (typeof initCarousel === 'function') initCarousel();
  }
});
