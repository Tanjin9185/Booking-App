import { TextField, MenuItem } from "@material-ui/core";
import { useField, useFormikContext } from "formik";

const SelectWrapper = ({
  name,
  options,
  returns,
  setCurrentProduct,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);
  const handleChange = (event) => {
    const { value } = event.target;
    setFieldValue(name, value);
    if (setCurrentProduct) {
      setCurrentProduct(value);
    }
  };
  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: "outlined",
    fullWidth: true,
    onChange: handleChange,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }
  //Here pos/position is the index of the key value pair
  //i.e. BD="Bangladesh", here, BD = pos and Bangaldesh = item
  return (
    <TextField {...configSelect}>
      {options.map((item, pos) => {
        return item.availability || returns ? (
          <MenuItem key={pos} value={item}>
            {`${item.name} / ${item.code}`}
          </MenuItem>
        ) : null;
      })}
    </TextField>
  );
};

export default SelectWrapper;
