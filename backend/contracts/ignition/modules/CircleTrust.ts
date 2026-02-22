import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CircleTrustModule = buildModule("CircleTrustModule", (m) => {
  // No constructor args — pools are created dynamically via createPool()
  const circleTrust = m.contract("CircleTrust", []);

  return { circleTrust };
});

export default CircleTrustModule;
