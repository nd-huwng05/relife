// Static copy that will later come from Firestore `config` or a CMS.

export const FAQ = [
  {
    q: "Nếu tôi không đến lấy thì sao?",
    a: "Túi được giữ đến hết khung giờ nhận. Sau đó tiệm có thể bán hoặc tặng túi, và đơn không được hoàn tiền vì bánh đã chuẩn bị riêng cho bạn.",
  },
  {
    q: "Trong túi bất ngờ có gì?",
    a: "Tiệm chọn từ các loại bánh còn lại trong ngày. Giá trị túi luôn cao hơn số tiền bạn trả, thường gấp 3 lần.",
  },
  {
    q: "Tôi có thể huỷ đơn đến khi nào?",
    a: "Huỷ trước 18:00 được hoàn 100%. Sau 18:00 tiệm đã chuẩn bị bánh nên không hoàn tiền.",
  },
  {
    q: "Bao lâu thì được hoàn tiền?",
    a: "Tiền hoàn về tài khoản đã thanh toán trong 1 đến 3 ngày làm việc.",
  },
  {
    q: "Tôi bị dị ứng, cần lưu ý gì?",
    a: "Mỗi túi ghi các chất có thể có. Vì nội dung là bất ngờ, nếu dị ứng nặng hãy hỏi tiệm trước khi đặt.",
  },
];

export const LEGAL_DOCS = [
  { title: "Điều khoản sử dụng", updated: "01/09/2026", url: "https://relife.vn/terms" },
  { title: "Chính sách quyền riêng tư", updated: "01/09/2026", url: "https://relife.vn/privacy" },
  { title: "Chính sách hoàn tiền", updated: "01/09/2026", url: "https://relife.vn/refund" },
];

export const APP_VERSION_LABEL = "Relife v1.0.0 (build 42)";

export const ONBOARDING_SLIDES = [
  {
    photo: "croissant",
    title: "Bánh ngon gần bạn,\ngiá chỉ bằng một phần",
    body: "Những mẻ bánh còn tươi cuối ngày từ các tiệm quanh bạn, thay vì bị bỏ đi.",
    chip: { icon: "nav", label: "0,8 km · Maison Bơ Sữa" },
    price: { amount: 59000, value: 180000 },
  },
  {
    photo: "bakery-counter",
    title: "Tự đến lấy,\nđúng khung giờ hẹn",
    body: "Relife không giao hàng. Bạn ghé tiệm trong khung giờ đã đặt và đưa mã nhận bánh.",
    chip: { icon: "clock", label: "Nhận hôm nay 19:00 – 20:30" },
    price: null,
  },
  {
    photo: "bread-bag",
    title: "Mỗi túi bánh là một\nbữa ăn được cứu",
    body: "Cùng hàng nghìn người Hà Nội giảm lãng phí thực phẩm, mỗi tối một chút.",
    chip: { icon: "heart", label: "12.480 túi đã được giải cứu" },
    price: null,
  },
] as const;

export const STORE_GUIDES = [
  { icon: "check", title: "Đăng túi bánh đầu tiên", minutes: 2 },
  { icon: "file", title: "Quét mã khi khách đến", minutes: 1 },
  { icon: "file", title: "Relife trả tiền như thế nào", minutes: 2 },
] as const;

export const TRAINING_CARDS = [
  {
    icon: "package",
    title: "Đăng túi trước giờ cao điểm",
    body: "Vào tab Túi bánh, chọn Đăng lại như hôm qua hoặc tạo túi mới. Đăng trước 18:30 để khách kịp thấy.",
  },
  {
    icon: "camera",
    title: "Khách đến, bạn quét mã",
    body: "Mở tab Quét mã, hướng camera vào QR trên điện thoại khách. Màn xanh lá là đưa bánh, màn đỏ là đọc câu gợi ý cho khách.",
  },
  {
    icon: "alert",
    title: "Khách không đến",
    body: "Sau 15 phút ân hạn, bạn có thể đánh dấu khách không đến. Tiệm vẫn nhận đủ tiền và có thể bán lại túi.",
  },
  {
    icon: "dollar",
    title: "Relife trả tiền mỗi thứ Hai",
    body: "Doanh thu tuần trước, trừ phí Relife 15%, được chuyển vào tài khoản của tiệm mỗi sáng thứ Hai.",
  },
  {
    icon: "star",
    title: "Trả lời đánh giá",
    body: "Một lời cảm ơn ngắn giúp khách quay lại. Trả lời công khai trong mục Đánh giá.",
  },
] as const;

export const REVIEW_TAGS = ["Đáng tiền", "Bánh còn tươi", "Nhiều món", "Nhân viên thân thiện", "Ít hơn mong đợi", "Khó tìm tiệm"];

export const RATING_LABELS = ["", "Chưa ổn", "Tạm được", "Ổn", "Ngon", "Rất ngon"];
