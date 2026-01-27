export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Helper to format time as 14:05
  const formatTime = (d: Date) => {
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Strip time from "now" and "target" to compare full days
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  const diffInDays = Math.floor((startOfToday.getTime() - startOfTarget.getTime()) / (1000 * 60 * 60 * 24));

  // 1. If it happened today -> "14:05"
  if (diffInDays === 0) {
    return formatTime(date);
  }

  // 2. If it happened yesterday -> "yesterday 14:05"
  if (diffInDays === 1) {
    return `yesterday ${formatTime(date)}`;
  }

  // 3. If it happened more than 1 day ago -> "MM/DD/YYYY"
  return date.toLocaleDateString(); 
};



export const formatMessageTime = (dateString: string) => {
  const d = new Date(dateString);
  return d.getHours().toString().padStart(2, '0') + ':' + 
         d.getMinutes().toString().padStart(2, '0');
};