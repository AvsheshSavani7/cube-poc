import office26 from "./panos1/camera_1f3dc743c37e474a80d38ec4937f8e80_office_26_frame_equirectangular_domain_rgb_output.png";
import hallway5 from "./panos1/camera_24f42d6efff54b09a34897f69fa11064_hallway_5_frame_equirectangular_domain_rgb_output.png";
import pantry1 from "./panos1/camera_444fbe38b7ea4553b235aa35445e99fc_pantry_1_frame_equirectangular_domain_rgb_output.png";
import office30 from "./panos1/camera_4ff66baf78ae47e0bbd6443312ba648e_office_30_frame_equirectangular_domain_rgb_output.png";
import pantry2 from "./panos1/camera_5c46b2cf95f44b2485bf82ba03256390_pantry_1_frame_equirectangular_domain_rgb_output.png";
import office31 from "./panos1/camera_9084f217cb10409bb1ec15e8fa1f7299_office_31_frame_equirectangular_domain_rgb_output.png";
import hallway2 from "./panos1/camera_cff198550a97439eae623dd55452c4c0_hallway_2_frame_equirectangular_domain_rgb_output.png";
import hallway4 from "./panos1/camera_d31195f6b19d422aaae0415bd0ee838a_hallway_4_frame_equirectangular_domain_rgb_output.png";
import office7 from "./panos1/camera_d3defbcc1a674160a7445f2da5afb300_office_7_frame_equirectangular_domain_rgb_output.png";
import wc1 from "./panos1/camera_e0c041d3b2a94769b1dc86935f983f34_WC_1_frame_equirectangular_domain_rgb_output.png";
import lounge2 from "./panos1/camera_f2a15344d61f460c9437d3af0be5bf37_lounge_2_frame_equirectangular_domain_rgb_output.png";

import room1 from "./panos2/pano_1.JPG";
import room1Removed from "./panos2/pano_1_removed.png";
import room2 from "./panos2/pano_2.JPG";
import room2Removed from "./panos2/pano_2_removed.png";
import room3 from "./panos2/pano_3.JPG";
import room3Removed from "./panos2/pano_3_removed.png";
import room4 from "./panos2/pano_4.JPG";
import room4Removed from "./panos2/pano_4_removed.png";
import room5 from "./panos2/pano_5.JPG";
import room5Removed from "./panos2/pano_5_removed.png";

import woodAreaLight from "./products/Area light + Center spot (wood less reflective) (1).png";
import woodSunLight from "./products/Sunlight (wood less reflective) (1).png";

import firstFloor from "./products/360 Floor - First Floor.0001.png";
import kahrsAsh from "./products/360 Floor - Kahrs Ash.0001.png";
import kahrsOak from "./products/360 Floor - Kahrs Oak.0001.png";
import redOak from "./products/360 Floor - Red Oak.0001.png";
import whiteOak from "./products/360 Floor - White Oak.0001.png";

const PanoramaImages1 = [
  { key: "office26", data: office26 },
  { key: "hallway5", data: hallway5 },
  { key: "pantry1", data: pantry1 },
  { key: "office30", data: office30 },
  { key: "pantry2", data: pantry2 },
  { key: "office31", data: office31 },
  { key: "hallway2", data: hallway2 },
  { key: "hallway4", data: hallway4 },
  { key: "office7", data: office7 },
  { key: "wc1", data: wc1 },
  { key: "lounge2", data: lounge2 }
];
const PanoramaImages2 = [
  { key: "Room1", data: room1, removed: room1Removed },
  { key: "Room2", data: room2, removed: room2Removed },
  { key: "Room3", data: room3, removed: room3Removed },
  { key: "Room4", data: room4, removed: room4Removed },
  { key: "Room5", data: room5, removed: room5Removed }
];

const ProductImages = [
  { key: "Kahrs Ash", data: kahrsAsh },
  { key: "Kahrs Oak", data: kahrsOak },
  { key: "Red Oak", data: redOak },
  { key: "White Oak", data: whiteOak },
  { key: "First Floor", data: firstFloor },

  { key: "Wood AreaLight", data: woodAreaLight },
  { key: "Wood SunLight", data: woodSunLight }
];

const Images = {
  panos1: PanoramaImages1,
  panos2: PanoramaImages2,
  products: ProductImages
};

export { Images };
