
// format any to dd-mm-yyyy.
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

 export function ChangeFormateDate(oldDate) {
    const parts = oldDate.split('-');
    if (parts.length === 3) {
      // Định dạng yyyy-MM-dd hoặc dd-MM-yyyy
      if (parts[0].length === 4) {
        // Định dạng yyyy-MM-dd
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        // Định dạng dd-MM-yyyy
        return oldDate;
      }
    } else {
      // Định dạng không có dấu gạch ngang
      return oldDate.toString().split('-').reverse().join('-');
    }
  }
  // any to yyyy-mm-dd
  export const parseDate = (dateString) => {
    if (!dateString) return '';
  
    let date, month, year;
    const parts = dateString.split(/[-/]/);
  
    // Xác định định dạng ngày tháng ban đầu
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // Định dạng "yyyy-mm-dd" hoặc "yyyy/mm/dd"
        year = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        date = parseInt(parts[2], 10);
      } else {
        // Định dạng "dd-mm-yyyy" hoặc "dd/mm/yyyy"
        date = parseInt(parts[0], 10);
        month = parseInt(parts[1], 10) - 1;
        year = parseInt(parts[2], 10);
      }
    } else {
      // Định dạng khác, ví dụ: "mm/dd/yyyy"
      month = parseInt(parts[0], 10) - 1;
      date = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }
  
    // Trả về định dạng "yyyy-mm-dd"
    return `${year.toString().padStart(4, '0')}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
  };


  export function convertDateApi(dateString) {
    // Tách các thành phần của ngày tháng
    const [year, month, day] = dateString.split('-');
  
    // Định dạng lại ngày tháng
    const formattedDate = `${day}%2F${month}%2F${year}`;
  
    return formattedDate;
  }