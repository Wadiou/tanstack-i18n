#!/usr/bin/env node
/**
 * examples-pin.mjs
 *
 * Replaces any existing version of a package with a concrete npm
 * version across every example package.json in this monorepo.
 *
 * Usage:
 *   pnpm examples:pin --package <name> --version <semver>
 *   pnpm examples:pin --package @wadiou/tanstack-i18n --version 1.2.3
 *   pnpm examples:pin --package @wadiou/tanstack-i18n --version 1.2.3 --dry-run
 *
 * Required flags:
 *   --package   npm package name to replace (e.g. @wadiou/tanstack-i18n)
 *   --version   target version; a ^ prefix is added automatically if absent
 *
 * Optional flags:
 *   --dry-run   print what would change without writing any files
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

function getFlag(flag) {
	const idx = args.indexOf(flag);
	return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const dryRun = args.includes("--dry-run");
const packageName = getFlag("--package");
const rawVersion = getFlag("--version");

if (!packageName || !rawVersion) {
	console.error(
		"\n❌  Missing required flags.\n" +
			"    Usage: node scripts/pin-examples.mjs --package <name> --version <semver> [--dry-run]\n",
	);
	process.exit(1);
}

// Strip leading ^ or ~ so we can normalise
const versionRange = `^${rawVersion.replace(/^[\^~]/, "")}`;

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

/** Directory names to skip during recursive search. */
const SKIP_DIRS = ["node_modules", ".turbo", ".output", "dist"];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const repoRoot = join(fileURLToPath(import.meta.url), "..", "..");
const examplesDir = join(repoRoot, "examples");

/** Recursively collect package.json files, skipping ignored dirs. */
function findPackageJsonFiles(dir) {
	const results = [];
	for (const entry of readdirSync(dir)) {
		if (SKIP_DIRS.includes(entry)) continue;
		const full = join(dir, entry);
		const stat = statSync(full);
		if (stat.isDirectory()) {
			results.push(...findPackageJsonFiles(full));
		} else if (entry === "package.json") {
			results.push(full);
		}
	}
	return results;
}

/** Return true if the parsed JSON contains the target package in any dep section. */
function hasPackageRef(parsed) {
	return (
		packageName in (parsed?.dependencies ?? {}) ||
		packageName in (parsed?.devDependencies ?? {})
	);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
console.log(
	`\n📦  pin-examples — ${packageName}@${versionRange}${dryRun ? "  [DRY RUN]" : ""}\n`,
);

const files = findPackageJsonFiles(examplesDir);
let changed = 0;
let skipped = 0;

for (const filePath of files) {
	const rel = relative(repoRoot, filePath);
	const raw = readFileSync(filePath, "utf8");

	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		console.warn(`  ⚠  Could not parse ${rel} — skipping`);
		skipped++;
		continue;
	}

	if (!hasPackageRef(parsed)) {
		skipped++;
		continue;
	}

	// Replace in both dependency sections (any existing value)
	for (const section of ["dependencies", "devDependencies"]) {
		if (packageName in (parsed[section] ?? {})) {
			parsed[section][packageName] = versionRange;
		}
	}

	// Preserve trailing newline and detect indentation from original
	const indentMatch = raw.match(/^(\t| {2,4})/m);
	const indent = indentMatch ? indentMatch[1] : "  ";
	const updated = JSON.stringify(parsed, null, indent) + "\n";

	if (dryRun) {
		console.log(`  📝  [dry-run] would update: ${rel}`);
	} else {
		writeFileSync(filePath, updated, "utf8");
		console.log(`  ✅  updated: ${rel}`);
	}
	changed++;
}

console.log(
	`\n${dryRun ? "Would have updated" : "Updated"} ${changed} file(s), skipped ${skipped}.\n`,
);
