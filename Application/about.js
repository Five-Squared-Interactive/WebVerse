let versionDiv = document.getElementById("version-info");
if (versionDiv == null) {
    console.LogError("Unable to find version div.");
}
else {
    versionDiv.innerText = "WebVerse Version: " + versionString;
}