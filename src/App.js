import React, { useState } from "react";
import SphereImage from "./SphereImage";
import "./App.css";
import SphereImage1 from "./SphereImage1";
import Cube from "./Cube";
import Plan from "./Plan";

const App = () => {
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageUrl(reader.result);
    };
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        // flexDirection: "column",
        alignItems: "center"
      }}
    >
      {/* {imageUrl && <SphereImage imageUrl={imageUrl} />} */}
      {/* <Cube /> */}
      <Plan />
    </div>
  );
};

export default App;
