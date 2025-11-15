const HID = require("node-hid");

const devices = HID.devices();
console.log(devices); // lihat semua device HID

// Ganti 0x1234 & 0x5678 dengan VendorID & ProductID RFID reader kamu
const reader = new HID.HID(0x1234, 0x5678);

reader.on("data", (data) => {
  const rfid = data.toString().trim();
  console.log("RFID:", rfid);
});
