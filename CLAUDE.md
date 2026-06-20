# CLAUDE.md

Guidance for working on this Pebble watch app.

## What this project is

A **Pebble smartwatch watchface** written in native **C** using the Pebble SDK
(build system: `waf`, configured via [wscript](wscript) and [package.json](package.json)).

The current code in [src/c/main.c](src/c/main.c) is the stock tutorial watchface
(displays time + date). The repo name `pebble-now-playing` reflects the intended
goal: a "now playing" music face, which will need phone-side JS
([src/pkjs/index.js](src/pkjs/index.js), currently a stub) to feed track data to
the watch over AppMessage.

## Where to find documentation

Pebble is community-maintained (Rebble / Core Devices). Two mirror domains serve
the same docs — `developer.repebble.com` and `developer.rebble.io`.

- **C SDK API reference** (all modules, functions, structs):
  https://developer.repebble.com/docs/c/
- **Docs / developer guides home**: https://developer.repebble.com/docs/
- **Watchface tutorial (build a face from scratch, multi-part)**:
  https://developer.repebble.com/tutorials/watchface-tutorial/part1/
  - Part 1: basic time/date face (matches current `main.c`)
  - Part 2: custom fonts & images (resources)
  - Part 3: web content + weather via PebbleKit JS
- **All tutorials**: https://developer.repebble.com/tutorials/
- **Command line tool guide**:
  https://developer.repebble.com/guides/tools-and-resources/pebble-tool/
- **PebbleKit JS (phone-side code)**:
  https://developer.repebble.com/guides/communication/using-pebblekit-js/
- **App configuration (Clay/settings UI)**:
  https://developer.repebble.com/guides/user-interfaces/app-configuration/
- **AppMessage** (watch ↔ phone key-value messaging) — see the C SDK reference
  and the communication guides; this is how a "now playing" face would receive
  track data from the phone.
- **Official agent skill for building Pebble watchfaces**:
  https://github.com/coredevices/pebble-watchface-agent-skill

## Folder structure of a Pebble watchface project

```
.
├── package.json          # App manifest: uuid, displayName, sdkVersion,
│                         #   targetPlatforms, projectType, messageKeys, resources
├── wscript               # waf build script (standard Pebble boilerplate)
├── src/
│   ├── c/                # Native C watch code — compiled per platform
│   │   └── main.c        #   entry point: init() / deinit() / main()
│   └── pkjs/             # PebbleKit JS — phone-side code
│       └── index.js      #   networking, geolocation, AppMessage to/from watch (stub)
├── resources/            # Images & fonts — declared under
│   ├── images/           #   package.json -> pebble.resources.media
│   └── fonts/            #   (.gitkeep placeholders until assets are added)
├── worker_src/c/         # Optional background worker (wscript auto-detects; empty)
└── build/                # waf output incl. the installable .pbw (gitignored)
```

Notes on the manifest ([package.json](package.json)):
- `pebble.projectType: "native"` → C app (vs `rocky` for JS-only faces).
- `pebble.watchapp.watchface: true` → this is a watchface, not a regular app.
- `pebble.targetPlatforms` lists the hardware variants to build for
  (aplite, basalt, chalk, diorite, emery, flint, gabbro).
- `pebble.messageKeys` → keys for AppMessage; populate when adding JS comms.
- `pebble.resources.media` → register fonts/images placed under `resources/`.

## C app lifecycle (see [src/c/main.c](src/c/main.c))

- `main()` → calls `init()`, then `app_event_loop()`, then `deinit()`.
- `init()` → create `Window`, set window handlers (`.load` / `.unload`),
  `window_stack_push()`, subscribe to services (e.g. `tick_timer_service_subscribe`).
- `main_window_load()` → create UI layers (`TextLayer`, etc.) and add them to the
  window's root layer.
- `main_window_unload()` → destroy layers.
- `deinit()` → destroy the window.

Core APIs in the current face: `Window`, `TextLayer`, `TickTimerService`.

## Build & run (pebble CLI)

```
pebble new-project --simple NAME       # scaffold a new project (reference)
pebble build                           # compile -> build/*.pbw
pebble install --emulator basalt       # run in emulator (aplite|basalt|chalk|...)
pebble install --phone <IP>            # install to watch via paired phone on Wi-Fi
pebble logs                            # stream app logs from emulator/watch
pebble screenshot [FILENAME]           # capture screen
pebble clean                           # remove build artifacts
pebble ping                            # verify watch connection
```

Requires the Pebble SDK / `pebble` tool installed locally (Rebble-maintained fork).
```
