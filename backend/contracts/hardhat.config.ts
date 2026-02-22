import { defineConfig, configVariable } from "hardhat/config";

export default defineConfig({
  solidity: {
    version: "0.8.28",
  },
  networks: {
    monadTestnet: {
      type: "http",
      url: configVariable("MONAD_RPC_URL"),
      chainId: 10143,
      accounts: [configVariable("PRIVATE_KEY")],
    },
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545",
    },
  },
});
