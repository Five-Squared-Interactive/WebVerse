// Copyright (c) 2019-2026 Five Squared Interactive. All rights reserved.
//
// afterSign hook for electron-builder.
//
// Submits the signed Mac .app to Apple's notarization service and staples
// the resulting ticket. Runs automatically after electron-builder finishes
// code signing the launcher (which includes the nested Unity runtime).
//
// Required environment variables (set by the GitHub Actions workflow):
//   APPLE_ID                    - Apple Developer account email
//   APPLE_APP_SPECIFIC_PASSWORD - App-specific password from appleid.apple.com
//   APPLE_TEAM_ID               - 10-character Apple Developer Team ID
//
// If any of these are missing, notarization is skipped (useful for local dev
// builds where notarization is not desired).
 
const { notarize } = require('@electron/notarize');
const path = require('path');
 
exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
 
  // Only notarize Mac builds
  if (electronPlatformName !== 'darwin') {
    return;
  }
 
  const appleId = process.env.APPLE_ID;
  const appleIdPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD;
  const teamId = process.env.APPLE_TEAM_ID;
 
  // Skip notarization if credentials are not provided (e.g. local dev builds)
  if (!appleId || !appleIdPassword || !teamId) {
    console.log('Skipping notarization: APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, or APPLE_TEAM_ID not set');
    return;
  }
 
  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);
 
  console.log(`Notarizing ${appName}.app at ${appPath}`);
  console.log('This typically takes 2-15 minutes depending on Apple\'s queue...');
 
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
