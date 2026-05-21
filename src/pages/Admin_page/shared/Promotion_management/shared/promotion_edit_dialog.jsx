import EditDialog from "@/components/Dialog/Edit_dialog";
import { Box, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const PromotionEditDialog = ({
  open,
  onClose,
  handleSubmit,
  newPromotion,
  setNewPromotion,
  submitted,
}) => {
  return (
    <EditDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Chỉnh sửa khuyến mãi"
    >
      <TextField
        label="Mã khuyến mãi"
        value={newPromotion.code}
        onChange={(e) =>
          setNewPromotion({ ...newPromotion, code: e.target.value })
        }
        fullWidth
        sx={{ mt: 2 }}
        error={submitted && !newPromotion.code}
        helperText={
          submitted && !newPromotion.code
            ? "Mã khuyến mãi không được để trống"
            : ""
        }
      />
      <TextField
        label="Mô tả"
        value={newPromotion.description}
        onChange={(e) =>
          setNewPromotion({ ...newPromotion, description: e.target.value })
        }
        fullWidth
        sx={{ mt: 2 }}
        error={submitted && !newPromotion.description}
        helperText={
          submitted && !newPromotion.description
            ? "Mô tả không được để trống"
            : ""
        }
      />
      <TextField
        label="Giảm giá (%)"
        type="number"
        value={newPromotion.discountPercent}
        onChange={(e) =>
          setNewPromotion({
            ...newPromotion,
            discountPercent: e.target.value,
          })
        }
        fullWidth
        sx={{ mt: 2 }}
        error={submitted && !newPromotion.discountPercent}
        helperText={
          submitted && !newPromotion.discountPercent
            ? "Phần trăm giảm giá không được để trống"
            : ""
        }
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          display={"flex"}
          gap={2}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{ mt: 2 }}
        >
          <DatePicker
            label="Ngày bắt đầu"
            value={newPromotion.startDate}
            onChange={(value) =>
              setNewPromotion({
                ...newPromotion,
                startDate: value || dayjs(),
              })
            }
            sx={{ flex: 1 }}
          />

          <DatePicker
            label="Ngày kết thúc"
            value={newPromotion.endDate}
            onChange={(value) =>
              setNewPromotion({
                ...newPromotion,
                endDate: value || dayjs(),
              })
            }
            sx={{ flex: 1 }}
            minDate={newPromotion.startDate}
          />
        </Box>
      </LocalizationProvider>
    </EditDialog>
  );
};

export default PromotionEditDialog;
