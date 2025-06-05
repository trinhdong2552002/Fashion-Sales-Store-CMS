# Thông tin chung
- **Chủ đề**: Dialog thêm / sửa danh mục
- **Ngày**: 04-06-2025
- **Tình huống**: Form nhập dữ liệu qua dialog, gọi API lưu sản phẩm và cập nhật sản phẩm

---

## Dòng xử lý logic
** Thêm danh muc 
1. Nhấn Thêm danh mục → mở Dialog
2. Trong dialog cho phép nhập input với dữ liệu mới
3. Sau khi nhập xong -> Nhấn nút lưu sản phẩm, update state, xoá state cũ và đóng dialog lại
4. Giả sử user muốn thêm danh mục khác phải hiển thị input rỗng ko đc hiển thị lại input mà user vừa mới thêm

** Sửa danh mục
1. Nhấn cập nhật danh mục -> mở Dialog
2. Trong dialog cần lấy state cũ theo id -> Hiển thị input cho danh mục đó
3. Sau khi chỉnh sửa -> Nhấn nút cập nhật đóng dialog lại 

## Code 

1. Ta cần tạo 4 state
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
  const [selectedCategoriesId, setSelectedCategoriesId] = useState(null);

----

** const [openDialog, setOpenDialog] = useState(false);
 - State openDialog để mở dialog ra nếu là true sẽ mở dialog đó ngược lại sẽ đóng 
 - để mở hoặc đóng ta phải có event handler là onClick
 - Dialog này chỉ dành cho xử lý thêm hoặc sửa 
 - Vậy openDialog này để làm gì ? Mục đích để truyền value cho component Dialog của MUI có prop là open ta giá trị là object 
 - Còn setOpenDialog thì sao ? Để dùng ta sẽ tạo hàm cho từng xử lý handleDelete, handleRestore, handleUpdate khi ta cần mở hoặc đóng thì chỉ cần gọi state mới setOpenDialog truyền giá trị boolean true hoặc false


** const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
- Dialog cho xử lý xoá

** const [openRestoreDialog, setOpenRestoreDialog] = useState(false);
- Dialog khôi phục 

** const [selectedCategoriesId, setSelectedCategoriesId] = useState(null);
- Nếu là sửa, xoá, khôi phục ta phải có id để biết dialog đó là danh mục nào dựa theo id ngược lại thêm thì ko cần id 

2. handleDeleteDialog và handleRestoreDialog

 const handleOpenDeleteDialog = (id) => {
    setSelectedCategoriesId(id);
    setOpenDeleteDialog(true);
  };

  const handleOpenRestoreDialog = (id) => {
    setSelectedCategoriesId(id);
    setOpenRestoreDialog(true);
  };

----

  - 2 hàm này ta phải kèm 2 state update đi kèm 
  - setOpenDialog này luôn là true để mở dialog 
  - setSelectedCategoriesId truyền id để biết là id nào cần đc xoá hoặc khôi phục lại

3. handleDeleteCategories và handleRestoreCategories

  const handleDeleteCategories = async () => {
    try {
      await deleteCategories({ id: selectedCategoriesId }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Xoá danh mục thành công!",
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Xoá danh mục thất bại!",
      });
      console.error("Delete error:", error);
    }
    setOpenDeleteDialog(false);
    setSelectedCategoriesId(null);
  };

    const handleRestoreCategories = async () => {
    try {
      await restoreCategories({ id: selectedCategoriesId }).unwrap();
      setSnackbar({
        open: true,
        severity: "success",
        message: "Khôi phục danh mục thành công!",
      });
      refetch();
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Khôi phục danh mục thất bại!",
      });
      console.error("Restore error:", error);
    }
    setOpenRestoreDialog(false);
    setSelectedCategoriesId(null);
  };

  - cũng đi kèm 2 state như 2 hàm trên nhưng có điều khi xử lý sau khi user submit
  - ta phải đóng dialog và setSelectedCategoriesId trả về null 