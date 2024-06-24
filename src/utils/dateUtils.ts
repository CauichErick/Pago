// src/utils/dateUtils.ts
export const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-CA', options); // 'en-CA' formatea la fecha como YYYY-MM-DD
  };
  