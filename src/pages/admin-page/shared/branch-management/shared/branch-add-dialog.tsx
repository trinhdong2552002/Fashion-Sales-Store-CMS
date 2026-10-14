import AddDialog from "@/components/dialog/add-dialog";
import { TextField } from "@mui/material";

interface BranchAddDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  newBranches: any;
  setNewBranches: (branches: any) => void;
  submitted: boolean;
}

const BranchAddDialog = ({
  open,
  onClose,
  onSubmit,
  newBranches,
  setNewBranches,
  submitted,
}: BranchAddDialogProps) => {
  return (
    <AddDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Thêm chi nhánh"
    >
      <TextField
        required
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
        required
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
        required
        type="number"
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
    </AddDialog>
  );
};

export default BranchAddDialog;
