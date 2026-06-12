// Hàm định dạng hiển thị tiền tệ hoặc số lượng dữ liệu lớn trong hệ thống
export const formatSystemNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  // Hàm loại bỏ ký tự đặc biệt khỏi chuỗi
  export const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '');
  };