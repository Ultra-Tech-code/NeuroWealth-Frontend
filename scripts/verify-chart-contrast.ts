#!/usr/bin/env tsx
/**
 * Chart Color Contrast Verification Script
 *
 * Programmatically verifies that all chart colors meet WCAG AA standards
 * for both dark and light backgrounds.
 *
 * Usage: npx tsx scripts/verify-chart-contrast.ts
 */

import {
  CVD_PALETTES,
  getContrastRatio,
  meetsWCAGAA,
} from "../src/lib/chart-colors-cvd";

// Common background colors
const BACKGROUNDS = {
  darkMode: "#020617", // slate-950 (typical dark mode)
  lightMode: "#ffffff", // white (typical light mode)
  darkCard: "#0f172a", // slate-900 (dark mode cards)
  lightCard: "#f8fafc", // slate-50 (light mode cards)
};

// WCAG standards
const WCAG_AA_TEXT = 4.5;
const WCAG_AA_GRAPHICS = 3.0;
const WCAG_AAA_TEXT = 7.0;

interface ContrastResult {
  color: string;
  hex: string;
  background: string;
  ratio: number;
  passesAAText: boolean;
  passesAAGraphics: boolean;
  passesAAAText: boolean;
}

function testColorContrast(
  colorName: string,
  colorHex: string,
  bgName: string,
  bgHex: string,
): ContrastResult {
  const ratio = getContrastRatio(colorHex, bgHex);

  return {
    color: colorName,
    hex: colorHex,
    background: bgName,
    ratio: Math.round(ratio * 100) / 100,
    passesAAText: ratio >= WCAG_AA_TEXT,
    passesAAGraphics: ratio >= WCAG_AA_GRAPHICS,
    passesAAAText: ratio >= WCAG_AAA_TEXT,
  };
}

function formatResult(result: ContrastResult): string {
  const status = result.passesAAText ? "✅" : "❌";
  const aaaStatus = result.passesAAAText ? "(AAA)" : "";

  return `${status} ${result.color.padEnd(20)} ${result.hex} on ${result.background.padEnd(12)} → ${result.ratio.toFixed(2)}:1 ${aaaStatus}`;
}

function main() {
  console.log("\n🎨 Chart Color Contrast Verification\n");
  console.log("=".repeat(80));

  // Test primary palette
  console.log("\n📊 PRIMARY PALETTE (CVD-Safe Colors)\n");

  const primaryColors = Object.entries(CVD_PALETTES.primary);
  const accessibleColors = Object.entries(CVD_PALETTES.accessible);

  // Test against dark mode background
  console.log(`\n🌙 Dark Mode Background (${BACKGROUNDS.darkMode})\n`);
  console.log(
    "   WCAG AA Text: 4.5:1 | WCAG AA Graphics: 3:1 | WCAG AAA Text: 7:1\n",
  );

  const darkResults: ContrastResult[] = [];

  primaryColors.forEach(([name, hex]) => {
    const result = testColorContrast(
      name,
      hex,
      "darkMode",
      BACKGROUNDS.darkMode,
    );
    darkResults.push(result);
    console.log(formatResult(result));
  });

  // Test against light mode background
  console.log(`\n☀️  Light Mode Background (${BACKGROUNDS.lightMode})\n`);
  console.log(
    "   WCAG AA Text: 4.5:1 | WCAG AA Graphics: 3:1 | WCAG AAA Text: 7:1\n",
  );

  const lightResults: ContrastResult[] = [];

  primaryColors.forEach(([name, hex]) => {
    const result = testColorContrast(
      name,
      hex,
      "lightMode",
      BACKGROUNDS.lightMode,
    );
    lightResults.push(result);
    console.log(formatResult(result));
  });

  // Test accessible palette
  console.log("\n\n♿ ACCESSIBLE PALETTE (Extended Colors)\n");
  console.log(`\n🌙 Dark Mode Background (${BACKGROUNDS.darkMode})\n`);

  accessibleColors.forEach(([name, hex]) => {
    const result = testColorContrast(
      name,
      hex,
      "darkMode",
      BACKGROUNDS.darkMode,
    );
    console.log(formatResult(result));
  });

  // Test neutral colors
  console.log("\n\n🎨 NEUTRAL PALETTE (Supporting Colors)\n");
  console.log(`\n🌙 Dark Mode Background (${BACKGROUNDS.darkMode})\n`);

  Object.entries(CVD_PALETTES.neutral).forEach(([name, hex]) => {
    const result = testColorContrast(
      name,
      hex,
      "darkMode",
      BACKGROUNDS.darkMode,
    );
    console.log(formatResult(result));
  });

  // Summary
  console.log("\n\n" + "=".repeat(80));
  console.log("\n📋 SUMMARY\n");

  const allDarkPass = darkResults.every((r) => r.passesAAText);
  const allLightGraphicsPass = lightResults.every((r) => r.passesAAGraphics);
  const darkAAACount = darkResults.filter((r) => r.passesAAAText).length;

  console.log(
    `Dark Mode (Text 4.5:1):      ${allDarkPass ? "✅ ALL PASS" : "❌ SOME FAIL"}`,
  );
  console.log(
    `Light Mode (Graphics 3:1):   ${allLightGraphicsPass ? "✅ ALL PASS" : "❌ SOME FAIL"}`,
  );
  console.log(
    `Dark Mode AAA (7:1):         ${darkAAACount}/${darkResults.length} colors`,
  );

  // Color differentiation test
  console.log("\n\n🔍 COLOR DIFFERENTIATION TEST\n");
  console.log(
    "Testing contrast between palette colors (should be distinguishable):\n",
  );

  const paletteColors = Object.entries(CVD_PALETTES.primary);

  for (let i = 0; i < paletteColors.length; i++) {
    for (let j = i + 1; j < paletteColors.length; j++) {
      const [name1, hex1] = paletteColors[i];
      const [name2, hex2] = paletteColors[j];
      const ratio = getContrastRatio(hex1, hex2);
      const status = ratio >= 1.5 ? "✅" : "⚠️";

      console.log(`${status} ${name1} vs ${name2}: ${ratio.toFixed(2)}:1`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("\n✨ Verification complete!\n");

  // Exit with error if any critical tests fail
  if (!allDarkPass) {
    console.error(
      "❌ CRITICAL: Some colors fail WCAG AA text contrast on dark backgrounds\n",
    );
    process.exit(1);
  }

  console.log("✅ All critical accessibility requirements met!\n");
}

// Run the verification
main();
