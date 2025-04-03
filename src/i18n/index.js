import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    nav: {
      home: 'Home',
      events: 'Events Calendar',
      travel: 'Travel Guide',
      help: 'Help Center',
      about: 'About Us'
    },
    hero: {
      title: 'Explore Melbourne',
      subtitle: 'with confidence',
      description: 'Find community events and get travel guidance in your own language',
      browseEvents: 'Browse Events',
      findRoute: 'Find My Route'
    },
    features: {
      title: 'Core Features',
      subtitle: 'Everything you need',
      events: {
        title: 'View Local Events',
        description: 'Discover community events near you'
      },
      travel: {
        title: 'Get Step-by-Step Travel Guide',
        description: 'Detailed directions in your language'
      },
      pdf: {
        title: 'Download Printable PDF Guide',
        description: 'Take your guide with you offline'
      },
      audio: {
        title: 'Listen to Audio Guides',
        description: 'Audio instructions for easy navigation'
      }
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'Simple 3-Step Process',
      step1: {
        title: 'Select Event',
        description: 'Choose from local community events'
      },
      step2: {
        title: 'Get Directions',
        description: 'Receive detailed travel instructions'
      },
      step3: {
        title: 'Go Explore',
        description: 'Enjoy your community event'
      }
    },
    testimonials: {
      title: 'User Stories',
      liMei: {
        quote: 'Thanks to this platform, I can now go to the community center by myself!'
      }
    },
    footer: {
      quickLinks: 'Quick Links',
      privacy: 'Privacy Policy',
      contact: 'Contact Us',
      help: 'Help Center',
      support: 'Support',
      hotline: 'Hotline: 1300 123 456',
      email: 'Email: support[at]example.com',
      accessibility: 'Accessibility',
      increaseText: 'Increase Text Size',
      highContrast: 'High Contrast Mode',
      copyright: '© 2024 Melbourne Community Guide. All rights reserved.'
    },
    events: {
      title: 'Event Calendar',
      subtitle: 'Browse activities in your own language and plan your day',
      organizer: 'The Production Company',
      navigation: {
        whatsOn: 'What\'s On'
      },
      filters: {
        title: 'Filter results',
        category: 'Category',
        location: 'Location',
        language: 'Language',
        all: 'All',
        eventType: 'By Event Type',
        venue: 'By venue',
        price: 'By price',
        audience: 'By audience',
        allEvents: 'All Events',
        allVenues: 'All venues',
        allPrices: 'All prices',
        allAudience: 'All Audience',
        apply: 'Apply filters'
      },
      calendar: {
        previous: 'Previous Month',
        next: 'Next Month',
        sun: 'Sun',
        mon: 'Mon',
        tue: 'Tue',
        wed: 'Wed',
        thu: 'Thu',
        fri: 'Fri',
        sat: 'Sat',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December'
      },
      selectedDate: 'Events for Selected Date',
      viewDetails: 'View Details',
      bookTickets: 'Book tickets',
      moreInfo: 'More info',
      downloadPDF: 'Download Event Info as PDF',
      getTravelGuide: 'Get Travel Guide',
      eventsFound: 'events found',
      clearFilters: 'Clear filters',
      noEvents: 'No events found',
      tryOtherDate: 'Try selecting another date or clearing filters'
    },
    culturalEvents: {
      chineseHealthTalk: 'Chinese Health Talk',
      taiChiClass: 'Tai Chi Class for Elderly',
      employmentWorkshop: 'Migrant Employment Workshop',
      vietnameseCooking: 'Vietnamese Cooking Class',
      indianDance: 'Traditional Indian Dance Performance',
      chineseMusic: 'Traditional Chinese Music Performance',
      digitalLiteracy: 'Digital Literacy Workshop for Seniors',
      culturalExchange: 'Cultural Exchange Meet-up'
    }
  },
  zh: {
    nav: {
      home: '首页',
      events: '活动日历',
      travel: '出行指南',
      help: '帮助中心',
      about: '关于我们'
    },
    hero: {
      title: '探索墨尔本',
      subtitle: '充满信心',
      description: '以您的母语查找社区活动和获取出行指导',
      browseEvents: '浏览活动',
      findRoute: '查找路线'
    },
    features: {
      title: '核心功能',
      subtitle: '您需要的一切',
      events: {
        title: '查看本地活动',
        description: '发现您附近的社区活动'
      },
      travel: {
        title: '获取详细出行指南',
        description: '使用您的语言获取详细指引'
      },
      pdf: {
        title: '下载可打印PDF指南',
        description: '离线随身携带您的指南'
      },
      audio: {
        title: '收听语音指南',
        description: '语音导航，轻松出行'
      }
    },
    howItWorks: {
      title: '使用方式',
      subtitle: '简单的三步流程',
      step1: {
        title: '选择活动',
        description: '从本地社区活动中选择'
      },
      step2: {
        title: '获取指引',
        description: '接收详细的出行指引'
      },
      step3: {
        title: '开始探索',
        description: '享受您的社区活动'
      }
    },
    testimonials: {
      title: '用户故事',
      liMei: {
        quote: '多亏了这个平台，我现在可以独自去社区中心了！'
      }
    },
    footer: {
      quickLinks: '快速链接',
      privacy: '隐私政策',
      contact: '联系我们',
      help: '帮助中心',
      support: '支持服务',
      hotline: '热线电话：1300 123 456',
      email: '电子邮件：support[at]example.com',
      accessibility: '无障碍功能',
      increaseText: '增大文字',
      highContrast: '高对比度模式',
      copyright: '© 2024 墨尔本社区指南。保留所有权利。'
    },
    events: {
      title: '活动日历',
      subtitle: '用您熟悉的语言浏览活动并规划您的日程',
      organizer: '制作公司',
      navigation: {
        whatsOn: '正在进行'
      },
      filters: {
        title: '筛选结果',
        category: '类别',
        location: '地点',
        language: '语言',
        all: '全部',
        eventType: '按活动类型',
        venue: '按场地',
        price: '按价格',
        audience: '按观众',
        allEvents: '所有活动',
        allVenues: '所有场地',
        allPrices: '所有价格',
        allAudience: '所有观众',
        apply: '应用筛选'
      },
      calendar: {
        previous: '上个月',
        next: '下个月',
        sun: '日',
        mon: '一',
        tue: '二',
        wed: '三',
        thu: '四',
        fri: '五',
        sat: '六',
        april: '四月',
        may: '五月',
        june: '六月',
        july: '七月',
        august: '八月',
        september: '九月',
        october: '十月',
        november: '十一月',
        december: '十二月'
      },
      selectedDate: '选定日期的活动',
      viewDetails: '查看详情',
      bookTickets: '预订门票',
      moreInfo: '更多信息',
      downloadPDF: '下载活动信息PDF',
      getTravelGuide: '获取出行指南',
      eventsFound: '个活动',
      clearFilters: '清除筛选',
      noEvents: '未找到活动',
      tryOtherDate: '尝试选择其他日期或清除筛选条件'
    },
    culturalEvents: {
      chineseHealthTalk: '中文健康讲座',
      taiChiClass: '老年人太极班',
      employmentWorkshop: '移民就业指导会',
      vietnameseCooking: '越南烹饪课程',
      indianDance: '印度传统舞蹈表演',
      chineseMusic: '中国传统音乐表演',
      digitalLiteracy: '老年人数字素养工作坊',
      culturalExchange: '文化交流聚会'
    }
  },
  vi: {
    nav: {
      home: 'Trang chủ',
      events: 'Lịch sự kiện',
      travel: 'Hướng dẫn đi lại',
      help: 'Trung tâm hỗ trợ',
      about: 'Về chúng tôi'
    },
    hero: {
      title: 'Khám phá Melbourne',
      subtitle: 'với sự tự tin',
      description: 'Tìm sự kiện cộng đồng và nhận hướng dẫn đi lại bằng ngôn ngữ của bạn',
      browseEvents: 'Xem sự kiện',
      findRoute: 'Tìm đường đi'
    },
    features: {
      title: 'Tính năng chính',
      subtitle: 'Tất cả những gì bạn cần',
      events: {
        title: 'Xem sự kiện địa phương',
        description: 'Khám phá sự kiện cộng đồng gần bạn'
      },
      travel: {
        title: 'Nhận hướng dẫn đi lại từng bước',
        description: 'Hướng dẫn chi tiết bằng ngôn ngữ của bạn'
      },
      pdf: {
        title: 'Tải hướng dẫn PDF có thể in',
        description: 'Mang hướng dẫn theo khi ngoại tuyến'
      },
      audio: {
        title: 'Nghe hướng dẫn âm thanh',
        description: 'Hướng dẫn âm thanh để dễ dàng điều hướng'
      }
    },
    howItWorks: {
      title: 'Cách hoạt động',
      subtitle: 'Quy trình 3 bước đơn giản',
      step1: {
        title: 'Chọn sự kiện',
        description: 'Chọn từ các sự kiện cộng đồng địa phương'
      },
      step2: {
        title: 'Nhận hướng dẫn',
        description: 'Nhận hướng dẫn đi lại chi tiết'
      },
      step3: {
        title: 'Khám phá',
        description: 'Tận hưởng sự kiện cộng đồng của bạn'
      }
    },
    testimonials: {
      title: 'Câu chuyện người dùng',
      liMei: {
        quote: 'Nhờ nền tảng này, tôi có thể tự mình đến trung tâm cộng đồng!'
      }
    },
    footer: {
      quickLinks: 'Liên kết nhanh',
      privacy: 'Chính sách bảo mật',
      contact: 'Liên hệ',
      help: 'Trung tâm hỗ trợ',
      support: 'Hỗ trợ',
      hotline: 'Đường dây nóng: 1300 123 456',
      email: 'Email: support[at]example.com',
      accessibility: 'Tính năng trợ năng',
      increaseText: 'Tăng kích thước chữ',
      highContrast: 'Chế độ tương phản cao',
      copyright: '© 2024 Hướng dẫn cộng đồng Melbourne. Đã đăng ký bản quyền.'
    },
    events: {
      title: 'Lịch sự kiện',
      subtitle: 'Duyệt các hoạt động bằng ngôn ngữ của bạn và lên kế hoạch cho ngày của bạn',
      organizer: 'Công ty sản xuất',
      navigation: {
        whatsOn: 'Sự kiện đang diễn ra'
      },
      filters: {
        title: 'Lọc kết quả',
        category: 'Danh mục',
        location: 'Địa điểm',
        language: 'Ngôn ngữ',
        all: 'Tất cả',
        eventType: 'Theo loại sự kiện',
        venue: 'Theo địa điểm',
        price: 'Theo giá',
        audience: 'Theo khán giả',
        allEvents: 'Tất cả sự kiện',
        allVenues: 'Tất cả địa điểm',
        allPrices: 'Tất cả giá',
        allAudience: 'Tất cả khán giả',
        apply: 'Áp dụng bộ lọc'
      },
      calendar: {
        previous: 'Tháng trước',
        next: 'Tháng sau',
        sun: 'CN',
        mon: 'T2',
        tue: 'T3',
        wed: 'T4',
        thu: 'T5',
        fri: 'T6',
        sat: 'T7',
        april: 'Tháng 4',
        may: 'Tháng 5',
        june: 'Tháng 6',
        july: 'Tháng 7',
        august: 'Tháng 8',
        september: 'Tháng 9',
        october: 'Tháng 10',
        november: 'Tháng 11',
        december: 'Tháng 12'
      },
      selectedDate: 'Sự kiện cho ngày đã chọn',
      viewDetails: 'Xem chi tiết',
      bookTickets: 'Đặt vé',
      moreInfo: 'Thêm thông tin',
      downloadPDF: 'Tải thông tin sự kiện dạng PDF',
      getTravelGuide: 'Lấy hướng dẫn du lịch',
      eventsFound: 'sự kiện được tìm thấy',
      clearFilters: 'Xóa bộ lọc',
      noEvents: 'Không tìm thấy sự kiện',
      tryOtherDate: 'Thử chọn ngày khác hoặc xóa bộ lọc'
    },
    culturalEvents: {
      chineseHealthTalk: 'Hội thảo sức khỏe tiếng Trung',
      taiChiClass: 'Lớp Thái Cực Quyền cho người cao tuổi',
      employmentWorkshop: 'Hội thảo hướng dẫn việc làm cho người nhập cư',
      vietnameseCooking: 'Lớp nấu ăn Việt Nam',
      indianDance: 'Biểu diễn múa truyền thống Ấn Độ',
      chineseMusic: 'Biểu diễn âm nhạc truyền thống Trung Quốc',
      digitalLiteracy: 'Hội thảo kỹ năng số cho người cao tuổi',
      culturalExchange: 'Gặp gỡ giao lưu văn hóa'
    }
  },
  hi: {
    nav: {
      home: 'होम',
      events: 'इवेंट कैलेंडर',
      travel: 'यात्रा गाइड',
      help: 'सहायता केंद्र',
      about: 'हमारे बारे में'
    },
    hero: {
      title: 'मेलबर्न की खोज',
      subtitle: 'आत्मविश्वास के साथ',
      description: 'अपनी भाषा में सामुदायिक कार्यक्रम खोजें और यात्रा मार्गदर्शन प्राप्त करें',
      browseEvents: 'कार्यक्रम ब्राउज़ करें',
      findRoute: 'मेरा मार्ग खोजें'
    },
    features: {
      title: 'मुख्य सुविधाएं',
      subtitle: 'आपको जो कुछ चाहिए',
      events: {
        title: 'स्थानीय कार्यक्रम देखें',
        description: 'अपने आस-पास के सामुदायिक कार्यक्रम खोजें'
      },
      travel: {
        title: 'चरण-दर-चरण यात्रा गाइड प्राप्त करें',
        description: 'आपकी भाषा में विस्तृत निर्देश'
      },
      pdf: {
        title: 'प्रिंट करने योग्य PDF गाइड डाउनलोड करें',
        description: 'ऑफ़लाइन अपने गाइड को साथ ले जाएं'
      },
      audio: {
        title: 'ऑडियो गाइड सुनें',
        description: 'आसान नेविगेशन के लिए ऑडियो निर्देश'
      }
    },
    howItWorks: {
      title: 'यह कैसे काम करता है',
      subtitle: 'सरल 3-चरण प्रक्रिया',
      step1: {
        title: 'कार्यक्रम चुनें',
        description: 'स्थानीय सामुदायिक कार्यक्रमों से चुनें'
      },
      step2: {
        title: 'निर्देश प्राप्त करें',
        description: 'विस्तृत यात्रा निर्देश प्राप्त करें'
      },
      step3: {
        title: 'खोज शुरू करें',
        description: 'अपने सामुदायिक कार्यक्रम का आनंद लें'
      }
    },
    testimonials: {
      title: 'उपयोगकर्ता कहानियां',
      liMei: {
        quote: 'इस प्लेटफॉर्म की बदौलत, अब मैं स्वयं सामुदायिक केंद्र जा सकती हूं!'
      }
    },
    footer: {
      quickLinks: 'त्वरित लिंक',
      privacy: 'गोपनीयता नीति',
      contact: 'संपर्क करें',
      help: 'सहायता केंद्र',
      support: 'सहायता',
      hotline: 'हॉटलाइन: 1300 123 456',
      email: 'ईमेल: support[at]example.com',
      accessibility: 'सुलभता',
      increaseText: 'पाठ आकार बढ़ाएं',
      highContrast: 'उच्च कंट्रास्ट मोड',
      copyright: '© 2024 मेलबर्न सामुदायिक गाइड। सर्वाधिकार सुरक्षित।'
    },
    events: {
      title: 'कार्यक्रम कैलेंडर',
      subtitle: 'अपनी भाषा में गतिविधियां ब्राउज़ करें और अपने दिन की योजना बनाएं',
      organizer: 'उत्पादन कंपनी',
      navigation: {
        whatsOn: 'चल रहा है'
      },
      filters: {
        title: 'परिणाम फ़िल्टर करें',
        category: 'श्रेणी',
        location: 'स्थान',
        language: 'भाषा',
        all: 'सभी',
        eventType: 'कार्यक्रम प्रकार द्वारा',
        venue: 'स्थान द्वारा',
        price: 'मूल्य द्वारा',
        audience: 'दर्शकों द्वारा',
        allEvents: 'सभी कार्यक्रम',
        allVenues: 'सभी स्थान',
        allPrices: 'सभी मूल्य',
        allAudience: 'सभी दर्शक',
        apply: 'फ़िल्टर लागू करें'
      },
      calendar: {
        previous: 'पिछला महीना',
        next: 'अगला महीना',
        sun: 'रवि',
        mon: 'सोम',
        tue: 'मंगल',
        wed: 'बुध',
        thu: 'गुरु',
        fri: 'शुक्र',
        sat: 'शनि',
        april: 'अप्रैल',
        may: 'मई',
        june: 'जून',
        july: 'जुलाई',
        august: 'अगस्त',
        september: 'सितंबर',
        october: 'अक्टूबर',
        november: 'नवंबर',
        december: 'दिसंबर'
      },
      selectedDate: 'चयनित तिथि के कार्यक्रम',
      viewDetails: 'विवरण देखें',
      bookTickets: 'टिकट बुक करें',
      moreInfo: 'अधिक जानकारी',
      downloadPDF: 'कार्यक्रम जानकारी PDF डाउनलोड करें',
      getTravelGuide: 'यात्रा गाइड प्राप्त करें',
      eventsFound: 'कार्यक्रम मिले',
      clearFilters: 'फ़िल्टर साफ़ करें',
      noEvents: 'कोई कार्यक्रम नहीं मिला',
      tryOtherDate: 'कृपया दूसरी तिथि चुनें या फ़िल्टर साफ़ करें'
    },
    culturalEvents: {
      chineseHealthTalk: 'चीनी स्वास्थ्य वार्ता',
      taiChiClass: 'बुजुर्गों के लिए ताई ची कक्षा',
      employmentWorkshop: 'प्रवासियों के लिए रोजगार मार्गदर्शन कार्यशाला',
      vietnameseCooking: 'वियतनामी पाकशाला',
      indianDance: 'भारतीय पारंपरिक नृत्य प्रदर्शन',
      chineseMusic: 'चीनी पारंपरिक संगीत प्रदर्शन',
      digitalLiteracy: 'बुजुर्गों के लिए डिजिटल साक्षरता कार्यशाला',
      culturalExchange: 'सांस्कृतिक आदान-प्रदान मिलन'
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages
}) 