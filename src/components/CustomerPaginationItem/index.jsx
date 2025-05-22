import { PaginationItem, styled } from "@mui/material";

const CustomPaginationItem = styled(PaginationItem)(({ theme }) => ({
  "&.MuiPaginationItem-previousNext": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
    "&.Mui-disabled": {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
    },
    borderRadius: "4px",
    margin: "0 5px",
    padding: "8px",
  },
}));

export default CustomPaginationItem;
