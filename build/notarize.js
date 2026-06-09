// Copyright (c) 2019-2026 Five Squared Interactive. All rights reserved.
//
// electron-builder hooks for the WebVerse launcher.
//
// Two responsibilities:
//   1. afterPack: temporarily relocate .wv-settings out of the app bundle
//      so codesign doesn't try to sign it (it lives in Contents/ rather
//      than Contents/Resources/, which Apple rejects for signed apps).
//   2. afterSign: restore .wv-settings to its original location inside
//      the bundle, then submit the app to Apple's notarization service.

const { notarize } = require('@electron/notarize');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Path where we temporarily stash .wv-settings during signing.
function getStashPath(context) {
  return path.join(os.tmpdir(), `wv-settings-stash-${context.packager.appInfo.productFilename}`);
}

// The location of .wv-settings inside the packaged .app bundle.
function getWvSettingsPath(context) {
  const appName = context.packager.appInfo.productFilename;
  return path.join(context.appOutDir, `${appName}.app`, 'Contents', '.wv-settings');
}

exports.afterPack = async function (context) {
  if (context.electronPlatformName !== 'darwin') return;

  const wvSettingsPath = getWvSettingsPath(context);
  const stashPath = getStashPath(context);

  if (fs.existsSync(wvSettingsPath)) {
    console.log(`afterPack: moving .wv-settings out of bundle for signing`);
    console.log(`  from: ${wvSettingsPath}`);
    console.log(`  to:   ${stashPath}`);
    fs.renameSync(wvSettingsPath, stashPath);
  } else {
    console.log(`afterPack: .wv-settings not found at ${wvSettingsPath}, skipping`);
  }
};

exports.afterSign = async function (context) {
  if (context.electronPlatformName !== 'darwin') return;

  // First, restore .wv-settings to its original location
  const wvSettingsPath = getWvSettingsPath(context);
  const stashPath = getStashPath(context);

  if (fs.existsSync(stashPath)) {
    console.log(`afterSign: restoring .wv-settings to bundle`);
    console.log(`  from: ${stashPath}`);
    console.log(`  to:   ${wvSettingsPath}`);
    fs.renameSync(stashPath, wvSettingsPath);
  }

  // Then, submit for notarization
  const appleId = process.env.APPLE_ID;
  const appleIdPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD;
  const teamId = process.env.APPLE_TEAM_ID;

  if (!appleId || !appleIdPassword || !teamId) {
    console.log('Skipping notarization: APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, or APPLE_TEAM_ID not set');
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(context.appOutDir, `${appName}.app`);

  console.log(`Notarizing ${appName}.app at ${appPath}`);
  console.log(`This typically takes 2-15 minutes depending on Apple's queue...`);

  try {
    await notarize({
      tool: 'notarytool',
      appPath: appPath,
      appleId: appleId,
      appleIdPassword: appleIdPassword,
      teamId: teamId,
    });
    console.log(`Notarization complete for ${appName}.app`);
  } catch (error) {
    console.error('Notarization failed:', error);
    throw error;
  }
};

// Default export kept for backwards-compatibility with electron-builder's
// older convention; some versions look for `default` even when using named hooks.
exports.default = exports.afterSign;