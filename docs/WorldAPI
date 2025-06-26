# World API Documentation

## Overview

This document provides comprehensive API documentation for all public classes, methods, fields, and properties in the World API.

The APIs are organized into the following categories:
- [World Types](#world-types) - Basic data structures and primitives
- [Entity APIs](#entity-apis) - Entity creation and manipulation
- [Networking APIs](#networking-apis) - HTTP, MQTT, and WebSocket communication
- [Environment APIs](#environment-apis) - Environment and lighting control
- [Input APIs](#input-apis) - User input handling
- [Data APIs](#data-apis) - Asynchronous data operations
- [VOS Synchronization APIs](#vos-synchronization-apis) - Virtual Operating System synchronization
- [World Browser Utilities](#world-browser-utilities) - General utility functions

## World Types

World Types provide fundamental data structures used throughout the WebVerse APIs.

### Vector3

3-dimensional vector class for representing positions, directions, and scales.

#### Properties
- `x` (float) - X component of the vector
- `y` (float) - Y component of the vector  
- `z` (float) - Z component of the vector
- `magnitude` (float, read-only) - The length/magnitude of the vector
- `squaredMagnitude` (float, read-only) - The squared magnitude (more efficient than magnitude)

#### Static Properties
- `zero` (Vector3, read-only) - Vector3(0, 0, 0)
- `one` (Vector3, read-only) - Vector3(1, 1, 1)
- `up` (Vector3, read-only) - Vector3(0, 1, 0)
- `down` (Vector3, read-only) - Vector3(0, -1, 0)
- `left` (Vector3, read-only) - Vector3(-1, 0, 0)
- `right` (Vector3, read-only) - Vector3(1, 0, 0)
- `forward` (Vector3, read-only) - Vector3(0, 0, 1)
- `back` (Vector3, read-only) - Vector3(0, 0, -1)

#### Constructor
```javascript
// Create a new Vector3
var pos = new Vector3(x, y, z);
var defaultPos = new Vector3(); // Creates (0, 0, 0)
```

#### Methods
- `normalized()` - Returns a normalized copy of this vector
- `toString()` - Returns string representation

#### Static Methods
- `Distance(a, b)` - Calculate distance between two Vector3 points
- `Dot(a, b)` - Calculate dot product of two vectors
- `Cross(a, b)` - Calculate cross product of two vectors
- `Lerp(a, b, t)` - Linear interpolation between two vectors
- `Slerp(a, b, t)` - Spherical linear interpolation between two vectors

#### Usage Examples
```javascript
// Create vectors
var position = new Vector3(10, 5, 0);
var target = new Vector3(0, 0, 0);

// Calculate distance
var distance = Vector3.Distance(position, target);

// Move towards target
var direction = Vector3.Cross(target, position).normalized();
var newPosition = Vector3.Lerp(position, target, 0.1);
```

### Vector2

2-dimensional vector class for 2D coordinates and directions.

#### Properties
- `x` (float) - X component
- `y` (float) - Y component
- `magnitude` (float, read-only) - Vector magnitude
- `squaredMagnitude` (float, read-only) - Squared magnitude

#### Static Properties
- `zero`, `one`, `up`, `down`, `left`, `right` - Standard direction vectors

#### Constructor
```javascript
var point = new Vector2(x, y);
```

### Vector4

4-dimensional vector class.

#### Properties
- `x`, `y`, `z`, `w` (float) - Vector components
- `magnitude` (float, read-only) - Vector magnitude

### Quaternion

Represents rotation in 3D space.

#### Properties
- `x`, `y`, `z`, `w` (float) - Quaternion components
- `eulerAngles` (Vector3) - Euler angle representation

#### Static Properties
- `identity` (Quaternion, read-only) - No rotation quaternion

#### Static Methods
- `Euler(x, y, z)` - Create quaternion from Euler angles
- `AngleAxis(angle, axis)` - Create quaternion from angle and axis
- `LookRotation(forward, up)` - Create look rotation
- `Slerp(a, b, t)` - Spherical linear interpolation

#### Usage Examples
```javascript
// Create rotations
var rotation = Quaternion.Euler(45, 0, 0); // 45 degrees around X axis
var lookAt = Quaternion.LookRotation(Vector3.forward, Vector3.up);

// Interpolate rotations
var smoothRotation = Quaternion.Slerp(currentRot, targetRot, 0.1);
```

### Color

Represents RGBA color values.

#### Properties
- `r`, `g`, `b`, `a` (float) - Color components (0-1 range)

#### Static Properties
- `white`, `black`, `red`, `green`, `blue`, `yellow`, `cyan`, `magenta`, `clear` - Predefined colors

#### Constructor
```javascript
var color = new Color(r, g, b, a);
var opaqueColor = new Color(r, g, b); // Alpha defaults to 1
```

### UUID

Represents a universally unique identifier.

#### Constructor
```javascript
var id = new UUID(); // Generate new UUID
var id = new UUID(uuidString); // Parse from string
```

#### Methods
- `toString()` - Get string representation

### RaycastHitInfo

Contains information about raycast hits.

#### Properties
- `point` (Vector3) - Hit point in world coordinates
- `normal` (Vector3) - Surface normal at hit point
- `distance` (float) - Distance from ray origin to hit point
- `entity` (BaseEntity) - Entity that was hit

## Entity APIs

Entity APIs provide functionality for creating, manipulating, and interacting with 3D objects in the world.

### BaseEntity

Base class for all entities in the world.

#### Properties
- `id` (UUID, read-only) - Unique identifier
- `tag` (string) - User-defined tag for identification
- `position` (Vector3) - World position
- `rotation` (Quaternion) - World rotation
- `scale` (Vector3) - World scale
- `parentID` (UUID) - Parent entity ID
- `entityType` (string, read-only) - Type of entity
- `interactionState` (InteractionState) - Current interaction state
- `motion` (EntityMotion) - Motion properties
- `physicalProperties` (EntityPhysicalProperties) - Physical properties

#### Methods
- `IsValid()` - Check if entity reference is valid
- `Delete()` - Remove entity from world
- `GetPosition()` - Get world position
- `SetPosition(position)` - Set world position
- `GetRotation()` - Get world rotation
- `SetRotation(rotation)` - Set world rotation
- `GetScale()` - Get world scale
- `SetScale(scale)` - Set world scale
- `GetSize()` - Get entity bounding box size
- `SetParent(parentEntity)` - Set parent entity
- `SetInteractionState(state)` - Set interaction state
- `Synchronize()` - Synchronize entity state
- `Highlight(duration)` - Highlight entity for specified duration
- `RequestOwnership()` - Request ownership of entity

#### Usage Examples
```javascript
// Create and manipulate entity
var entity = new MeshEntity(parentEntity, meshResource, position, rotation, scale, id, tag);
entity.SetPosition(new Vector3(10, 5, 0));
entity.SetRotation(Quaternion.Euler(0, 45, 0));
entity.SetScale(new Vector3(2, 2, 2));
entity.Highlight(3.0); // Highlight for 3 seconds
```

### MeshEntity

Entity for displaying 3D meshes.

#### Constructor
```javascript
var meshEntity = new MeshEntity(
    parent,           // BaseEntity - Parent entity
    meshResource,     // string - Mesh resource URL or path
    position,         // Vector3 - Initial position
    rotation,         // Quaternion - Initial rotation  
    scale,           // Vector3 - Initial scale
    id,              // string (optional) - Entity ID
    tag,             // string (optional) - Entity tag
    onLoaded,        // string (optional) - Callback function name
    timeout          // float (optional) - Load timeout in seconds
);
```

#### Properties
All BaseEntity properties plus:
- `meshResource` (string) - Current mesh resource

#### Methods
All BaseEntity methods plus:
- `SetMesh(meshResource, onLoaded, timeout)` - Change the mesh
- `SetMaterial(materialResource, onLoaded, timeout)` - Set material

#### Usage Examples
```javascript
// Create a mesh entity
var cube = new MeshEntity(
    worldEntity,
    "http://example.com/models/cube.gltf",
    new Vector3(0, 1, 0),
    Quaternion.identity,
    Vector3.one,
    null,
    "myCube",
    "onCubeLoaded",
    10.0
);

// Change mesh
cube.SetMesh("http://example.com/models/sphere.gltf", "onMeshChanged", 5.0);
```

### LightEntity

Entity for creating light sources.

#### Constructor
```javascript
var lightEntity = new LightEntity(
    parent,          // BaseEntity
    lightType,       // LightType
    color,           // Color
    intensity,       // float
    range,           // float  
    position,        // Vector3
    rotation,        // Quaternion
    id,              // string (optional)
    tag              // string (optional)
);
```

#### Properties
All BaseEntity properties plus:
- `lightType` (LightType) - Type of light
- `color` (Color) - Light color
- `intensity` (float) - Light intensity
- `range` (float) - Light range

#### Methods
All BaseEntity methods plus:
- `SetLightType(type)` - Change light type
- `SetColor(color)` - Set light color
- `SetIntensity(intensity)` - Set light intensity
- `SetRange(range)` - Set light range

### LightType

Enumeration of light types.

#### Values
- `Directional` - Directional light (like sun)
- `Point` - Point light (like bulb)
- `Spot` - Spot light (like flashlight)

### AudioEntity

Entity for playing audio.

#### Constructor
```javascript
var audioEntity = new AudioEntity(
    parent,           // BaseEntity
    audioResource,    // string - Audio file URL
    position,         // Vector3
    rotation,         // Quaternion
    volume,           // float
    pitch,            // float
    spatialBlend,     // float
    id,               // string (optional)
    tag,              // string (optional)
    onLoaded,         // string (optional)
    timeout           // float (optional)
);
```

#### Properties
All BaseEntity properties plus:
- `volume` (float) - Audio volume (0-1)
- `pitch` (float) - Audio pitch
- `spatialBlend` (float) - 2D/3D blend (0=2D, 1=3D)
- `isPlaying` (bool, read-only) - Whether audio is playing

#### Methods
All BaseEntity methods plus:
- `Play()` - Start playing audio
- `Stop()` - Stop playing audio
- `Pause()` - Pause audio
- `SetVolume(volume)` - Set volume
- `SetPitch(pitch)` - Set pitch

### TextEntity

Entity for displaying text.

#### Constructor
```javascript
var textEntity = new TextEntity(
    parent,          // BaseEntity
    text,            // string - Text content
    fontSize,        // float
    fontResource,    // string - Font resource URL
    color,           // Color
    position,        // Vector3
    rotation,        // Quaternion
    id,              // string (optional)
    tag              // string (optional)
);
```

#### Methods
All BaseEntity methods plus:
- `SetText(text)` - Update text content
- `SetFontSize(size)` - Change font size
- `SetColor(color)` - Change text color

### ImageEntity

Entity for displaying images.

#### Constructor
```javascript
var imageEntity = new ImageEntity(
    parent,           // BaseEntity
    imageResource,    // string - Image URL
    position,         // Vector3
    rotation,         // Quaternion
    scale,           // Vector3
    id,              // string (optional)
    tag,             // string (optional)
    onLoaded,        // string (optional)
    timeout          // float (optional)
);
```

### ButtonEntity

Interactive button entity.

#### Constructor
```javascript
var buttonEntity = new ButtonEntity(
    parent,          // BaseEntity
    text,            // string - Button text
    fontSize,        // float
    fontResource,    // string
    onClick,         // string - Callback function name
    position,        // Vector3
    rotation,        // Quaternion
    scale,          // Vector3
    id,             // string (optional)
    tag             // string (optional)
);
```

#### Methods
All BaseEntity methods plus:
- `SetText(text)` - Change button text
- `SetOnClick(callback)` - Set click callback

### InputEntity

Text input field entity.

#### Constructor
```javascript
var inputEntity = new InputEntity(
    parent,          // BaseEntity
    placeholder,     // string - Placeholder text
    fontSize,        // float
    fontResource,    // string
    onChange,        // string - Change callback
    position,        // Vector3
    rotation,        // Quaternion
    scale,          // Vector3
    id,             // string (optional)
    tag             // string (optional)
);
```

#### Properties
All BaseEntity properties plus:
- `text` (string) - Current input text

#### Methods
All BaseEntity methods plus:
- `SetText(text)` - Set input text
- `SetPlaceholder(placeholder)` - Set placeholder text

### ContainerEntity

Entity that can contain other entities.

#### Constructor
```javascript
var container = new ContainerEntity(
    parent,          // BaseEntity
    position,        // Vector3
    rotation,        // Quaternion
    scale,          // Vector3
    id,             // string (optional)
    tag             // string (optional)
);
```

### CanvasEntity

2D canvas entity for UI elements.

#### Constructor
```javascript
var canvas = new CanvasEntity(
    parent,          // BaseEntity
    position,        // Vector3
    rotation,        // Quaternion
    scale,          // Vector3
    id,             // string (optional)
    tag             // string (optional)
);
```

### HTMLEntity

Entity for displaying HTML content.

#### Constructor
```javascript
var htmlEntity = new HTMLEntity(
    parent,          // BaseEntity
    htmlContent,     // string - HTML content
    position,        // Vector3
    rotation,        // Quaternion
    scale,          // Vector3
    id,             // string (optional)
    tag,            // string (optional)
    onLoaded        // string (optional)
);
```

#### Methods
All BaseEntity methods plus:
- `SetHTML(htmlContent)` - Update HTML content

### TerrainEntity

Entity for creating and manipulating terrain.

#### Constructor
```javascript
var terrain = new TerrainEntity(
    parent,          // BaseEntity
    width,           // float
    height,          // float
    heights,         // float[,] - Height map data
    layers,          // TerrainEntityLayer[]
    layerMasks,      // TerrainEntityLayerMaskCollection
    modifications,   // TerrainEntityModification[]
    position,        // Vector3
    rotation,        // Quaternion
    id,             // string (optional)
    tag,            // string (optional)
    onLoaded,       // string (optional)
    timeout         // float (optional)
);
```

#### Methods
All BaseEntity methods plus:
- `SetHeights(heights)` - Update terrain heights
- `GetHeights()` - Get current height map
- `SetLayer(index, layer)` - Set terrain layer
- `ModifyTerrain(modification)` - Apply terrain modification

### VoxelEntity

Entity for voxel-based objects.

#### Constructor
```javascript
var voxelEntity = new VoxelEntity(
    parent,          // BaseEntity
    voxelData,       // VoxelBlockInfo[] - Voxel data
    position,        // Vector3
    rotation,        // Quaternion
    scale,          // Vector3
    id,             // string (optional)
    tag,            // string (optional)
    onLoaded        // string (optional)
);
```

#### Methods
All BaseEntity methods plus:
- `SetVoxel(x, y, z, blockInfo)` - Set individual voxel
- `GetVoxel(x, y, z)` - Get voxel at position
- `SetVoxelData(data)` - Set entire voxel data

### CharacterEntity

Entity representing a character or avatar.

#### Constructor
```javascript
var character = new CharacterEntity(
    parent,          // BaseEntity
    characterResource, // string - Character model URL
    position,        // Vector3
    rotation,        // Quaternion
    scale,          // Vector3
    id,             // string (optional)
    tag,            // string (optional)
    onLoaded,       // string (optional)
    timeout         // float (optional)
);
```

#### Methods
All BaseEntity methods plus:
- `PlayAnimation(animationName)` - Play character animation
- `StopAnimation()` - Stop current animation
- `SetAnimationSpeed(speed)` - Set animation playback speed

### Entity Helper Classes

#### EntityMotion

Represents entity motion properties.

##### Properties
- `angularVelocity` (Vector3) - Angular velocity
- `velocity` (Vector3) - Linear velocity

#### EntityPhysicalProperties

Represents entity physical properties.

##### Properties
- `mass` (float) - Entity mass
- `drag` (float) - Linear drag
- `angularDrag` (float) - Angular drag
- `useGravity` (bool) - Whether to apply gravity

#### InteractionState

Enumeration of entity interaction states.

##### Values
- `Physical` - Physical interaction enabled
- `Placing` - Entity is being placed
- `Static` - Static, no interaction

## Networking APIs

Networking APIs provide HTTP, MQTT, and WebSocket communication capabilities.

### HTTPNetworking

Provides HTTP request functionality similar to the Fetch API.

#### Static Methods

##### Fetch
```javascript
HTTPNetworking.Fetch(resource, onFinished);
HTTPNetworking.Fetch(resource, options, onFinished);
```

Performs an HTTP request.

**Parameters:**
- `resource` (string) - URL of the resource to fetch
- `options` (FetchRequestOptions, optional) - Request options
- `onFinished` (string) - Name of callback function to execute when request completes

**Callback Function:**
The callback function will receive an HTTPNetworking.Response object.

#### FetchRequestOptions

Request configuration object.

##### Properties
- `method` (string) - HTTP method (GET, POST, PUT, DELETE, PATCH, etc.)
- `headers` (string[]) - Request headers as key-value pairs
- `body` (string) - Request body content
- `cache` (string) - Cache control
- `credentials` (string) - Credentials mode
- `keepalive` (bool) - Keep connection alive
- `mode` (string) - Request mode
- `redirect` (string) - Redirect handling
- `referrer` (string) - Referrer
- `referrerPolicy` (string) - Referrer policy
- `integrity` (string) - Subresource integrity

#### HTTPNetworking.Response

Represents an HTTP response.

##### Properties
- `status` (int, read-only) - HTTP status code
- `statusText` (string, read-only) - HTTP status text
- `ok` (bool, read-only) - Whether request was successful (status 200-299)
- `headers` (string[], read-only) - Response headers
- `body` (string, read-only) - Response body content

##### Methods
- `text()` - Get response body as text
- `json()` - Parse response body as JSON

#### Usage Examples
```javascript
// Simple GET request
function onDataReceived(response) {
    if (response.ok) {
        var data = response.json();
        console.log("Received data:", data);
    }
}

HTTPNetworking.Fetch("https://api.example.com/data", "onDataReceived");

// POST request with options
var options = {
    method: "POST",
    headers: ["Content-Type", "application/json"],
    body: JSON.stringify({name: "test", value: 42})
};

HTTPNetworking.Fetch("https://api.example.com/submit", options, "onSubmitComplete");
```

### MQTTClient

Provides MQTT messaging functionality (requires USE_WEBINTERFACE).

#### Constructor
```javascript
var client = new MQTTClient(
    host,            // string - MQTT broker host
    port,            // int - MQTT broker port
    useSSL,          // bool - Use SSL/TLS
    clientID,        // string - Client identifier
    username,        // string (optional) - Username
    password         // string (optional) - Password
);
```

#### Methods
- `Connect(onConnected)` - Connect to MQTT broker
- `Disconnect()` - Disconnect from broker
- `Subscribe(topic, qos, onMessage)` - Subscribe to topic
- `Unsubscribe(topic)` - Unsubscribe from topic
- `Publish(topic, message, qos, retain)` - Publish message
- `IsConnected()` - Check connection status

#### Usage Examples
```javascript
// Create and connect MQTT client
var mqttClient = new MQTTClient("mqtt.example.com", 1883, false, "webverse-client");

function onConnected() {
    console.log("MQTT connected");
    mqttClient.Subscribe("sensors/temperature", 0, "onTemperatureMessage");
}

function onTemperatureMessage(topic, message) {
    console.log("Temperature:", message);
}

mqttClient.Connect("onConnected");

// Publish message
mqttClient.Publish("commands/light", "on", 0, false);
```

### WebSocket

Provides WebSocket communication (requires USE_WEBINTERFACE).

#### Constructor
```javascript
var ws = new WebSocket(
    url,             // string - WebSocket URL
    onOpen,          // string - Open callback
    onMessage,       // string - Message callback
    onError,         // string - Error callback
    onClose          // string - Close callback
);
```

#### Methods
- `Send(message)` - Send message to server
- `Close()` - Close WebSocket connection
- `IsConnected()` - Check connection status

#### Usage Examples
```javascript
// Create WebSocket connection
var websocket = new WebSocket(
    "wss://example.com/websocket",
    "onSocketOpen",
    "onSocketMessage", 
    "onSocketError",
    "onSocketClose"
);

function onSocketOpen() {
    console.log("WebSocket connected");
    websocket.Send("Hello Server!");
}

function onSocketMessage(message) {
    console.log("Received:", message);
}

function onSocketError(error) {
    console.log("WebSocket error:", error);
}

function onSocketClose() {
    console.log("WebSocket closed");
}
```

## Environment APIs

Environment APIs control world lighting, sky, and environmental effects.

### Environment

Controls global environment settings including sky, lighting, and atmospheric effects.

#### Static Methods

##### SetSkyboxMaterial
```javascript
Environment.SetSkyboxMaterial(
    materialResource,    // string - Skybox material URL
    onComplete,         // string (optional) - Completion callback
    timeout            // float (optional) - Timeout in seconds
);
```

Sets the skybox material for the world.

##### SetAmbientLight
```javascript
Environment.SetAmbientLight(color, intensity);
```

Sets ambient lighting.

**Parameters:**
- `color` (Color) - Ambient light color
- `intensity` (float) - Light intensity

##### SetFog
```javascript
Environment.SetFog(
    enabled,           // bool - Enable fog
    color,            // Color - Fog color
    density,          // float - Fog density
    startDistance,    // float - Fog start distance
    endDistance      // float - Fog end distance
);
```

Configures fog settings.

##### SetSkySettings
```javascript
Environment.SetSkySettings(
    dayHorizonColor,          // Color
    daySkyColor,             // Color
    nightHorizonColor,       // Color
    nightSkyColor,           // Color
    horizonSaturationAmount, // float
    horizonSaturationFalloff,// float
    enableSun,               // bool
    sunDiameter,             // float
    sunHorizonColor,         // Color
    sunZenithColor,          // Color
    // ... additional sky parameters
);
```

Configures advanced sky rendering settings including sun, moon, stars, and clouds.

#### Usage Examples
```javascript
// Set basic environment
Environment.SetAmbientLight(new Color(0.2, 0.2, 0.3), 0.5);
Environment.SetSkyboxMaterial("http://example.com/skyboxes/sunset.mat");

// Configure fog
Environment.SetFog(true, new Color(0.5, 0.7, 1.0), 0.01, 10, 100);

// Advanced sky settings
Environment.SetSkySettings(
    new Color(1.0, 0.8, 0.6),  // Day horizon color
    new Color(0.5, 0.7, 1.0),  // Day sky color
    new Color(0.2, 0.1, 0.3),  // Night horizon color
    new Color(0.0, 0.0, 0.1),  // Night sky color
    1.0,                       // Horizon saturation amount
    0.5,                       // Horizon saturation falloff
    true,                      // Enable sun
    0.04,                      // Sun diameter
    new Color(1.0, 0.9, 0.7),  // Sun horizon color
    new Color(1.0, 1.0, 0.9)   // Sun zenith color
    // ... etc
);
```

## Input APIs

Input APIs provide access to user input from keyboard, mouse, VR controllers, and other input devices.

### Input

Provides access to user input state and VR controller functionality.

#### Static Properties
- `IsVR` (bool, read-only) - Whether VR mode is active
- `leftVRPointerMode` (VRPointerMode) - Left hand pointer mode in VR
- `rightVRPointerMode` (VRPointerMode) - Right hand pointer mode in VR
- `leftVRPokerEnabled` (bool) - Left hand poker interaction enabled
- `rightVRPokerEnabled` (bool) - Right hand poker interaction enabled
- `leftInteractionEnabled` (bool) - Left hand interaction enabled
- `rightInteractionEnabled` (bool) - Right hand interaction enabled
- `turnLocomotionMode` (VRTurnLocomotionMode) - VR turn locomotion mode
- `joystickMotionEnabled` (bool) - VR joystick motion enabled
- `leftGrabMoveEnabled` (bool) - Left hand grab movement enabled
- `rightGrabMoveEnabled` (bool) - Right hand grab movement enabled
- `twoHandedGrabMoveEnabled` (bool) - Two-handed grab movement enabled

#### Enumerations

##### VRPointerMode
- `None` (0) - No pointer interaction
- `Teleport` (1) - Teleportation pointer
- `UI` (2) - UI interaction pointer

##### VRTurnLocomotionMode
- `None` (0) - No turn locomotion
- `Smooth` (1) - Smooth turning
- `Snap` (2) - Snap turning

#### Static Methods

##### Basic Input Methods

###### GetMoveValue
```javascript
var moveVector = Input.GetMoveValue();
```

Returns current movement input as Vector2.

###### GetLookValue
```javascript
var lookVector = Input.GetLookValue();
```

Returns current look input as Vector2.

###### GetKeyValue
```javascript
var isPressed = Input.GetKeyValue(key);
```

Returns true while the specified key is held down.

**Parameters:**
- `key` (string) - Key name to check

###### GetKeyCodeValue
```javascript
var isPressed = Input.GetKeyCodeValue(keycode);
```

Returns true while the specified keycode is held down.

**Parameters:**
- `keycode` (string) - Keycode to check

###### Mouse Button Methods
```javascript
var leftPressed = Input.GetLeft();    // Left mouse button
var middlePressed = Input.GetMiddle(); // Middle mouse button
var rightPressed = Input.GetRight();   // Right mouse button
```

##### VR Controller Methods

###### Hand Position and Rotation
```javascript
var leftHandPos = Input.GetLeftHandPosition();
var rightHandPos = Input.GetRightHandPosition();
var leftHandRot = Input.GetLeftHandRotation();
var rightHandRot = Input.GetRightHandRotation();
```

Returns Vector3 position or Quaternion rotation for VR controllers.

###### Pointer Raycast
```javascript
var hit = Input.GetPointerRaycast(direction, pointerIndex);
```

Performs raycast from VR pointer.

**Parameters:**
- `direction` (Vector3) - Ray direction
- `pointerIndex` (int, optional) - Pointer index (default: 0)

**Returns:** `RaycastHitInfo` or null if no hit

##### VR Follower Management

###### AddRigFollower
```javascript
var success = Input.AddRigFollower(entity);
```

Add entity to follow the VR rig.

###### AddLeftHandFollower
```javascript
var success = Input.AddLeftHandFollower(entity);
```

Add entity to follow the left VR controller.

###### AddRightHandFollower
```javascript
var success = Input.AddRightHandFollower(entity);
```

Add entity to follow the right VR controller.

###### RemoveRigFollower
```javascript
var success = Input.RemoveRigFollower(entity);
```

###### RemoveLeftHandFollower
```javascript
var success = Input.RemoveLeftHandFollower(entity);
```

###### RemoveRightHandFollower
```javascript
var success = Input.RemoveRightHandFollower(entity);
```

#### Usage Examples

##### Basic Input Handling
```javascript
// Check movement input
var movement = Input.GetMoveValue();
var look = Input.GetLookValue();

if (movement.x !== 0 || movement.y !== 0) {
    // Apply movement
    var moveDirection = new Vector3(movement.x, 0, movement.y);
    player.position = Vector3.Add(player.position, moveDirection);
}

// Check key presses
if (Input.GetKeyValue("Space")) {
    Logging.Log("Space is being held");
}

// Mouse buttons
if (Input.GetLeft()) {
    Logging.Log("Left mouse button pressed");
}
```

##### VR Input Handling
```javascript
// Check if in VR mode
if (Input.IsVR) {
    // Get hand positions
    var leftHand = Input.GetLeftHandPosition();
    var rightHand = Input.GetRightHandPosition();
    
    // Set up VR pointer modes
    Input.leftVRPointerMode = Input.VRPointerMode.Teleport;
    Input.rightVRPointerMode = Input.VRPointerMode.UI;
    
    // Enable interactions
    Input.leftInteractionEnabled = true;
    Input.rightInteractionEnabled = true;
    
    // Configure locomotion
    Input.turnLocomotionMode = Input.VRTurnLocomotionMode.Snap;
    Input.joystickMotionEnabled = true;
    
    // Perform raycast from right hand
    var rightHandRot = Input.GetRightHandRotation();
    var forward = rightHandRot.forward; // Assuming forward property exists
    var hit = Input.GetPointerRaycast(forward, 1);
    
    if (hit) {
        Logging.Log("VR pointer hit: " + hit.entity.tag);
    }
}
```

##### VR Hand Followers
```javascript
// Create objects that follow VR hands
var leftHandTool = new MeshEntity(
    world,
    "http://example.com/tools/hammer.gltf",
    Vector3.zero,
    Quaternion.identity,
    Vector3.one,
    null,
    "leftTool"
);

var rightHandTool = new MeshEntity(
    world, 
    "http://example.com/tools/sword.gltf",
    Vector3.zero,
    Quaternion.identity,
    Vector3.one,
    null,
    "rightTool"
);

// Make tools follow hands
Input.AddLeftHandFollower(leftHandTool);
Input.AddRightHandFollower(rightHandTool);

// Later, remove followers if needed
// Input.RemoveLeftHandFollower(leftHandTool);
```

## Data APIs

Data APIs provide utilities for asynchronous data operations and JSON handling.

### AsyncJSON

Provides asynchronous JSON parsing and processing capabilities.

#### Static Methods

##### Parse
```javascript
AsyncJSON.Parse(jsonString, onComplete);
```

Asynchronously parse JSON string.

**Parameters:**
- `jsonString` (string) - JSON string to parse
- `onComplete` (string) - Callback function name that receives parsed object

##### Stringify
```javascript
AsyncJSON.Stringify(object, onComplete);
```

Asynchronously convert object to JSON string.

**Parameters:**
- `object` (object) - Object to stringify
- `onComplete` (string) - Callback function name that receives JSON string

#### Usage Examples
```javascript
// Parse JSON asynchronously
function onJsonParsed(data) {
    console.log("Parsed data:", data);
    console.log("Name:", data.name);
    console.log("Value:", data.value);
}

var jsonString = '{"name": "test", "value": 42}';
AsyncJSON.Parse(jsonString, "onJsonParsed");

// Stringify object
function onJsonStringified(jsonString) {
    console.log("JSON string:", jsonString);
    // Send to server or save
}

var dataObject = {
    position: {x: 10, y: 5, z: 0},
    rotation: {x: 0, y: 45, z: 0},
    name: "myEntity"
};

AsyncJSON.Stringify(dataObject, "onJsonStringified");
```

## VOS Synchronization APIs

VOS (Virtual Operating System) Synchronization APIs enable multi-user synchronization and communication.

### VOSSynchronization

Provides VOS synchronization functionality (requires USE_WEBINTERFACE).

#### Static Methods

##### ConnectToService
```javascript
var success = VOSSynchronization.ConnectToService(
    host,            // string - VOS service host
    port,            // int - Service port
    tls,             // bool - Use TLS encryption
    onConnected,     // string (optional) - Connection callback
    transport        // Transport (optional) - Transport type
);
```

Connect to VOS synchronization service.

**Returns:** `bool` - Whether connection attempt was initiated successfully

##### JoinSession
```javascript
var sessionId = VOSSynchronization.JoinSession(
    host,            // string - Service host
    port,            // int - Service port
    tls,             // bool - Use TLS
    id,              // string - Session ID
    tag,             // string - Session tag
    callback,        // string (optional) - Join callback
    transport,       // Transport (optional) - Transport type
    clientID,        // string (optional) - Client ID
    clientToken      // string (optional) - Client token
);
```

Join a synchronization session.

**Returns:** `string` - Session identifier

##### LeaveSession
```javascript
VOSSynchronization.LeaveSession(sessionId);
```

Leave a synchronization session.

##### SendMessage
```javascript
VOSSynchronization.SendMessage(
    sessionId,       // string - Session ID
    message,         // string - Message content
    recipients       // string[] (optional) - Recipient client IDs
);
```

Send message to session participants.

##### RegisterMessageHandler
```javascript
VOSSynchronization.RegisterMessageHandler(
    sessionId,       // string - Session ID
    messageType,     // string - Message type to handle
    handler          // string - Handler function name
);
```

Register handler for incoming messages.

#### Transport Enumeration

Transport types for VOS communication.

##### Values
- `TCP` - TCP transport
- `WebSocket` - WebSocket transport

#### Usage Examples
```javascript
// Connect to VOS service
function onVOSConnected() {
    console.log("Connected to VOS service");
    
    // Join a session
    var sessionId = VOSSynchronization.JoinSession(
        "vos.example.com",
        8080,
        true,
        "world-session-1",
        "main-world",
        "onSessionJoined",
        VOSSynchronization.Transport.WebSocket
    );
}

function onSessionJoined(sessionId) {
    console.log("Joined session:", sessionId);
    
    // Register message handler
    VOSSynchronization.RegisterMessageHandler(
        sessionId,
        "player-position",
        "onPlayerPositionUpdate"
    );
    
    // Send initial position
    var positionData = JSON.stringify({
        x: player.position.x,
        y: player.position.y,
        z: player.position.z
    });
    
    VOSSynchronization.SendMessage(sessionId, positionData);
}

function onPlayerPositionUpdate(message) {
    var position = JSON.parse(message);
    console.log("Player moved to:", position.x, position.y, position.z);
}

// Connect to service
VOSSynchronization.ConnectToService(
    "vos.example.com",
    8080,
    true,
    "onVOSConnected",
    VOSSynchronization.Transport.WebSocket
);
```

## World Browser Utilities

World Browser Utilities provide various helper functions for world interaction, logging, storage, and more.

### Camera

Controls camera behavior and properties.

#### Static Methods

##### Entity Attachment

###### AttachToEntity
```javascript
var success = Camera.AttachToEntity(entity);
```

Attach camera to an entity, or pass null to make camera root-level.

**Parameters:**
- `entity` (BaseEntity or null) - Entity to attach camera to

**Returns:** `bool` - Whether operation was successful

##### Camera Followers

###### AddCameraFollower
```javascript
var success = Camera.AddCameraFollower(entity);
```

Add entity to follow the camera.

###### RemoveCameraFollower
```javascript
var success = Camera.RemoveCameraFollower(entity);
```

Remove entity from following the camera.

##### Position Control

###### SetPosition
```javascript
var success = Camera.SetPosition(position, local);
```

Set camera position.

**Parameters:**
- `position` (Vector3) - Position to set
- `local` (bool) - Whether position is local or world space

###### GetPosition
```javascript
var position = Camera.GetPosition(local);
```

Get current camera position.

**Parameters:**
- `local` (bool) - Whether to get local or world position

**Returns:** `Vector3` - Camera position

##### Rotation Control

###### SetRotation
```javascript
var success = Camera.SetRotation(rotation, local);
```

Set camera rotation using quaternion.

**Parameters:**
- `rotation` (Quaternion) - Rotation to set
- `local` (bool) - Whether rotation is local or world space

###### GetRotation
```javascript
var rotation = Camera.GetRotation(local);
```

Get current camera rotation as quaternion.

###### SetEulerRotation
```javascript
var success = Camera.SetEulerRotation(rotation, local);
```

Set camera rotation using Euler angles.

**Parameters:**
- `rotation` (Vector3) - Euler angles in degrees
- `local` (bool) - Whether rotation is local or world space

###### GetEulerRotation
```javascript
var rotation = Camera.GetEulerRotation(local);
```

Get current camera rotation as Euler angles.

##### Scale Control

###### SetScale
```javascript
var success = Camera.SetScale(scale);
```

Set camera scale.

**Parameters:**
- `scale` (Vector3) - Scale to apply

###### GetScale
```javascript
var scale = Camera.GetScale();
```

Get current camera scale.

#### Usage Examples

##### Basic Camera Control
```javascript
// Set camera position and rotation in world space
Camera.SetPosition(new Vector3(0, 10, -10), false);
Camera.SetEulerRotation(new Vector3(30, 0, 0), false);

// Get current camera state
var currentPos = Camera.GetPosition(false);
var currentRot = Camera.GetEulerRotation(false);

Logging.Log("Camera at: " + currentPos.toString());
Logging.Log("Camera rotation: " + currentRot.toString());
```

##### Camera Following
```javascript
// Create a target entity
var target = new MeshEntity(
    world,
    "http://example.com/models/player.gltf",
    new Vector3(0, 0, 0),
    Quaternion.identity,
    Vector3.one,
    null,
    "player"
);

// Attach camera to follow the target
Camera.AttachToEntity(target);

// Or use local positioning relative to target
Camera.SetPosition(new Vector3(0, 5, -10), true); // 5 units up, 10 units back
Camera.SetEulerRotation(new Vector3(15, 0, 0), true); // Look down slightly
```

##### Camera Followers
```javascript
// Create UI elements that follow the camera
var healthBar = new ImageEntity(
    world,
    "http://example.com/ui/healthbar.png",
    Vector3.zero,
    Quaternion.identity,
    Vector3.one,
    null,
    "healthBar"
);

var minimap = new ImageEntity(
    world,
    "http://example.com/ui/minimap.png",
    Vector3.zero,
    Quaternion.identity,
    Vector3.one,
    null,
    "minimap"
);

// Make UI elements follow camera
Camera.AddCameraFollower(healthBar);
Camera.AddCameraFollower(minimap);

// Position them relative to camera
healthBar.SetPosition(new Vector3(-2, 1, 3), true); // Local to camera
minimap.SetPosition(new Vector3(2, 1, 3), true);   // Local to camera
```

##### Smooth Camera Movement
```javascript
var targetPosition = new Vector3(10, 5, 0);
var targetRotation = new Vector3(0, 45, 0);

function smoothCameraMovement() {
    var currentPos = Camera.GetPosition(false);
    var currentRot = Camera.GetEulerRotation(false);
    
    // Lerp position and rotation
    var newPos = Vector3.Lerp(currentPos, targetPosition, 0.02);
    var newRot = Vector3.Lerp(currentRot, targetRotation, 0.02);
    
    Camera.SetPosition(newPos, false);
    Camera.SetEulerRotation(newRot, false);
    
    // Continue until close enough
    var distance = Vector3.Distance(currentPos, targetPosition);
    if (distance > 0.1) {
        Time.SetTimeout("smoothCameraMovement();", 16); // ~60 FPS
    }
}

smoothCameraMovement();
```

### Logging

Provides logging functionality to the console.

#### Static Methods

##### Log
```javascript
Logging.Log(message);
```

Log an informational message.

##### LogWarning
```javascript
Logging.LogWarning(message);
```

Log a warning message.

##### LogError
```javascript
Logging.LogError(message);
```

Log an error message.

#### Usage Examples
```javascript
// Different log levels
Logging.Log("Application started");
Logging.LogWarning("Low memory available");
Logging.LogError("Failed to load resource");

// Log with variables
var playerName = "Alice";
var playerScore = 1500;
Logging.Log("Player " + playerName + " scored " + playerScore + " points");
```

### Time

Provides time-related functionality and scheduling.

#### Static Methods

##### SetInterval
```javascript
var intervalId = Time.SetInterval(function, interval);
```

Set up a function to be called repeatedly at specified intervals.

**Parameters:**
- `function` (string) - Name of function to call
- `interval` (float) - Interval in seconds between calls

**Returns:** `UUID` - Interval identifier for stopping

##### StopInterval
```javascript
var success = Time.StopInterval(id);
```

Stop a running interval.

**Parameters:**
- `id` (string) - UUID of interval to stop

**Returns:** `bool` - Whether operation was successful

##### SetTimeout
```javascript
var success = Time.SetTimeout(logic, timeout);
```

Execute logic after specified timeout.

**Parameters:**
- `logic` (string) - JavaScript code to execute
- `timeout` (int) - Timeout in milliseconds

**Returns:** `bool` - Whether operation was successful

##### CallAsynchronously
```javascript
var success = Time.CallAsynchronously(function);
```

Execute function asynchronously.

**Parameters:**
- `function` (string) - Function name to call

**Returns:** `bool` - Whether operation was successful

#### Usage Examples

##### Repeating Functions
```javascript
// Function to update game state
function updateGameLoop() {
    // Update player position, check collisions, etc.
    updatePlayer();
    checkCollisions();
    updateUI();
}

// Start game loop at 60 FPS (every ~16.67ms)
var gameLoopId = Time.SetInterval("updateGameLoop", 0.0167);

// Stop game loop when needed
function stopGame() {
    Time.StopInterval(gameLoopId.toString());
    Logging.Log("Game loop stopped");
}
```

##### Delayed Execution
```javascript
// Show welcome message after 3 seconds
Time.SetTimeout("showWelcomeMessage();", 3000);

function showWelcomeMessage() {
    Logging.Log("Welcome to the world!");
}

// Delayed entity creation
function createDelayedEntity() {
    Time.SetTimeout("spawnEnemy();", 5000); // Spawn enemy after 5 seconds
}

function spawnEnemy() {
    var enemy = new MeshEntity(
        world,
        "http://example.com/models/enemy.gltf",
        new Vector3(Math.random() * 20 - 10, 0, Math.random() * 20 - 10),
        Quaternion.identity,
        Vector3.one,
        null,
        "enemy"
    );
}
```

##### Asynchronous Execution
```javascript
// Execute heavy computation asynchronously
function performHeavyCalculation() {
    // Some intensive operation
    for (var i = 0; i < 1000000; i++) {
        // Complex calculations
    }
    Logging.Log("Heavy calculation completed");
}

// Run asynchronously to avoid blocking main thread
Time.CallAsynchronously("performHeavyCalculation");
```

##### Animation and Smooth Transitions
```javascript
var animationDuration = 2.0; // 2 seconds
var animationStartTime;
var startPosition;
var targetPosition = new Vector3(10, 0, 0);
var animatingEntity;

function startAnimation(entity) {
    animatingEntity = entity;
    startPosition = entity.GetPosition();
    animationStartTime = Date.now();
    
    // Update animation every frame
    var animationId = Time.SetInterval("updateAnimation", 0.016); // ~60 FPS
}

function updateAnimation() {
    var elapsed = (Date.now() - animationStartTime) / 1000.0; // Convert to seconds
    var progress = Math.min(elapsed / animationDuration, 1.0);
    
    // Smooth interpolation (ease-in-out)
    var smoothProgress = progress * progress * (3.0 - 2.0 * progress);
    
    var currentPos = Vector3.Lerp(startPosition, targetPosition, smoothProgress);
    animatingEntity.SetPosition(currentPos);
    
    if (progress >= 1.0) {
        // Animation complete
        Time.StopInterval(animationId.toString());
        Logging.Log("Animation completed");
    }
}

// Start animation on an entity
// startAnimation(myEntity);
```

##### Scheduled World Events
```javascript
var worldEvents = [
    { time: 10, event: "spawnPowerUp" },
    { time: 30, event: "changeWeather" },
    { time: 60, event: "bossSpawn" },
    { time: 120, event: "endLevel" }
];

var gameStartTime;

function startGame() {
    gameStartTime = Date.now();
    
    // Check for events every second
    Time.SetInterval("checkWorldEvents", 1.0);
}

function checkWorldEvents() {
    var elapsed = (Date.now() - gameStartTime) / 1000.0;
    
    for (var i = 0; i < worldEvents.length; i++) {
        var event = worldEvents[i];
        if (elapsed >= event.time && !event.triggered) {
            event.triggered = true;
            Time.CallAsynchronously(event.event);
        }
    }
}

function spawnPowerUp() {
    Logging.Log("Power-up spawned!");
    // Create power-up entity
}

function changeWeather() {
    Logging.Log("Weather changed!");
    Environment.SetFog(true, new Color(0.7, 0.7, 0.7), 0.05, 10, 50);
}

function bossSpawn() {
    Logging.Log("Boss spawned!");
    // Create boss entity
}

function endLevel() {
    Logging.Log("Level completed!");
    // End level logic
}
```

### Date

Provides date and time utilities.

#### Static Methods

##### GetCurrentDate
```javascript
var dateString = Date.GetCurrentDate();
```

Get current date as formatted string.

##### GetCurrentDateTime
```javascript
var dateTimeString = Date.GetCurrentDateTime();
```

Get current date and time as formatted string.

##### ParseDate
```javascript
var timestamp = Date.ParseDate(dateString);
```

Parse date string to timestamp.

##### FormatDate
```javascript
var formatted = Date.FormatDate(timestamp, format);
```

Format timestamp to string.

#### Usage Examples
```javascript
// Get current date/time
var now = Date.GetCurrentDateTime();
Logging.Log("Current time: " + now);

// Parse and format dates
var dateString = "2023-12-25";
var timestamp = Date.ParseDate(dateString);
var formatted = Date.FormatDate(timestamp, "MM/dd/yyyy");
```

### LocalStorage

Provides local data storage capabilities scoped to the current site.

#### Static Methods

##### SetItem
```javascript
LocalStorage.SetItem(key, value);
```

Store a key-value pair locally for the current site.

**Parameters:**
- `key` (string) - Storage key
- `value` (string) - Value to store

##### GetItem
```javascript
var value = LocalStorage.GetItem(key);
```

Retrieve stored value by key for the current site.

**Parameters:**
- `key` (string) - Storage key

**Returns:** `string` - Stored value or null if not found

##### RemoveItem
```javascript
LocalStorage.RemoveItem(key);
```

Remove stored item by key for the current site.

**Parameters:**
- `key` (string) - Storage key to remove

#### Usage Examples
```javascript
// Store user preferences (site-specific)
LocalStorage.SetItem("playerName", "Alice");
LocalStorage.SetItem("volume", "0.8");
LocalStorage.SetItem("graphics", "high");

// Retrieve stored data
var playerName = LocalStorage.GetItem("playerName");
var volume = parseFloat(LocalStorage.GetItem("volume"));

if (playerName) {
    Logging.Log("Welcome back, " + playerName + "!");
}

// Check if data exists
var savedSettings = LocalStorage.GetItem("gameSettings");
if (savedSettings) {
    var settings = JSON.parse(savedSettings);
    // Apply saved settings
}

// Remove old data
LocalStorage.RemoveItem("tempData");
```

### WorldStorage

Provides world-specific data storage that persists within the current world session.

#### Static Methods

##### SetItem
```javascript
WorldStorage.SetItem(key, value);
```

Store data specific to the current world.

**Parameters:**
- `key` (string) - Storage key
- `value` (string) - Value to store

##### GetItem
```javascript
var value = WorldStorage.GetItem(key);
```

Retrieve world-specific data by key.

**Parameters:**
- `key` (string) - Storage key

**Returns:** `string` - Stored value or null if not found

#### Usage Examples
```javascript
// Store world-specific settings
WorldStorage.SetItem("spawnPoint", JSON.stringify({x: 0, y: 10, z: 0}));
WorldStorage.SetItem("difficulty", "normal");
WorldStorage.SetItem("timeOfDay", "noon");

// Retrieve world data
var spawnData = WorldStorage.GetItem("spawnPoint");
if (spawnData) {
    var spawnPoint = JSON.parse(spawnData);
    player.SetPosition(new Vector3(spawnPoint.x, spawnPoint.y, spawnPoint.z));
}

var difficulty = WorldStorage.GetItem("difficulty");
if (difficulty === "hard") {
    // Apply hard mode settings
    enemyDamageMultiplier = 2.0;
}

// Store game state
var gameState = {
    level: currentLevel,
    score: playerScore,
    inventory: playerInventory,
    questProgress: questStates
};

WorldStorage.SetItem("gameState", JSON.stringify(gameState));
```

### World

Provides world-level operations and information.

#### Static Methods

##### GetQueryParam
```javascript
var value = World.GetQueryParam(key);
```

Get URL query parameter value.

**Parameters:**
- `key` (string) - Query parameter name

**Returns:** `string` - Parameter value or null if not found

##### GetWorldLoadState
```javascript
var state = World.GetWorldLoadState();
```

Get the current world loading state.

**Returns:** `string` - One of: "unloaded", "loadingworld", "loadedworld", "webpage", "error"

#### Usage Examples

##### Query Parameters
```javascript
// URL: https://example.com/world?level=5&mode=debug&player=alice

var level = World.GetQueryParam("level");      // "5"
var mode = World.GetQueryParam("mode");        // "debug"  
var playerName = World.GetQueryParam("player"); // "alice"
var missing = World.GetQueryParam("notfound"); // null

if (level) {
    currentLevel = parseInt(level);
    Logging.Log("Starting at level: " + currentLevel);
}

if (mode === "debug") {
    enableDebugMode();
}

if (playerName) {
    LocalStorage.SetItem("playerName", playerName);
}
```

##### World State Monitoring
```javascript
function checkWorldState() {
    var state = World.GetWorldLoadState();
    
    switch (state) {
        case "unloaded":
            Logging.Log("World not loaded yet");
            break;
            
        case "loadingworld":
            Logging.Log("World is loading...");
            showLoadingScreen();
            break;
            
        case "loadedworld":
            Logging.Log("World loaded successfully");
            hideLoadingScreen();
            initializeGame();
            break;
            
        case "webpage":
            Logging.Log("Displaying webpage");
            break;
            
        case "error":
            Logging.LogError("World loading error occurred");
            showErrorMessage();
            break;
    }
}

// Check world state periodically
Time.SetInterval("checkWorldState", 1.0);

function initializeGame() {
    // Only initialize once world is fully loaded
    if (World.GetWorldLoadState() === "loadedworld") {
        createPlayer();
        loadSavedData();
        startGameLoop();
    }
}

function showLoadingScreen() {
    // Show loading UI
}

function hideLoadingScreen() {
    // Hide loading UI
}

function showErrorMessage() {
    // Display error to user
}
```

##### World Configuration
```javascript
// Use query parameters to configure world
function configureWorld() {
    var graphicsQuality = World.GetQueryParam("graphics") || "medium";
    var audioEnabled = World.GetQueryParam("audio") !== "false";
    var startPosition = World.GetQueryParam("spawn");
    
    // Apply graphics settings
    switch (graphicsQuality) {
        case "low":
            Environment.SetFog(false, Color.white, 0, 0, 50);
            break;
        case "high":
            Environment.SetFog(true, new Color(0.7, 0.8, 1.0), 0.01, 100, 1000);
            break;
        default: // medium
            Environment.SetFog(true, new Color(0.8, 0.8, 0.9), 0.02, 50, 500);
            break;
    }
    
    // Set spawn position if specified
    if (startPosition) {
        var coords = startPosition.split(",");
        if (coords.length === 3) {
            var spawnPos = new Vector3(
                parseFloat(coords[0]),
                parseFloat(coords[1]), 
                parseFloat(coords[2])
            );
            
            if (player) {
                player.SetPosition(spawnPos);
            }
        }
    }
    
    // Store settings for this session
    WorldStorage.SetItem("graphics", graphicsQuality);
    WorldStorage.SetItem("audio", audioEnabled.toString());
}

// Configure world once loaded
if (World.GetWorldLoadState() === "loadedworld") {
    configureWorld();
}
```

### Context

Provides information about the current execution context.

#### Static Methods

##### GetContextInfo
```javascript
var info = Context.GetContextInfo();
```

Get information about current context.

##### IsVRMode
```javascript
var isVR = Context.IsVRMode();
```

Check if running in VR mode.

##### GetPlatform
```javascript
var platform = Context.GetPlatform();
```

Get current platform (WebGL, Windows, etc.).

#### Usage Examples
```javascript
// Adapt behavior based on context
if (Context.IsVRMode()) {
    // VR-specific interaction
    Logging.Log("VR mode detected");
} else {
    // Desktop interaction
    Logging.Log("Desktop mode");
}

var platform = Context.GetPlatform();
Logging.Log("Running on: " + platform);
```

### Scripting

Provides script execution utilities.

#### Static Methods

##### ExecuteScript
```javascript
Scripting.ExecuteScript(scriptCode);
```

Execute JavaScript code.

##### ScheduleExecution
```javascript
Scripting.ScheduleExecution(scriptCode, delayMs);
```

Schedule script execution after delay.

#### Usage Examples
```javascript
// Execute script immediately
Scripting.ExecuteScript("Logging.Log('Hello from executed script!');");

// Schedule delayed execution
Scripting.ScheduleExecution("player.position = Vector3.zero;", 5000); // After 5 seconds
```

## Common Usage Patterns

### Creating and Managing Entities

```javascript
// Create a basic scene
var world = new ContainerEntity(null, Vector3.zero, Quaternion.identity, Vector3.one, null, "world");

// Add lighting
var sunLight = new LightEntity(
    world,
    LightType.Directional,
    new Color(1, 0.95, 0.8),
    1.0,
    100,
    new Vector3(0, 10, 0),
    Quaternion.Euler(45, 0, 0),
    null,
    "sunLight"
);

// Create a mesh entity
var building = new MeshEntity(
    world,
    "http://example.com/models/building.gltf",
    new Vector3(0, 0, 0),
    Quaternion.identity,
    Vector3.one,
    null,
    "building",
    "onBuildingLoaded",
    30.0
);

function onBuildingLoaded(entity) {
    Logging.Log("Building loaded successfully");
    entity.Highlight(2.0);
}
```

### Input Handling and Character Movement

```javascript
var player;
var moveSpeed = 5.0;
var turnSpeed = 90.0;

function updatePlayer() {
    if (!player) return;
    
    // Get input
    var horizontal = Input.GetAxis("Horizontal");
    var vertical = Input.GetAxis("Vertical");
    
    // Movement
    var movement = new Vector3(horizontal, 0, vertical);
    movement = Vector3.Scale(movement, moveSpeed * Time.deltaTime);
    
    var currentPos = player.GetPosition();
    var newPos = Vector3.Add(currentPos, movement);
    player.SetPosition(newPos);
    
    // Jump
    if (Input.GetKeyDown("Space")) {
        var jumpMovement = new Vector3(0, 5, 0);
        var jumpPos = Vector3.Add(currentPos, jumpMovement);
        player.SetPosition(jumpPos);
    }
}

// Call updatePlayer every frame
Scripting.ScheduleExecution("updatePlayer();", 16); // ~60 FPS
```

### HTTP API Integration

```javascript
// Save player data to server
function savePlayerData() {
    var playerData = {
        name: LocalStorage.GetItem("playerName"),
        position: player.GetPosition(),
        level: parseInt(LocalStorage.GetItem("playerLevel"))
    };
    
    var options = {
        method: "POST",
        headers: ["Content-Type", "application/json"],
        body: JSON.stringify(playerData)
    };
    
    HTTPNetworking.Fetch("https://api.example.com/players/save", options, "onPlayerSaved");
}

function onPlayerSaved(response) {
    if (response.ok) {
        Logging.Log("Player data saved successfully");
    } else {
        Logging.LogError("Failed to save player data: " + response.statusText);
    }
}

// Load world data
function loadWorldData() {
    HTTPNetworking.Fetch("https://api.example.com/worlds/current", "onWorldDataLoaded");
}

function onWorldDataLoaded(response) {
    if (response.ok) {
        var worldData = response.json();
        
        // Apply environment settings
        Environment.SetAmbientLight(
            new Color(worldData.ambientColor.r, worldData.ambientColor.g, worldData.ambientColor.b),
            worldData.ambientIntensity
        );
        
        // Load entities
        for (var i = 0; i < worldData.entities.length; i++) {
            var entityData = worldData.entities[i];
            createEntityFromData(entityData);
        }
    }
}

function createEntityFromData(data) {
    var position = new Vector3(data.position.x, data.position.y, data.position.z);
    var rotation = Quaternion.Euler(data.rotation.x, data.rotation.y, data.rotation.z);
    var scale = new Vector3(data.scale.x, data.scale.y, data.scale.z);
    
    if (data.type === "mesh") {
        var entity = new MeshEntity(
            world,
            data.meshResource,
            position,
            rotation,
            scale,
            data.id,
            data.tag
        );
    }
    // Handle other entity types...
}
```

### Real-time Multiplayer with VOS

```javascript
var currentSession;
var players = {};

function initializeMultiplayer() {
    // Connect to VOS service
    VOSSynchronization.ConnectToService(
        "vos.example.com",
        8080,
        true,
        "onVOSConnected",
        VOSSynchronization.Transport.WebSocket
    );
}

function onVOSConnected() {
    // Join game session
    currentSession = VOSSynchronization.JoinSession(
        "vos.example.com",
        8080,
        true,
        "game-room-1",
        "main-game",
        "onSessionJoined",
        VOSSynchronization.Transport.WebSocket,
        LocalStorage.GetItem("playerId")
    );
}

function onSessionJoined(sessionId) {
    Logging.Log("Joined multiplayer session");
    
    // Register message handlers
    VOSSynchronization.RegisterMessageHandler(sessionId, "player-position", "onPlayerPositionUpdate");
    VOSSynchronization.RegisterMessageHandler(sessionId, "player-joined", "onPlayerJoined");
    VOSSynchronization.RegisterMessageHandler(sessionId, "player-left", "onPlayerLeft");
    
    // Send initial player data
    broadcastPlayerPosition();
}

function broadcastPlayerPosition() {
    if (!currentSession || !player) return;
    
    var positionData = {
        playerId: LocalStorage.GetItem("playerId"),
        position: player.GetPosition(),
        rotation: player.GetRotation()
    };
    
    VOSSynchronization.SendMessage(currentSession, JSON.stringify(positionData));
}

function onPlayerPositionUpdate(message) {
    var data = JSON.parse(message);
    var playerId = data.playerId;
    
    // Don't update our own player
    if (playerId === LocalStorage.GetItem("playerId")) return;
    
    // Update other player position
    if (players[playerId]) {
        players[playerId].SetPosition(data.position);
        players[playerId].SetRotation(data.rotation);
    }
}

function onPlayerJoined(message) {
    var data = JSON.parse(message);
    var playerId = data.playerId;
    
    // Create visual representation for new player
    var playerEntity = new MeshEntity(
        world,
        "http://example.com/models/player.gltf",
        data.position,
        data.rotation,
        Vector3.one,
        null,
        "player-" + playerId
    );
    
    players[playerId] = playerEntity;
    Logging.Log("Player " + playerId + " joined the game");
}

function onPlayerLeft(message) {
    var data = JSON.parse(message);
    var playerId = data.playerId;
    
    if (players[playerId]) {
        players[playerId].Delete();
        delete players[playerId];
        Logging.Log("Player " + playerId + " left the game");
    }
}

// Broadcast position updates regularly
function updateMultiplayer() {
    broadcastPlayerPosition();
    Scripting.ScheduleExecution("updateMultiplayer();", 100); // 10 times per second
}

// Start multiplayer
initializeMultiplayer();
```

### Environment and Lighting Control

```javascript
// Dynamic day/night cycle
var dayLength = 120; // 2 minutes
var currentTime = 0;

function updateDayNightCycle() {
    currentTime += Time.deltaTime;
    var timeRatio = (currentTime % dayLength) / dayLength;
    
    // Calculate sun angle
    var sunAngle = timeRatio * 360 - 90; // -90 to 270 degrees
    var sunRotation = Quaternion.Euler(sunAngle, 30, 0);
    
    if (sunLight) {
        sunLight.SetRotation(sunRotation);
    }
    
    // Adjust ambient light based on time
    var ambientIntensity;
    var ambientColor;
    
    if (timeRatio < 0.25 || timeRatio > 0.75) {
        // Night
        ambientIntensity = 0.1;
        ambientColor = new Color(0.2, 0.2, 0.4);
    } else if (timeRatio >= 0.45 && timeRatio <= 0.55) {
        // Day
        ambientIntensity = 0.7;
        ambientColor = new Color(0.8, 0.8, 1.0);
    } else {
        // Sunrise/sunset
        ambientIntensity = 0.4;
        ambientColor = new Color(1.0, 0.7, 0.4);
    }
    
    Environment.SetAmbientLight(ambientColor, ambientIntensity);
    
    // Schedule next update
    Scripting.ScheduleExecution("updateDayNightCycle();", 100);
}

// Start day/night cycle
updateDayNightCycle();

// Weather system
function setWeather(type) {
    switch (type) {
        case "sunny":
            Environment.SetFog(false, Color.white, 0, 0, 100);
            if (sunLight) sunLight.SetIntensity(1.0);
            break;
            
        case "foggy":
            Environment.SetFog(true, new Color(0.7, 0.7, 0.7), 0.05, 10, 50);
            if (sunLight) sunLight.SetIntensity(0.5);
            break;
            
        case "stormy":
            Environment.SetFog(true, new Color(0.3, 0.3, 0.3), 0.02, 20, 80);
            Environment.SetAmbientLight(new Color(0.4, 0.4, 0.5), 0.3);
            if (sunLight) sunLight.SetIntensity(0.2);
            break;
    }
}

// Change weather every 60 seconds
var weatherTypes = ["sunny", "foggy", "stormy"];
var currentWeatherIndex = 0;

function cycleWeather() {
    setWeather(weatherTypes[currentWeatherIndex]);
    currentWeatherIndex = (currentWeatherIndex + 1) % weatherTypes.length;
    Scripting.ScheduleExecution("cycleWeather();", 60000);
}

cycleWeather();
```
