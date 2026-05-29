require('dotenv').config({ quiet: true });
const io = require('socket.io-client');

const SOCKET_URL = 'http://localhost:5001';
const SESSION_CODE = process.argv[2] || 'XI3T2P';
const NUM_PLAYERS = parseInt(process.argv[3] || '100', 10);
const CONCURRENCY = parseInt(process.argv[4] || '20', 10); // batch size

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const arabicNames = [
  'أحمد','محمد','علي','عمر','خالد','يوسف','إبراهيم','عبدالله','حسن','حسين',
  'فاطمة','عائشة','مريم','زينب','سارة','نور','رنا','لينا','دينا','هنا',
  'طارق','وليد','سامي','ماجد','نادر','بلال','كريم','ياسين','رامي','أنس',
  'منى','هدى','ريم','شيماء','أسماء','رهف','بشرى','إيمان','نهى','غادة',
];

function randomName(i) {
  const base = arabicNames[i % arabicNames.length];
  return `${base}_${i + 1}`;
}

async function connectPlayer(i, sessionCode) {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      forceNew: true,
      timeout: 8000,
      reconnection: false,
    });

    const timer = setTimeout(() => {
      socket.disconnect();
      resolve({ i, success: false, error: 'timeout', ms: Date.now() - start });
    }, 8000);

    socket.on('connect_error', (err) => {
      clearTimeout(timer);
      socket.disconnect();
      resolve({ i, success: false, error: err.message, ms: Date.now() - start });
    });

    socket.on('connect', () => {
      socket.emit('player:join-session',
        { sessionCode, playerName: randomName(i) },
        (ack) => {
          clearTimeout(timer);
          const ms = Date.now() - start;
          socket.disconnect();
          resolve({ i, success: !!ack?.success, playerId: ack?.playerId, ms, error: ack?.message });
        }
      );
    });
  });
}

async function runBatch(indices, sessionCode) {
  return Promise.all(indices.map(i => connectPlayer(i, sessionCode)));
}

async function main() {
  console.log(`\n🚀 Load Test: ${NUM_PLAYERS} players → session ${SESSION_CODE}`);
  console.log(`   Concurrency: ${CONCURRENCY} per batch\n`);

  const results = [];
  const batches = [];

  for (let start = 0; start < NUM_PLAYERS; start += CONCURRENCY) {
    const end = Math.min(start + CONCURRENCY, NUM_PLAYERS);
    batches.push(Array.from({ length: end - start }, (_, j) => start + j));
  }

  const globalStart = Date.now();

  for (let b = 0; b < batches.length; b++) {
    const batch = batches[b];
    process.stdout.write(`  Batch ${b + 1}/${batches.length} (players ${batch[0]+1}–${batch[batch.length-1]+1})... `);
    const batchResults = await runBatch(batch, SESSION_CODE);
    results.push(...batchResults);
    const ok = batchResults.filter(r => r.success).length;
    const avgMs = Math.round(batchResults.reduce((s, r) => s + r.ms, 0) / batchResults.length);
    console.log(`✅ ${ok}/${batch.length} joined  avg ${avgMs}ms`);
    // Small pause between batches to avoid overwhelming the server
    if (b < batches.length - 1) await sleep(50);
  }

  const totalMs = Date.now() - globalStart;
  const successes = results.filter(r => r.success);
  const failures = results.filter(r => !r.success);
  const latencies = results.map(r => r.ms).sort((a, b) => a - b);
  const p50 = latencies[Math.floor(latencies.length * 0.50)];
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  const p99 = latencies[Math.floor(latencies.length * 0.99)];

  console.log('\n─────────────────────────────────');
  console.log('📊 RESULTS');
  console.log('─────────────────────────────────');
  console.log(`  Players attempted : ${NUM_PLAYERS}`);
  console.log(`  ✅ Successful joins: ${successes.length} (${((successes.length/NUM_PLAYERS)*100).toFixed(1)}%)`);
  console.log(`  ❌ Failed joins    : ${failures.length}`);
  console.log(`  ⏱  Total wall time : ${totalMs}ms`);
  console.log(`  📈 Latency P50     : ${p50}ms`);
  console.log(`  📈 Latency P95     : ${p95}ms`);
  console.log(`  📈 Latency P99     : ${p99}ms`);

  if (failures.length > 0) {
    console.log('\n  Failure breakdown:');
    const errCounts = {};
    failures.forEach(f => { errCounts[f.error] = (errCounts[f.error] || 0) + 1; });
    Object.entries(errCounts).forEach(([e, c]) => console.log(`    ${c}× ${e}`));
  }

  console.log('─────────────────────────────────\n');

  if (successes.length === NUM_PLAYERS) {
    console.log('🎉 ALL 100 PLAYERS JOINED SUCCESSFULLY!');
  } else if (successes.length >= NUM_PLAYERS * 0.95) {
    console.log('✅ PASS — ≥95% success rate');
  } else {
    console.log('❌ FAIL — too many connection errors');
  }

  process.exit(failures.length > NUM_PLAYERS * 0.05 ? 1 : 0);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
