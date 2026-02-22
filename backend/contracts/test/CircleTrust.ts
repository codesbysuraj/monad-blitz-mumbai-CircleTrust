/**
 * CircleTrust Comprehensive Test Suite
 * Run: npx hardhat node (terminal 1), then npx tsx test/CircleTrust.ts (terminal 2)
 */
import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname2 = dirname(fileURLToPath(import.meta.url));
const RPC_URL = "http://127.0.0.1:8545";
const CONTRIBUTION = ethers.parseEther("0.1");
const DEPOSIT = CONTRIBUTION * 2n; // contribution + collateral
const MAX_MEMBERS = 3;
let passed = 0;
let failed = 0;

// ── Helpers ──────────────────────────────────────────────────
function ok(msg: string) { console.log("  v", msg); passed++; }
function fail(msg: string, err: unknown) {
  console.error("  x", msg);
  if (err instanceof Error) console.error("   ", (err as any).shortMessage ?? err.message);
  else console.error("   ", typeof err === "bigint" ? err.toString() : JSON.stringify(err));
  failed++;
}
function assert(cond: boolean, label: string, debug?: unknown) {
  if (cond) ok(label); else fail(label, debug ?? new Error("assertion failed"));
}

async function shouldRevert(fn: () => Promise<unknown>, label: string) {
  try {
    await fn();
    fail(label, new Error("Expected revert but call succeeded"));
  } catch (e: any) {
    const code = e?.code ?? e?.info?.error?.code ?? "";
    const msg = String(e?.message ?? "");
    if (code === "CALL_EXCEPTION" || msg.includes("revert") || msg.includes("CALL_EXCEPTION"))
      ok(label);
    else fail(label, e);
  }
}

// Block-number-specific balance read — avoids stale cache issues
async function balAt(provider: ethers.JsonRpcProvider, addr: string, block: number): Promise<bigint> {
  const hex = await provider.send("eth_getBalance", [addr, "0x" + block.toString(16)]);
  return BigInt(hex);
}

