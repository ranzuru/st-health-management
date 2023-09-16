import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";

const MedicineInventoryForm = ({ open = false, onClose, onSave }) => {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [stockLevel, setStockLevel] = useState("High"); // You can calculate this value automatically based on quantity
  const [expirationDate, setExpirationDate] = useState(null);
  const [restockDate, setRestockDate] = useState(null);
  const [note, setNote] = useState("");

  const handleSave = () => {
    // Validate form fields
    if (!productName || !category || !quantity) {
      alert("Please fill in all required fields.");
      return;
    }

    // Implement your saving logic here
    onSave({
      productName,
      category,
      quantity,
      stockLevel,
      expirationDate,
      restockDate,
      note,
    });

    // Clear form fields
    setProductName("");
    setCategory("");
    setQuantity(0);
    setStockLevel("High");
    setExpirationDate(null);
    setRestockDate(null);
    setNote("");

    // Close the dialog
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Medicine</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter medicine details:</DialogContentText>
          <TextField
            autoFocus
            margin="normal"
            label="Product Name"
            fullWidth
            required
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} className="flex items-center">
              <FormControl fullWidth required margin="normal">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <MenuItem value={"First Aid"}>First Aid</MenuItem>
                  <MenuItem value={"Pain Relief"}>Pain Relief</MenuItem>
                  <MenuItem value={"Cold & Flu"}>Cold & Flu</MenuItem>
                  <MenuItem value={"Allergy"}>Allergy</MenuItem>
                  <MenuItem value={"Digestive Health"}>
                    Digestive Health
                  </MenuItem>
                  <MenuItem value={"Vitamins & Supplements"}>
                    Vitamins & Supplements
                  </MenuItem>
                  <MenuItem value={"Skin Care"}>Skin Care</MenuItem>
                  <MenuItem value={"Eye Care"}>Eye Care</MenuItem>
                  <MenuItem value={"Respiratory"}>Respiratory</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} className="flex items-center">
              <TextField
                className="w-full"
                margin="normal"
                label="Quantity"
                type="number"
                fullWidth
                required
                value={quantity === 0 ? "0" : quantity || ""}
                onChange={(e) =>
                  setQuantity(e.target.value ? parseInt(e.target.value, 10) : 0)
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Expiration Date"
                value={expirationDate}
                onChange={(newDate) => setExpirationDate(newDate)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Restock Date"
                value={restockDate}
                onChange={(newDate) => setRestockDate(newDate)}
              />
            </Grid>
          </Grid>
          <TextField
            margin="normal"
            label="Note"
            fullWidth
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MedicineInventoryForm;
