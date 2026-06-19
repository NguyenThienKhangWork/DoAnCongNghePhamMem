// 63 tỉnh thành Việt Nam - value khớp với DB
export const CITIES = [
  // Miền Bắc - Đồng bằng sông Hồng
  { label: 'Hà Nội',           value: 'Ha Noi',        region: 'Miền Bắc' },
  { label: 'Hải Phòng',        value: 'Hai Phong',     region: 'Miền Bắc' },
  { label: 'Quảng Ninh',       value: 'Quang Ninh',    region: 'Miền Bắc' },
  { label: 'Bắc Ninh',         value: 'Bac Ninh',      region: 'Miền Bắc' },
  { label: 'Hưng Yên',         value: 'Hung Yen',      region: 'Miền Bắc' },
  { label: 'Hải Dương',        value: 'Hai Duong',     region: 'Miền Bắc' },
  { label: 'Vĩnh Phúc',        value: 'Vinh Phuc',     region: 'Miền Bắc' },
  { label: 'Hà Nam',           value: 'Ha Nam',         region: 'Miền Bắc' },
  { label: 'Nam Định',         value: 'Nam Dinh',      region: 'Miền Bắc' },
  { label: 'Thái Bình',        value: 'Thai Binh',     region: 'Miền Bắc' },
  { label: 'Ninh Bình',        value: 'Ninh Binh',     region: 'Miền Bắc' },
  // Miền Bắc - Trung du & miền núi phía Bắc
  { label: 'Thái Nguyên',      value: 'Thai Nguyen',   region: 'Miền Bắc' },
  { label: 'Bắc Giang',        value: 'Bac Giang',     region: 'Miền Bắc' },
  { label: 'Bắc Kạn',          value: 'Bac Kan',       region: 'Miền Bắc' },
  { label: 'Cao Bằng',         value: 'Cao Bang',      region: 'Miền Bắc' },
  { label: 'Lạng Sơn',         value: 'Lang Son',      region: 'Miền Bắc' },
  { label: 'Hòa Bình',         value: 'Hoa Binh',      region: 'Miền Bắc' },
  { label: 'Phú Thọ',          value: 'Phu Tho',       region: 'Miền Bắc' },
  { label: 'Tuyên Quang',      value: 'Tuyen Quang',   region: 'Miền Bắc' },
  { label: 'Yên Bái',          value: 'Yen Bai',       region: 'Miền Bắc' },
  { label: 'Lào Cai',          value: 'Lao Cai',       region: 'Miền Bắc' },
  { label: 'Hà Giang',         value: 'Ha Giang',      region: 'Miền Bắc' },
  { label: 'Sơn La',           value: 'Son La',        region: 'Miền Bắc' },
  { label: 'Lai Châu',         value: 'Lai Chau',      region: 'Miền Bắc' },
  { label: 'Điện Biên',        value: 'Dien Bien',     region: 'Miền Bắc' },
  { label: 'Hạ Long',          value: 'Ha Long',       region: 'Miền Bắc' },
  { label: 'Sa Pa',             value: 'Sa Pa',         region: 'Miền Bắc' },
  // Miền Trung - Bắc Trung Bộ
  { label: 'Thanh Hóa',        value: 'Thanh Hoa',     region: 'Miền Trung' },
  { label: 'Nghệ An',          value: 'Nghe An',       region: 'Miền Trung' },
  { label: 'Hà Tĩnh',          value: 'Ha Tinh',       region: 'Miền Trung' },
  { label: 'Quảng Bình',       value: 'Quang Binh',    region: 'Miền Trung' },
  { label: 'Quảng Trị',        value: 'Quang Tri',     region: 'Miền Trung' },
  { label: 'Huế',              value: 'Hue',           region: 'Miền Trung' },
  // Miền Trung - Nam Trung Bộ
  { label: 'Đà Nẵng',          value: 'Da Nang',       region: 'Miền Trung' },
  { label: 'Hội An',           value: 'Hoi An',        region: 'Miền Trung' },
  { label: 'Quảng Nam',        value: 'Quang Nam',     region: 'Miền Trung' },
  { label: 'Quảng Ngãi',       value: 'Quang Ngai',    region: 'Miền Trung' },
  { label: 'Bình Định',        value: 'Binh Dinh',     region: 'Miền Trung' },
  { label: 'Quy Nhơn',         value: 'Quy Nhon',      region: 'Miền Trung' },
  { label: 'Phú Yên',          value: 'Phu Yen',       region: 'Miền Trung' },
  { label: 'Khánh Hòa',        value: 'Khanh Hoa',     region: 'Miền Trung' },
  { label: 'Nha Trang',        value: 'Nha Trang',     region: 'Miền Trung' },
  { label: 'Ninh Thuận',       value: 'Ninh Thuan',    region: 'Miền Trung' },
  { label: 'Bình Thuận',       value: 'Binh Thuan',    region: 'Miền Trung' },
  { label: 'Phan Thiết',       value: 'Phan Thiet',    region: 'Miền Trung' },
  // Tây Nguyên
  { label: 'Đà Lạt',           value: 'Da Lat',        region: 'Tây Nguyên' },
  { label: 'Lâm Đồng',         value: 'Lam Dong',      region: 'Tây Nguyên' },
  { label: 'Đắk Lắk',          value: 'Dak Lak',       region: 'Tây Nguyên' },
  { label: 'Đắk Nông',         value: 'Dak Nong',      region: 'Tây Nguyên' },
  { label: 'Gia Lai',          value: 'Gia Lai',       region: 'Tây Nguyên' },
  { label: 'Kon Tum',          value: 'Kon Tum',       region: 'Tây Nguyên' },
  // Miền Nam - Đông Nam Bộ
  { label: 'TP. Hồ Chí Minh',  value: 'TP. Ho Chi Minh', region: 'Miền Nam' },
  { label: 'Bình Dương',       value: 'Binh Duong',    region: 'Miền Nam' },
  { label: 'Đồng Nai',         value: 'Dong Nai',      region: 'Miền Nam' },
  { label: 'Bà Rịa - Vũng Tàu',value: 'Ba Ria - Vung Tau', region: 'Miền Nam' },
  { label: 'Vũng Tàu',         value: 'Vung Tau',      region: 'Miền Nam' },
  { label: 'Tây Ninh',         value: 'Tay Ninh',      region: 'Miền Nam' },
  { label: 'Bình Phước',       value: 'Binh Phuoc',    region: 'Miền Nam' },
  { label: 'Long An',          value: 'Long An',       region: 'Miền Nam' },
  // Miền Nam - Đồng bằng sông Cửu Long
  { label: 'Tiền Giang',       value: 'Tien Giang',    region: 'Miền Nam' },
  { label: 'Bến Tre',          value: 'Ben Tre',       region: 'Miền Nam' },
  { label: 'Đồng Tháp',        value: 'Dong Thap',     region: 'Miền Nam' },
  { label: 'Vĩnh Long',        value: 'Vinh Long',     region: 'Miền Nam' },
  { label: 'Trà Vinh',         value: 'Tra Vinh',      region: 'Miền Nam' },
  { label: 'An Giang',         value: 'An Giang',      region: 'Miền Nam' },
  { label: 'Cần Thơ',          value: 'Can Tho',       region: 'Miền Nam' },
  { label: 'Hậu Giang',        value: 'Hau Giang',     region: 'Miền Nam' },
  { label: 'Sóc Trăng',        value: 'Soc Trang',     region: 'Miền Nam' },
  { label: 'Bạc Liêu',         value: 'Bac Lieu',      region: 'Miền Nam' },
  { label: 'Cà Mau',           value: 'Ca Mau',        region: 'Miền Nam' },
  { label: 'Kiên Giang',       value: 'Kien Giang',    region: 'Miền Nam' },
]

// Grouped by region for display
export const CITIES_BY_REGION = CITIES.reduce((acc, city) => {
  if (!acc[city.region]) acc[city.region] = []
  acc[city.region].push(city)
  return acc
}, {})

export const getCityLabel = (value) =>
  CITIES.find(c => c.value === value)?.label || value
