import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  const rpcUrl = process.env.MONAD_RPC_URL ?? "https://testnet-rpc.monad.xyz";

  if (!privateKey) throw new Error("PRIVATE_KEY is not set. Copy .env.example to .env and fill it in.");

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log("Deploying with account:", wallet.address);

  // Load compiled artifact (run `npm run compile` first)
  const artifactPath = join(__dirname, "../artifacts/contracts/circletrust.sol/CircleTrust.json");
  const artifact = JSON.parse(readFileSync(artifactPath, "utf-8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("CircleTrust deployed to:", address);
  console.log("Share this address + the ABI with the frontend team.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
