# Attacker container: Pi + Sliver server + pi-sliver extension under test.
#
# Multi-stage build:
#   1. Download Sliver server + client binaries
#   2. Install Pi, npm install the extension
#   3. Final image with everything wired up

FROM node:22-slim AS base

RUN apt-get update -qq && apt-get install -y -qq \
    curl wget git jq unzip build-essential netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# --- Sliver server + client ---
ARG SLIVER_VERSION=v1.7.3
RUN wget -q "https://github.com/BishopFox/sliver/releases/download/${SLIVER_VERSION}/sliver-server_linux-amd64" \
      -O /usr/local/bin/sliver-server && chmod +x /usr/local/bin/sliver-server \
    && wget -q "https://github.com/BishopFox/sliver/releases/download/${SLIVER_VERSION}/sliver-client_linux-amd64" \
      -O /usr/local/bin/sliver-client || true && chmod +x /usr/local/bin/sliver-client 2>/dev/null || true

# --- Pi coding agent ---
RUN npm install -g @earendil-works/pi-coding-agent && pi --version

# --- Extension source ---
WORKDIR /opt/pi-pen-kit
COPY pi-sliver/ ./pi-sliver/
WORKDIR /opt/pi-pen-kit/pi-sliver
RUN npm install
WORKDIR /opt/pi-pen-kit

# --- CI test prompt ---
COPY .github/test-prompt.md /opt/pi-pen-kit/ci/test-prompt.md

# --- Entrypoint: start Sliver server, configure Pi, run tests ---
COPY .github/attacker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
