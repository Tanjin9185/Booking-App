import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Grid, Typography } from "@material-ui/core/";
import FormButton from "../Button";
import DateTimePicker from "../DateTimePicker";
import Select from "../Select";
import "./bookModal.css";

//Style of the modal

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  "@media (max-width: 500px)": {
    width: 240,
    p: 2,
  },
};

//Intiial state of the form

const initialFormState = {
  products: "",
  from: "",
  to: "",
};

//Forms validation logic

const formValidation = Yup.object().shape({
  products: Yup.object().required("Required"),
  from: Yup.date().required("Required"),
  to: Yup.date()
    .required("Required")
    .when("from", (from, schema) => from && schema.min(from)),
});

export default function BasicModal({
  productData,
  setProductData,
  bookProducts,
  setBookProducts,
}) {
  const [products, setProducts] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [childOpen, setChildOpen] = useState(false);
  const handleChildOpen = () => setChildOpen(true);
  const handleChildClose = () => {
    setChildOpen(false);
  };

  const [currentProduct, setCurrentProduct] = useState(null);
  const [rentDuration, setRentDuration] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = (values) => {
    setCurrentProduct(values.products);
    const rentPeriod = Math.floor(
      (Date.parse(values.to) - Date.parse(values.from)) / 86400000
    );
    setRentDuration(rentPeriod);
    if (Date.now() >= Date.parse(values.from)) {
      alert("From date cannot be in the past");
    } else if (rentPeriod < values.products.minimum_rent_period) {
      alert(
        `minimum rent period must be ${values.products.minimum_rent_period} days`
      );
    } else {
      setPrice(rentPeriod * values.products.price);
      handleChildOpen();
    }
  };

  const handleChildSubmit = () => {
    handleChildClose();
    handleClose();
    const totalMileage = rentDuration * 10;
    let durabilityDecrease = 0;

    const index = productData.findIndex(
      (product) => product.code === currentProduct.code
    );
    let changingProduct = productData;
    if (changingProduct[index].type === "meter") {
      durabilityDecrease = rentDuration * 2 + Math.floor(rentDuration / 10) * 2;
    } else if (changingProduct[index].type === "pain") {
      durabilityDecrease = rentDuration;
    }
    changingProduct[index].availability = false;
    if (changingProduct[index].mileage !== "N/A") {
      changingProduct[index].mileage += totalMileage;
    }
    let s = changingProduct[index].durability;
    let y = parseInt(s.split("/")[0].trim());
    if (y <= durabilityDecrease) {
      y = 0;
      changingProduct[index].needing_repair = true;
    } else if (y > durabilityDecrease) {
      y -= durabilityDecrease;
    }
    changingProduct[index].durability = `${y} / ${s.split("/")[1].trim()}`;
    setProductData(changingProduct);
    localStorage.setItem("productData", JSON.stringify(changingProduct));
    const bookingProduct = currentProduct;
    if (bookingProduct.mileage !== "N/A") {
      bookingProduct.usedMileage = totalMileage;
    }
    bookingProduct.cost = price;

    setBookProducts([...bookProducts, bookingProduct]);

    const updatedBookedProducts = [...bookProducts, bookingProduct];
    localStorage.setItem("bookedData", JSON.stringify(updatedBookedProducts));

    //Without refreshing, the table will not be updated, however just clicking on any table cell will update it. So its a user preference
    window.location.reload();
  };

  useEffect(() => {
    setProducts(productData);
  }, [productData]);

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Book
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="title"
          >
            Book a product
          </Typography>
          <Formik
            initialValues={{ ...initialFormState }}
            validationSchema={formValidation}
            onSubmit={handleSubmit}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Select
                    name="products"
                    label="Product"
                    options={products}
                  ></Select>
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker name="from" label="From" />
                </Grid>
                <Grid item xs={6}>
                  <DateTimePicker name="to" label="To" />
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth={true}
                    onClick={handleClose}
                  >
                    No
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <FormButton variant="outlined">Yes</FormButton>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Box>
      </Modal>
      <Modal
        open={childOpen}
        onClose={handleChildClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="title"
          >
            Book a product
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <span>
                {`Your estimated price is $${price}`}
                <br />
                {`Do you want to procede?`}
              </span>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth={true}
                onClick={handleChildClose}
              >
                No
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                fullWidth={true}
                onClick={handleChildSubmit}
              >
                Yes
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
