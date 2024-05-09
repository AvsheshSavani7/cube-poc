import React, { useEffect, useRef, useState } from "react";
import { Canvas, extend, useLoader, useThree } from "@react-three/fiber";
import { Image, OrbitControls, useTexture } from "@react-three/drei";
import SphereLoad from "./SphereLoad";
import { Controls } from "./Controls";
import * as THREE from "three";
import "./util";
import CubeLoad from "./CubeLoad";
import NewPlanPoint from "./NewPlanPoint";
import { Button, ColorPicker, Divider, Input, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const Plan = () => {
  const [intersectionPoint, setIntersectionPoint] = useState([]);
  const [planPoints, setPlanPoints] = useState([]);
  const [finalized, setFinalized] = useState(false);
  const [pointsInput, setPointsInput] = useState([
    { point: "", color: "#1677ff" },
    { point: "", color: "#C73D3D" },
    { point: "", color: "#EFDE00" },
    { point: "", color: "#30E765" }
  ]);

  const [inputFilled, setInputFilled] = useState([false, false, false, false]);
  console.log(pointsInput, "pointsInput");

  const handleInputChange = (index, field, value) => {
    if (field === "color") {
      const updatedPoints = [...pointsInput];
      updatedPoints[index][field] = value;
      setPointsInput(updatedPoints);
    } else {
      let newValue = value.trim(); // Trim the new value

      // // Check if the old value ends with a comma
      // if (pointsInput[index][field].endsWith(",")) {
      //   // Append the new value without adding an additional comma
      //   newValue = pointsInput[index][field] + newValue;
      // } else {
      //   // Append the new value with a comma
      //   newValue = pointsInput[index][field] + "," + newValue;
      // }

      const updatedPoints = [...pointsInput];
      updatedPoints[index][field] = newValue;
      setPointsInput(updatedPoints);

      const updatedFilled = [...inputFilled];
      updatedFilled[index] = newValue.trim() !== "";
      setInputFilled(updatedFilled);
    }
  };

  const handleAddPoint = () => {
    setPointsInput([...pointsInput, { point: "", color: "#000000" }]);
    setInputFilled([...inputFilled, false]);
  };

  const handleOkClick = () => {
    // Validate if all inputs are filled
    if (inputFilled.every((filled) => filled)) {
      // Convert input values to points
      const finalplanCordinate = pointsInput.map((pointData) => {
        const [x, y, z] = pointData.point.split(",").map(parseFloat);
        return findCordinate(x, y, z, pointData?.color);
      });
      console.log(finalplanCordinate);
      setPlanPoints(finalplanCordinate);
      // Update intersection points
      const intersectionPoints = pointsInput.map((pointData) => {
        const [x, y, z] = pointData.point.split(",").map(parseFloat);
        return new THREE.Vector3(x, y, z);
      });
      setIntersectionPoint(intersectionPoints);

      // Set finalized to true to proceed to the next step
      setFinalized(true);
    } else {
      alert("Please fill in all the point inputs.");
    }
  };

  const handleCancel = () => {
    setPointsInput([
      { point: "", color: "#1677ff" },
      { point: "", color: "#C73D3D" },
      { point: "", color: "#EFDE00" },
      { point: "", color: "#30E765" }
    ]);
    setIntersectionPoint([]);
    setFinalized(false);
    setPlanPoints([]);
  };

  const findCordinate = (x, y, z, color) => {
    let result = Math.atan(x / -z);
    if (z === 0) {
      result = Math.atan(x / -0.0000001);
    }
    if (z >= 0) {
      result += Math.PI;
    }
    if (result < 0) {
      result += 2 * Math.PI;
    }
    const hypoT = Math.sqrt(Math.pow(x, 2) + Math.pow(z, 2));
    const delta1 = (result * 180) / Math.PI;
    const delta2 = (Math.atan(y / hypoT) * 180) / Math.PI;
    return [[delta1, delta2], color];
  };
  const handleRemovePoint = (indexToRemove) => {
    const updatedPoints = pointsInput.filter(
      (_, index) => index !== indexToRemove
    );
    setPointsInput(updatedPoints);
    // Remove the corresponding entry from inputFilled
    const updatedFilled = inputFilled.filter(
      (_, index) => index !== indexToRemove
    );
    setInputFilled(updatedFilled);
  };
  return (
    <>
      <div className="flex flex-col items-start">
        <div className="flex flex-col h-[90vh] overflow-y-auto pr-3 ml-1">
          {pointsInput.map((pointData, index) => (
            <div key={index} className="flex  w-[220px]">
              <div className="flex m-1">
                <label className="mr-1 w-[45px]">Pt-{index + 1}</label>
                <Input
                  className="w-[110px]"
                  type="text"
                  placeholder={`Pt ${index + 1} (x,y,z)`}
                  value={pointData.point}
                  onChange={(e) =>
                    handleInputChange(index, "point", e.target.value)
                  }
                  required
                />
              </div>
              <div className="">
                {/* <Input
                  type="color"
                  className="w-[20px] h-[20px] rounded-lg border-none"
                  value={pointData.color}
                  onChange={(e) =>
                    handleInputChange(index, "color", e.target.value)
                  }
                /> */}
                <ColorPicker
                  defaultValue="#1677ff"
                  // showText
                  format="hex"
                  value={pointData.color}
                  onChange={(hex) =>
                    handleInputChange(index, "color", hex.toHexString())
                  }
                />
              </div>
              <div className="flex justify-center items-center p-1">
                {pointsInput?.length !== 1 && (
                  <DeleteOutlined onClick={() => handleRemovePoint(index)} />
                )}
              </div>
            </div>
          ))}
        </div>
        <Button onClick={handleAddPoint} className="m-1">
          + Add Point
        </Button>
        <Space>
          <Button onClick={handleOkClick} className="m-1">
            Ok
          </Button>
          <Button onClick={handleCancel} className="m-1">
            Cancel
          </Button>
        </Space>
      </div>
      <Divider className="h-[100vh] " type="vertical" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "90vh",
          width: "90vw"
        }}
      >
        <Canvas camera={{ position: [0, 0, 130] }}>
          <OrbitControls
            enableDamping={true}
            dampingFactor={0.25}
            maxDistance={1000}
            minDistance={0.5}
            rotateSpeed={-0.25}
            zoomSpeed={1}
            enablePan
            enableZoom
          />
          <NewPlanPoint planPoints={planPoints} />
        </Canvas>
      </div>
    </>
  );
};

export default Plan;
