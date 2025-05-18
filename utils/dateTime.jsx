// Function to extract and parse DateTime for Django REST Framework DateTimeField
export const parseDateTimeForDRF = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    return null; // Return null for invalid dates
  }
  // Use toISOString for ISO 8601 format (e.g., "2025-05-01T14:30:00.000Z")
  return date.toISOString();
};

// Function to extract and parse Date for Django REST Framework DateField
export const parseDateForDRF = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    return null; // Return null for invalid dates
  }
  // Manually format as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`; // e.g., "2025-05-01"
};

export const parseDateTime = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    return null; 
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}-${hours}-${minutes}`;
};