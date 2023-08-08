# Alien Chat Server

A basic chat server.

See video [YouTube](https://www.youtube.com/watch?v=84uc37m7QNs)

## Usage

### Prerequisites

- A [MongoDB](https://www.mongodb.com) database named *chat* with collections: *accounts*, *messages*.

- [Rust & Cargo](https://www.rust-lang.org).

- An environment variable for the JWT secret key: `JWT_SECRET_PRIMARY`. This can contain any string you want, however it is recommended to be a 64 character cryptographically generated string. For security purposes, you should regenerate this string before each `cargo run`. **Please note:** This is not meant to be a secure chat platform LOL! It's a PoC / hobby project!

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
