#!/usr/bin/env node
'use strict';

/**
 * portscout — scanner.js
 * Lightweight CLI tool to scan for open TCP ports on a host.
 */

const net = require('net');

const WELL_KNOWN_PORTS = {
  21: 'FTP', 22: 'SSH', 23: 'Telnet', 25: 'SMTP', 53: 'DNS',
  80: 'HTTP', 110: 'POP3', 143: 'IMAP', 443: 'HTTPS', 465: 'SMTPS',
  587: 'SMTP', 993: 'IMAPS', 995: 'POP3S', 3000: 'Dev Server',
  3306: 'MySQL', 5432: 'PostgreSQL', 5672: 'RabbitMQ', 6379: 'Redis',
  8080: 'HTTP Alt', 8443: 'HTTPS Alt', 9200: 'Elasticsearch',
  27017: 'MongoDB', 27018: 'MongoDB', 5000: 'Flask/Dev',
  4200: 'Angular', 8000: 'Django/Dev', 9000: 'PHP-FPM',
};

const COMMON_PORTS = [
  21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587,
  993, 995, 3000, 3306, 5000, 5432, 6379, 8080, 8443,
  8000, 9000, 9200, 27017,
];

let lastScanResults = [];

function checkPort(host, port, timeout = 500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = 'closed';

    socket.setTimeout(timeout);
    socket.on('connect', () => { status = 'open'; socket.destroy(); });
    socket.on('timeout', () => { socket.destroy(); });
    socket.on('error', () => { socket.destroy(); });
    socket.on('close', () => resolve({ port, status }));

    socket.connect(port, host);
  });
}

function parseRange(rangeStr) {
  const parts = rangeStr.split('-');
  if (parts.length !== 2) throw new Error(`Invalid range format: "${rangeStr}". Use start-end (e.g. 1-1024)`);
  const start = parseInt(parts[0], 10);
  const end = parseInt(parts[1], 10);
  if (isNaN(start) || isNaN(end) || start < 1 || end > 65535 || start > end) {
    throw new Error(`Invalid port range: ${rangeStr}`);
  }
  const ports = [];
  for (let p = start; p <= end; p++) ports.push(p);
  return ports;
}

async function scanHost(host, ports, concurrency = 50) {
  console.log(`\n🔭 Scanning \x1b[33m${host}\x1b[0m — ${ports.length} port(s)\n`);
  const startTime = Date.now();
  const openPorts = [];
  const results = [];

  // Chunk into batches for concurrency control
  for (let i = 0; i < ports.length; i += concurrency) {
    const batch = ports.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map((p) => checkPort(host, p)));
    batchResults.forEach((r) => {
      if (r.status === 'open') {
        openPorts.push(r.port);
        results.push(r);
      }
    });
    // Progress indicator for large scans
    if (ports.length > 100) {
      process.stdout.write(`\r  Scanned ${Math.min(i + concurrency, ports.length)}/${ports.length} ports...`);
    }
  }

  if (ports.length > 100) process.stdout.write('\n');

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  lastScanResults = results.map((r) => ({
    port: r.port,
    status: r.status,
    service: WELL_KNOWN_PORTS[r.port] || 'Unknown',
    host,
  }));

  if (openPorts.length === 0) {
    console.log(`  \x1b[33mNo open ports found.\x1b[0m`);
  } else {
    console.log(`  \x1b[32m${openPorts.length} open port(s) found:\x1b[0m\n`);
    console.log(`  ${'PORT'.padEnd(8)} ${'STATE'.padEnd(8)} SERVICE`);
    console.log(`  ${'─'.repeat(30)}`);
    lastScanResults.forEach((r) => {
      const color = r.status === 'open' ? '\x1b[32m' : '\x1b[31m';
      const service = r.service !== 'Unknown' ? `\x1b[90m${r.service}\x1b[0m` : '';
      console.log(`  ${color}${String(r.port).padEnd(8)}\x1b[0m ${'open'.padEnd(8)} ${service}`);
    });
  }

  console.log(`\n  ⏱  Completed in ${elapsed}s\n`);
}

function showReport(format) {
  if (lastScanResults.length === 0) {
    console.log('\n  No scan results. Run a scan first.\n');
    return;
  }
  if (format === 'json') {
    console.log(JSON.stringify(lastScanResults, null, 2));
  } else {
    lastScanResults.forEach((r) => console.log(`${r.host}:${r.port} ${r.status} (${r.service})`));
  }
}

function showHelp() {
  console.log(`
portscout — TCP Port Scanner

USAGE:
  node scanner.js scan <host>
  node scanner.js scan <host> --range <start-end>
  node scanner.js report [--format json]

EXAMPLES:
  node scanner.js scan localhost
  node scanner.js scan 192.168.1.1 --range 1-1024
  node scanner.js scan localhost --range 3000-9000
  node scanner.js report --format json
`);
}

const args = process.argv.slice(2);
const cmd = args[0];

if (!cmd || cmd === '--help') { showHelp(); process.exit(0); }

if (cmd === 'scan') {
  const host = args[1];
  if (!host) { console.error('Error: Please provide a host. e.g. node scanner.js scan localhost'); process.exit(1); }
  const rangeIndex = args.indexOf('--range');
  let ports = COMMON_PORTS;
  if (rangeIndex !== -1 && args[rangeIndex + 1]) {
    try { ports = parseRange(args[rangeIndex + 1]); }
    catch (e) { console.error(`\x1b[31mError:\x1b[0m ${e.message}`); process.exit(1); }
  }
  scanHost(host, ports);
} else if (cmd === 'report') {
  const formatIndex = args.indexOf('--format');
  showReport(formatIndex !== -1 ? args[formatIndex + 1] : 'text');
} else {
  console.error(`Unknown command: ${cmd}`);
  showHelp();
  process.exit(1);
}
