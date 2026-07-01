import AddDialog from "@/components/Dialog/Add_dialog";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const UserAddDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  submitted,
  newUser,
  setNewUser,
  dataRoles,
}) => {
  return (
    <AddDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="Thêm người dùng"
    >
      <TextField
        label="Tên"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        fullWidth
        sx={{ mt: 2 }}
        error={submitted && !newUser.name}
        helperText={
          submitted && !newUser.name ? "name không được để trống" : ""
        }
      />
      <TextField
        label="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        fullWidth
        sx={{ mt: 2 }}
        error={submitted && !newUser.email}
        helperText={
          submitted && !newUser.email ? "email không được để trống" : ""
        }
      />
      <TextField
        type="number"
        label="Số điện thoại"
        value={newUser.phone}
        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
        fullWidth
        sx={{ mt: 2 }}
        error={submitted && !newUser.phone}
        helperText={
          submitted && !newUser.phone ? "phone không được để trống" : ""
        }
      />
      <TextField
        label="Mật khẩu"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        fullWidth
        sx={{ mt: 2 }}
        type="password"
        error={submitted && !newUser.password}
        helperText={
          submitted && !newUser.password ? "password không được để trống" : ""
        }
      />
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Vai trò</InputLabel>
        <Select
          multiple
          value={newUser.roleIds}
          onChange={(e) => setNewUser({ ...newUser, roleIds: e.target.value })}
          label="Vai trò"
          renderValue={(selected) =>
            selected
              .map(
                (id) =>
                  dataRoles?.result?.items.find((r) => r.id === id)?.name || "",
              )
              .join(", ")
          }
        >
          {dataRoles?.result?.items?.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </AddDialog>
  );
};

export default UserAddDialog;
