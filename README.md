# WebVerse

Top-level WebVerse Desktop application.

## Description

This is the top-level WebVerse desktop application. It consists of an Electron front-end application, a lightweight WebGL runtime, Desktop runtime, and SteamVR runtime. It also includes a daemon application for facilitating communication between the front-end application and runtimes.

## Architecture

![WebVerse-Desktop-Application-Architecture](https://github.com/Five-Squared-Interactive/WebVerse/assets/16926525/b49cfd80-14e6-4987-83e0-67bd50041484)


## Supported Platforms

* Windows 10/11 with/without SteamVR

## Getting Started

### WebVerse Dependencies

* Windows 10 or Windows 11
* SteamVR (for VR support)

### Installing WebVerse

1. Download and extract the latest installer zip package from [Releases](https://github.com/Five-Squared-Interactive/WebVerse/releases)
2. Run the "WebVerse Setup [version].exe" program and follow the on-screen instructions

### Running WebVerse

Once WebVerse has been installed, simply run the "WebVerse.exe" program. WebVerse will automatically start the daemon program if it is not already running. WebVerse may take up to 1 minute to start for the first time.

## Developing

### Development Prerequisites


### Setup

1. Clone the repository and navigate to that directory:
   ```
   git clone https://github.com/Five-Squared-Interactive/WebVerse.git
   cd WebVerse
   ```

### Running and Building

1. Build the Daemon: From the top-level source code directory, navigate to  the `Daemon/` directory, install the NPM dependencies, and run the build script:
   ```
   cd Application
   npm install
   npm run build
   ```
   The built daemon will be located at build/webverse-daemon.exe.

2. Download the Runtimes: From the top-level source code directory, navigate to the `Runtimes/` directory, install the NPM dependencies, and run the download script:
   ```
   cd Runtimes
   npm install
   npm run start
   ```

3. Run WebVerse: From the top-level source code directory, navigate to the `Application/` directory, install the NPM dependencies, and run the application:
   ```
   cd Application
   npm install
   npm start
   ```

5. Build the WebVerse application package: From the top-level source code directory, navigate to the `Application/` directory, install the NPM dependencies, and run the build script:
   ```
   cd Application
   npm install
   npm run dist
   ```

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Email - fivesquaredtechnologies@gmail.com
