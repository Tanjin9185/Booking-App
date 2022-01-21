import React, { useEffect, useState } from "react";
import Table from "./Components/Table";
import Stack from "@mui/material/Stack";
import BookModal from "./Components/BookModal";
import ReturnModal from "./Components/ReturnModal";
import data from "./data/Data.json";
import { Container } from "@material-ui/core/";
import "./App.css";

function App() {
  //State for products Data which is being passed around
  const [productData, setProductData] = useState([]);
  const [bookedProducts, setBookedProducts] = useState([]);
  useEffect(() => {
    //Local storage check on app initialization
    const checkProductData = localStorage.getItem("productData");
    if (checkProductData) {
      setProductData(JSON.parse(checkProductData));
    } else {
      const myData = data.map((row, index) => {
        return {
          id: row.code,
          index: index + 1,
          name: row.name,
          code: row.code,
          type: row.type,
          max_durability: row.max_durability,
          price: row.price,
          availability: row.availability,
          needingRepair: row.needing_repair,
          durability: `${row.durability} / ${row.max_durability}`,
          mileage: row.mileage ? row.mileage : "N/A",
          minimum_rent_period: row.minimum_rent_period,
        };
      });
      setProductData(myData);
      localStorage.setItem("productData", JSON.stringify(myData));
    }

    const checkBookedData = localStorage.getItem("bookedData");
    if (checkBookedData) {
      setBookedProducts(JSON.parse(checkBookedData));
    }
  }, []);

  //here the product and bookedProducts data was sent via props, however it could also have been sent by Context API to make the code a bit more cleaner.
  return (
    <Container className="container">
      <Table data={productData} />
      <Stack className="stack" spacing={2} direction="row">
        <BookModal
          productData={productData}
          setProductData={setProductData}
          bookProducts={bookedProducts}
          setBookProducts={setBookedProducts}
        />
        <ReturnModal
          productData={productData}
          setProductData={setProductData}
          bookProducts={bookedProducts}
          setBookProducts={setBookedProducts}
        />
      </Stack>
    </Container>
  );
}

export default App;
