# Alien Chat Server

A basic chat server.

## Usage

### Prerequisites

- A [MongoDB](https://www.mongodb.com) database named *chat* with collections: *accounts*, *messages*.

- [Rust & Cargo](https://www.rust-lang.org).

### macOS & Linux (Bash)

If on Mac or Linux, first rename *config.sh.template* to *config.sh* with `mv config.sh.template config.sh`.

Edit *config.sh*, filling in the details for your MongoDB cluster.

Permit the current user to execute *config.sh* with `chmod +x config.sh`.

Devl: `source config.sh; cargo run`

Prod: `source config.sh; cargo run --release`

### Windows (PowerShell)

If on Windows, first rename *config.ps1.template* to *config.ps1* with `Rename-Item "config.ps1.template config.ps1"`.

Edit *config.ps1*, filling in the details for your MongoDB cluster.

Devl: `.\config.ps1; cargo run`

Prod: `.\config.ps1; cargo run --release`
