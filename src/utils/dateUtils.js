import dayjs from "dayjs";

// Helper function to format dates
export const formatDate = (dateString) => {
  return dayjs(dateString).format("DD/MM/YYYY");
};

// Helper function to get start of month
export const getStartOfMonth = () => {
  return dayjs().startOf("month").toISOString();
};

// Helper function to get end of month
export const getEndOfMonth = () => {
  return dayjs().endOf("month").toISOString();
};
