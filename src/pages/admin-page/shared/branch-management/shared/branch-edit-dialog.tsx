import EditDialog from "@/components/dialog/edit-dialog";
import { TextField } from "@mui/material";

interface BranchEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newBranches: any;
  setNewBranches: (branches: any) => void;
  submitted: boolean;
}

const BranchEditDialog = ({
  open,
  onClose,
  onSubmit,
  newBranches,
  setNewBranches,
  submitted,
}: BranchEditDialogProps) => {
  return (
    <EditDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Cập nhật chi nhánh"
    >
      <TextField
        label="Tên chi nhánh"
        value={newBranches.name}
        onChange={(e) =>
          setNewBranches({ ...newBranches, name: e.target.value })
        }
        fullWidth
        sx={{ mt: 2 }}
        error={submitted && !newBranches.name}
        helperText={
          submitted && !newBranches.name ? "name không được để trống" : ""
        }
      />
      <TextField
        label="Địa điểm"
        value={newBranches.location}
        onChange={(e) =>
          setNewBranches({ ...newBranches, location: e.target.value })
        }
        fullWidth
        sx={{ mt: 2 }}
        error={submitted && !newBranches.location}
        helperText={
          submitted && !newBranches.location
            ? "location không được để trống"
            : ""
        }
      />
      <TextField
        label="Số điện thoại"
        value={newBranches.phone}
        onChange={(e) =>
          setNewBranches({ ...newBranches, phone: e.target.value })
        }
        fullWidth
        sx={{ mt: 2 }}
        error={submitted && !newBranches.phone}
        helperText={
          submitted && !newBranches.phone ? "phone không được để trống" : ""
        }
      />
    </EditDialog>
  );
};

export default BranchEditDialog;