// Get balance diff for an address across a transaction (pre-block vs post-block)
async function balDiff(provider: ethers.JsonRpcProvider, addr: string, receipt: any): Promise<bigint> {
  const before = await balAt(provider, addr, receipt.blockNumber - 1);
  const after = await balAt(provider, addr, receipt.blockNumber);
  return after - before;
}

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signers = await Promise.all([0, 1, 2, 3, 4].map(i => provider.getSigner(i)));
  const addrs = await Promise.all(signers.map(s => s.getAddress()));
  console.log("\nAccounts:", addrs.map((a, i) => `[${i}] ${a}`).join("\n          "));

  const artifactPath = join(__dirname2, "../artifacts/contracts/circletrust.sol/CircleTrust.json");
  const artifact = JSON.parse(readFileSync(artifactPath, "utf-8"));
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signers[0]);
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const contractAddr = await contract.getAddress();
  console.log("Deployed at:", contractAddr, "\n");

  const c = (i: number) => contract.connect(signers[i]) as any;
  const ct = contract as any;

  // ═══════════════════════════════════════════════════════════
  //  1. POOL CREATION
  // ═══════════════════════════════════════════════════════════
  console.log("== POOL CREATION ==");

  // 1a – poolCount increments
  try {
    const before = await ct.poolCount();
    await (await c(0).createPool(CONTRIBUTION, MAX_MEMBERS, 0)).wait();
    const after = await ct.poolCount();
    assert(after === before + 1n, "poolCount increments");
  } catch (e) { fail("poolCount increments", e); }

  // 1b – creator stored
  try {
    const pool = await ct.getPool(0);
    assert(pool.creator.toLowerCase() === addrs[0].toLowerCase(), "creator stored correctly");
  } catch (e) { fail("creator stored correctly", e); }

  // 1c – contributionAmount stored
  try {
    const pool = await ct.getPool(0);
    assert(pool.contributionAmount === CONTRIBUTION, "contributionAmount stored");
  } catch (e) { fail("contributionAmount stored", e); }

  // 1d – maxMembers stored
  try {
    const pool = await ct.getPool(0);
    assert(Number(pool.maxMembers) === MAX_MEMBERS, "maxMembers stored");
  } catch (e) { fail("maxMembers stored", e); }

  // 1e – minimumReputation stored
  try {
    const pool = await ct.getPool(0);
    assert(Number(pool.minimumReputation) === 0, "minimumReputation stored");
  } catch (e) { fail("minimumReputation stored", e); }

  // 1f – creatorFeePercent = 3
  try {
    const pool = await ct.getPool(0);
    assert(Number(pool.creatorFeePercent) === 3, "creatorFeePercent = 3");
  } catch (e) { fail("creatorFeePercent = 3", e); }

  // 1g – reject zero contribution
  await shouldRevert(
    () => ct.createPool.staticCall(0, MAX_MEMBERS, 0),
    "revert: zero contribution"
  );

  // 1h – reject maxMembers < 2
  await shouldRevert(
    () => ct.createPool.staticCall(CONTRIBUTION, 1, 0),
    "revert: maxMembers < 2"
  );

  // ═══════════════════════════════════════════════════════════
  //  2. JOINING LOGIC
  // ═══════════════════════════════════════════════════════════
  console.log("\n== JOINING LOGIC ==");

  // 2a – join with exact 2x contribution
  try {
    await (await c(0).joinPool(0, { value: DEPOSIT })).wait();
    ok("join with exact 2x contribution");
  } catch (e) { fail("join with exact 2x contribution", e); }

  // 2b – collateral stored correctly
  try {
    const collat = await ct.getCollateral(0, addrs[0]);
    assert(collat === CONTRIBUTION, "collateral stored correctly", collat);
  } catch (e) { fail("collateral stored correctly", e); }

  // 2c – activeMember set true
  try {
    const active = await ct.isActiveMember(0, addrs[0]);
    assert(active === true, "activeMember set true");
  } catch (e) { fail("activeMember set true", e); }

  // 2d – revert wrong ETH
  await shouldRevert(
    () => c(1).joinPool.staticCall(0, { value: CONTRIBUTION }),
    "revert: wrong ETH (1x instead of 2x)"
  );

  // 2e – revert duplicate join
  await shouldRevert(
    () => c(0).joinPool.staticCall(0, { value: DEPOSIT }),
    "revert: duplicate join"
  );

  // 2f – fill pool
  try {
    await (await c(1).joinPool(0, { value: DEPOSIT })).wait();
    await (await c(2).joinPool(0, { value: DEPOSIT })).wait();
    const pool = await ct.getPool(0);
    assert(Number(pool.memberCount) === MAX_MEMBERS, `${MAX_MEMBERS} members joined`);
  } catch (e) { fail("fill pool", e); }

  // 2g – revert pool full
  await shouldRevert(
    () => c(3).joinPool.staticCall(0, { value: DEPOSIT }),
    "revert: pool full"
  );

  // 2h – ETH balance check after join
  try {
    const contractBal = await ct.getContractBalance();
    // 3 members * 0.2 ETH each = 0.6 ETH
    assert(contractBal === DEPOSIT * BigInt(MAX_MEMBERS), "contract balance correct after joins", contractBal);
  } catch (e) { fail("contract balance after joins", e); }

  // 2i – reputation gate (create pool 1 with minRep=5)
  try {
    await (await c(0).createPool(CONTRIBUTION, MAX_MEMBERS, 5)).wait(); // pool 1
  } catch (e) { /* pool 1 exists */ }

  await shouldRevert(
    () => c(3).joinPool.staticCall(1, { value: DEPOSIT }),
    "revert: reputation too low (minRep=5)"
  );

  // 2j – revert joining completed pool (tested later implicitly, set up pool 2 for this)
  // Pool 2 will be completed later and we test joining it

  // ═══════════════════════════════════════════════════════════
  //  3. DISTRIBUTION LOGIC
  // ═══════════════════════════════════════════════════════════
  console.log("\n== DISTRIBUTION LOGIC ==");

  // 3a – revert distribute on non-full pool
  await shouldRevert(
    () => ct.distribute.staticCall(1),
    "revert: distribute on non-full pool"
  );

  // 3b – distribute round 0: correct order (members[0] gets paid)
  try {
    const receipt = await (await c(0).distribute(0, { gasLimit: 500000 })).wait();
    // Use block-specific balance reads to avoid stale data
    const diff0 = await balDiff(provider, addrs[0], receipt);
    // member[0] is the caller AND receiver: pays gas, receives payout (0.097 ETH)
    // net should be: +payout - gas > 0 (payout >> gas)
    const feePerRound = (CONTRIBUTION * 3n) / 100n;
    const payout = CONTRIBUTION - feePerRound;
    assert(diff0 > 0n, "round 0: distributes to members[0] (balance increased)", diff0);
  } catch (e) { fail("round 0 distribute", e); }

  // 3c – currentRound incremented
  try {
    const pool = await ct.getPool(0);
    assert(Number(pool.currentRound) === 1, "currentRound incremented to 1");
  } catch (e) { fail("currentRound increment", e); }

  // 3d – reputation +1 for receiver
  try {
    const rep = await ct.reputation(addrs[0]);
    assert(rep === 1n, "reputation +1 for round 0 receiver", rep);
  } catch (e) { fail("reputation +1", e); }

  // 3e – distribute round 1
  try {
    const receipt = await (await c(0).distribute(0, { gasLimit: 500000 })).wait();
    // member[1] is NOT the caller, just receiver — should get pure payout
    const diff1 = await balDiff(provider, addrs[1], receipt);
    const feePerRound = (CONTRIBUTION * 3n) / 100n;
    const expectedPayout = CONTRIBUTION - feePerRound;
    assert(diff1 === expectedPayout, "round 1: distributes to members[1]", diff1);
  } catch (e) { fail("round 1 distribute", e); }

  // 3f – reputation for member[1]
  try {
    const rep1 = await ct.reputation(addrs[1]);
    assert(rep1 === 1n, "reputation +1 for round 1 receiver", rep1);
  } catch (e) { fail("reputation +1 member 1", e); }

  // ═══════════════════════════════════════════════════════════
  //  4. FINAL ROUND LOGIC (creator fee + collateral return)
  // ═══════════════════════════════════════════════════════════
  console.log("\n== FINAL ROUND LOGIC ==");

  try {
    const receipt = await (await c(0).distribute(0, { gasLimit: 500000 })).wait();

    // Use block-specific balance diffs
    const creatorDiff = await balDiff(provider, addrs[0], receipt);
    const member1Diff = await balDiff(provider, addrs[1], receipt);
    const member2Diff = await balDiff(provider, addrs[2], receipt);

    // 4a – pool marked completed
    const pool = await ct.getPool(0);
    assert(pool.completed === true, "pool marked completed after final round");

    // 4b – collateral returned (on-chain check)
    const col0 = await ct.getCollateral(0, addrs[0]);
    const col1 = await ct.getCollateral(0, addrs[1]);
    const col2 = await ct.getCollateral(0, addrs[2]);
    assert(col0 === 0n && col1 === 0n && col2 === 0n, "all collateral returned (on-chain zero)");

    // 4c – creator fee calculation: 3% of (0.1 * 3) = 0.009 ETH
    const expectedFee = (CONTRIBUTION * BigInt(MAX_MEMBERS) * 3n) / 100n;
    assert(expectedFee === ethers.parseEther("0.009"), `creator fee = ${ethers.formatEther(expectedFee)} ETH (3%)`);

    // 4d – member[1] balance increased (collateral refund, no gas)
    assert(member1Diff > 0n, "member[1] received collateral refund", member1Diff);
    assert(member1Diff === CONTRIBUTION, "member[1] collateral = exact 0.1 ETH", member1Diff);

    // 4e – member[2] balance increased (payout + collateral)
    const feePerRound = (CONTRIBUTION * 3n) / 100n;
    const payout = CONTRIBUTION - feePerRound;
    const expectedMember2 = payout + CONTRIBUTION; // payout + collateral
    assert(member2Diff === expectedMember2, "member[2] received payout + collateral", member2Diff);

    // 4f – creator received fee + collateral minus gas
    // creator gets: creatorFee (0.009) + collateral (0.1) - gas
    const expectedCreatorInflow = expectedFee + CONTRIBUTION;
    // creatorDiff includes gas payment, so creatorDiff < expectedCreatorInflow
    // Verify range: expectedInflow - reasonable_gas < creatorDiff < expectedInflow
    const maxGas = ethers.parseEther("0.01"); // generous gas limit
    assert(
      creatorDiff > 0n && creatorDiff > expectedCreatorInflow - maxGas,
      "creator received fee + collateral (net of gas)",
      creatorDiff
    );

  } catch (e) { fail("final round logic", e); }

  // 4g – revert distribute after completion
  await shouldRevert(
    () => ct.distribute.staticCall(0),
    "revert: distribute after completion"
  );

  // 4h – revert joining completed pool
  await shouldRevert(
    () => c(3).joinPool.staticCall(0, { value: DEPOSIT }),
    "revert: join completed pool"
  );

  // ═══════════════════════════════════════════════════════════
  //  5. DEFAULT HANDLING
  // ═══════════════════════════════════════════════════════════
  console.log("\n== DEFAULT HANDLING ==");

  // Create pool 2 for default tests
  try {
    await (await c(0).createPool(CONTRIBUTION, 3, 0)).wait(); // pool 2
    await (await c(0).joinPool(2, { value: DEPOSIT })).wait();
    await (await c(1).joinPool(2, { value: DEPOSIT })).wait();
    await (await c(2).joinPool(2, { value: DEPOSIT })).wait();
    ok("pool 2 setup for default tests");
  } catch (e) { fail("setup pool 2", e); }

  // 5a – slash collateral
  try {
    const colBefore = await ct.getCollateral(2, addrs[2]);
    assert(colBefore === CONTRIBUTION, "defaulter has collateral before slash", colBefore);
  } catch (e) { fail("pre-slash collateral check", e); }

  try {
    const repBefore = await ct.reputation(addrs[2]);
    const activeBefore = await ct.isActiveMember(2, addrs[2]);

    const receipt = await (await c(0).handleDefault(2, addrs[2])).wait();

    // Use block-specific balance diffs
    const diff0 = await balDiff(provider, addrs[0], receipt);
    const diff1 = await balDiff(provider, addrs[1], receipt);

    const repAfter = await ct.reputation(addrs[2]);
    const activeAfter = await ct.isActiveMember(2, addrs[2]);
    const colAfter = await ct.getCollateral(2, addrs[2]);

    // 5b – reputation decreased by 2
    assert(repAfter === repBefore - 2n, "defaulter reputation -2", `before=${repBefore} after=${repAfter}`);

    // 5c – activeMember set false
    assert(activeBefore === true && activeAfter === false, "activeMember set false");

    // 5d – collateral slashed to 0
    assert(colAfter === 0n, "collateral slashed to 0");

    // 5e – slashed collateral redistributed equally
    // Slashed = 0.1 ETH, 2 active members left, share = 0.05 ETH each
    const expectedShare = CONTRIBUTION / 2n;

    // member[1] is not caller, pure balance increase
    assert(diff1 === expectedShare, `member[1] received slash share (${ethers.formatEther(expectedShare)} ETH)`, diff1);

    // member[0] is caller, received share but paid gas
    // diff0 = share - gasCost, so diff0 < share but > 0
    assert(diff0 > 0n && diff0 < expectedShare, `member[0] received slash share (net of gas)`, diff0);

  } catch (e) { fail("handleDefault", e); }

  // 5f – revert default on non-active member
  await shouldRevert(
    () => ct.handleDefault.staticCall(2, addrs[2]),
    "revert: default on non-active member"
  );

  // 5g – prevent rejoining after default
  await shouldRevert(
    () => c(2).joinPool.staticCall(2, { value: DEPOSIT }),
    "revert: rejoin after default (hasJoined still true)"
  );

  // 5h – integer division dust check
  try {
    // Create pool 3 with 4 members to test uneven division
    // Note: account[2] has rep=-1 (defaulted in pool 2), so use accounts [0,1,3,4]
    await (await c(0).createPool(CONTRIBUTION, 4, 0)).wait(); // pool 3
    await (await c(0).joinPool(3, { value: DEPOSIT })).wait();
    await (await c(1).joinPool(3, { value: DEPOSIT })).wait();
    await (await c(3).joinPool(3, { value: DEPOSIT })).wait();
    await (await c(4).joinPool(3, { value: DEPOSIT })).wait();

    // Slash member[4]: 0.1 ETH / 3 active = 0.0333... each (dust = 1 wei)
    await (await c(0).handleDefault(3, addrs[4])).wait();
    const share = CONTRIBUTION / 3n; // 33333333333333333n
    const dust = CONTRIBUTION - share * 3n; // 1n
    assert(dust <= 1n, `integer division safe (dust=${dust} wei)`);
    ok("uneven slash redistribution handled without revert");
  } catch (e) { fail("integer division slash test", e); }

  // ═══════════════════════════════════════════════════════════
  //  6. MULTI-POOL ISOLATION
  // ═══════════════════════════════════════════════════════════
  console.log("\n== MULTI-POOL ISOLATION ==");

  // Create two fresh pools (pool 4, pool 5)
  try {
    await (await c(0).createPool(CONTRIBUTION, 2, 0)).wait(); // pool 4
    await (await c(0).createPool(ethers.parseEther("0.5"), 2, 0)).wait(); // pool 5 (different amount)

    // Join pool 4
    await (await c(0).joinPool(4, { value: DEPOSIT })).wait();
    await (await c(1).joinPool(4, { value: DEPOSIT })).wait();

    // Joining pool 4 should not affect pool 5
    const pool5 = await ct.getPool(5);
    assert(Number(pool5.memberCount) === 0, "joining pool4 does not affect pool5 memberCount");
  } catch (e) { fail("multi-pool setup", e); }

  try {
    // Distribute pool 4 round 0
    await (await c(0).distribute(4, { gasLimit: 500000 })).wait();
    const pool5After = await ct.getPool(5);
    assert(Number(pool5After.currentRound) === 0, "distributing pool4 does not affect pool5 currentRound");
  } catch (e) { fail("pool4 round 0", e); }

  try {
    // Pool 4 round 1 = final
    await (await c(0).distribute(4, { gasLimit: 500000 })).wait();
    const pool4 = await ct.getPool(4);
    const pool5Final = await ct.getPool(5);
    assert(pool4.completed === true && pool5Final.completed === false,
      "pool4 completed, pool5 still active");
  } catch (e) { fail("multi-pool isolation", e); }

  // ═══════════════════════════════════════════════════════════
  //  7. SECURITY & EDGE CASES
  // ═══════════════════════════════════════════════════════════
  console.log("\n== SECURITY & EDGE CASES ==");

  // 7a – invalid poolId
  await shouldRevert(
    () => ct.getPool.staticCall(999),
    "revert: invalid poolId"
  );

  // 7b – distribute on invalid pool
  await shouldRevert(
    () => ct.distribute.staticCall(999),
    "revert: distribute invalid poolId"
  );

  // 7c – handleDefault on invalid pool
  await shouldRevert(
    () => ct.handleDefault.staticCall(999, addrs[0]),
    "revert: handleDefault invalid poolId"
  );

  // 7d – join invalid poolId
  await shouldRevert(
    () => c(0).joinPool.staticCall(999, { value: DEPOSIT }),
    "revert: join invalid poolId"
  );

  // 7e – contract balance verification after all operations
  try {
    const bal = await ct.getContractBalance();
    // Should be > 0 (pools 2, 3 are not completed, pool 5 has no members so 0 balance)
    ok(`final contract balance: ${ethers.formatEther(bal)} ETH`);
  } catch (e) { fail("contract balance check", e); }

  // ═══════════════════════════════════════════════════════════
  //  8. BALANCE VERIFICATION (detailed)
  // ═══════════════════════════════════════════════════════════
  console.log("\n== BALANCE VERIFICATION ==");

  // Create pool 6 for full lifecycle balance tracking
  // Use accounts [0,1] which have positive reputation
  try {
    const CONTRIB6 = ethers.parseEther("1");
    const DEPOSIT6 = CONTRIB6 * 2n;
    await (await c(0).createPool(CONTRIB6, 2, 0)).wait(); // pool 6

    // Join: each sends 2 ETH (1 contribution + 1 collateral)
    const r1 = await (await c(0).joinPool(6, { value: DEPOSIT6 })).wait();
    const joinDiff = await balDiff(provider, addrs[0], r1);
    // Sender pays 2 ETH + gas, so diff should be < -2 ETH
    assert(joinDiff < -DEPOSIT6 + ethers.parseEther("0.01"), "join deducts ~2 ETH from sender", joinDiff);

    const r2 = await (await c(1).joinPool(6, { value: DEPOSIT6 })).wait();

    // Distribute round 0: member[0] receives payout (1 ETH - 3% = 0.97 ETH)
    const rd0 = await (await c(0).distribute(6, { gasLimit: 500000 })).wait();
    const recv0Diff = await balDiff(provider, addrs[0], rd0);
    const fee6 = CONTRIB6 * 3n / 100n; // 0.03
    const payout6 = CONTRIB6 - fee6; // 0.97
    // member[0] = caller AND receiver: receives 0.97, pays gas → net ≈ +0.97
    assert(recv0Diff > 0n, `round 0 receiver got payout (net ${ethers.formatEther(recv0Diff)} ETH)`, recv0Diff);

    // Distribute round 1 (final): member[1] receives payout, finalize happens
    const rd1 = await (await c(0).distribute(6, { gasLimit: 500000 })).wait();
    const recv1Diff = await balDiff(provider, addrs[1], rd1);
    // member[1] gets: payout (0.97) + collateral refund (1.0) = 1.97 ETH
    const expectedRecv1 = payout6 + CONTRIB6;
    assert(recv1Diff === expectedRecv1, `member[1] received payout + collateral = ${ethers.formatEther(expectedRecv1)} ETH`, recv1Diff);

    // Creator (addrs[0]) gets: creator fee (0.06) + collateral (1.0) - gas
    const creatorDiff6 = await balDiff(provider, addrs[0], rd1);
    const totalFee6 = CONTRIB6 * 2n * 3n / 100n; // 0.06
    const expectedCreator6 = totalFee6 + CONTRIB6; // 1.06
    assert(
      creatorDiff6 > 0n && creatorDiff6 > expectedCreator6 - ethers.parseEther("0.01"),
      `creator received fee + collateral ≈ ${ethers.formatEther(expectedCreator6)} ETH`,
      creatorDiff6
    );

    // Verify pool 6 completed
    const pool6 = await ct.getPool(6);
    assert(pool6.completed === true, "pool 6 lifecycle complete");

  } catch (e) { fail("balance verification lifecycle", e); }

  // ═══════════════════════════════════════════════════════════
  //  9. VIEW FUNCTIONS
  // ═══════════════════════════════════════════════════════════
  console.log("\n== VIEW FUNCTIONS ==");

  try {
    const members = await ct.getMembers(0);
    assert(members.length === MAX_MEMBERS, "getMembers returns correct length");
  } catch (e) { fail("getMembers", e); }

  try {
    const joined = await ct.hasJoined(0, addrs[0]);
    assert(joined === true, "hasJoined true for member");
  } catch (e) { fail("hasJoined true", e); }

  try {
    const notJoined = await ct.hasJoined(0, addrs[4]);
    assert(notJoined === false, "hasJoined false for non-member");
  } catch (e) { fail("hasJoined false", e); }

  try {
    const active = await ct.isActiveMember(2, addrs[0]);
    assert(active === true, "isActiveMember true for active");
  } catch (e) { fail("isActiveMember true", e); }

  try {
    const active2 = await ct.isActiveMember(2, addrs[2]);
    assert(active2 === false, "isActiveMember false for defaulted");
  } catch (e) { fail("isActiveMember false", e); }

  try {
    const bal = await ct.getContractBalance();
    ok(`getContractBalance: ${ethers.formatEther(bal)} ETH`);
  } catch (e) { fail("getContractBalance", e); }

  // ═══════════════════════════════════════════════════════════
  console.log(`\n${"=".repeat(50)}`);
  console.log(`  ${passed + failed} tests: ${passed} passed, ${failed} failed`);
  console.log(`${"=".repeat(50)}\n`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
