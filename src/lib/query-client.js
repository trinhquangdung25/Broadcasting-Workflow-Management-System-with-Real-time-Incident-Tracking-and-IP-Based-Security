// Cấu hình bộ điều phối dữ liệu an toàn cho hệ thống BroadcastHQ
export const queryClientOptions = {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // Không tự động tải lại dữ liệu khi user chuyển tab
        retry: 1, // Thử lại tối đa 1 lần nếu API bị lỗi mạng
        staleTime: 5 * 60 * 1000, // Dữ liệu được coi là mới trong vòng 5 phút
      },
    },
  };
  
  export default queryClientOptions;