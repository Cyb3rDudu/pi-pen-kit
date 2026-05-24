#!/bin/bash
set -euo pipefail

echo "=== pi-sliver CI test runner ==="

# ----------------------------------------------------------------
# 1. Start Sliver server
# ----------------------------------------------------------------
echo "[1/6] Starting Sliver server..."
mkdir -p /root/.sliver-client/configs

# First run: unpack assets
sliver-server unpack -f 2>/dev/null || true

# Start server in background
sliver-server daemon --lhost 127.0.0.1 --lport 31337 &
SLIVER_PID=$!

# Wait for the server to be ready (port 31337 accepting connections)
echo "  Waiting for gRPC port..."
for i in $(seq 1 30); do
  if curl -sf -o /dev/null 127.0.0.1:31337 2>/dev/null || nc -z 127.0.0.1 31337 2>/dev/null; then
    echo "  Server is up on port 31337"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "  ERROR: Sliver server failed to start"
    exit 1
  fi
  sleep 1
done

# Generate operator config
sliver-server operator --name ci --lhost 127.0.0.1 --lport 31337 --permissions all --save /root/.sliver-client/configs

echo "  Operator config generated:"
ls -la /root/.sliver-client/configs/

# ----------------------------------------------------------------
# 2. Wait for target container to be reachable
# ----------------------------------------------------------------
echo "  [2/6] Waiting for target container at ${TARGET_IP}:8080..."
for i in $(seq 1 30); do
  if curl -sf -o /dev/null "http://${TARGET_IP}:8080/ready" 2>/dev/null; then
    echo "  Target is up"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "  WARN: Target not responding, continuing anyway"
  fi
  sleep 2
done

# ----------------------------------------------------------------
# 3. Configure Pi settings
# ----------------------------------------------------------------
echo "[3/6] Configuring Pi agent..."
mkdir -p /root/.pi/agent/sessions

cat > /root/.pi/agent/settings.json << EOF
{
  "defaultProvider": "ci-llm",
  "defaultModel": "deepseek-v4-flash",
  "defaultThinkingLevel": "off",
  "packages": [
    "/opt/pi-pen-kit/pi-sliver"
  ]
}
EOF

cat > /root/.pi/agent/models.json << EOF
{
  "providers": {
    "ci-llm": {
      "baseUrl": "https://api.deepseek.com/v1",
      "api": "openai-completions",
      "apiKey": "${LLM_API_KEY}",
      "models": [
        {
          "id": "deepseek-v4-flash",
          "name": "DeepSeek V4 Flash",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 65536,
          "maxTokens": 4096,
          "toolCalling": true
        }
      ]
    }
  }
}
EOF

echo "  Settings written"

# ----------------------------------------------------------------
# 4. Run Pi in print mode with the test prompt
# ----------------------------------------------------------------
echo "[4/6] Running Pi test suite..."
cd /opt/pi-pen-kit

pi -p ci/test-prompt.md 2>&1 | tee /tmp/pi-test-output.txt
PI_EXIT=$?

# ----------------------------------------------------------------
# 5. Parse results
# ----------------------------------------------------------------
echo "[5/6] Parsing test results..."

PASS_COUNT=$(grep -cE '\[PASS\]|\`\[PASS\]\`' /tmp/pi-test-output.txt || echo 0)
FAIL_COUNT=$(grep -cE '\[FAIL\]|\`\[FAIL\]\`' /tmp/pi-test-output.txt || echo 0)

echo ""
echo "========================================="
echo "  PASSED: ${PASS_COUNT}"
echo "  FAILED: ${FAIL_COUNT}"
echo "========================================="
echo ""

if [ "${FAIL_COUNT}" -gt 0 ]; then
  echo "!!! FAILURES !!!"
  grep '\[FAIL\]' /tmp/pi-test-output.txt
fi

# ----------------------------------------------------------------
# 6. Cleanup
# ----------------------------------------------------------------
echo "[6/6] Cleanup..."
kill ${SLIVER_PID} 2>/dev/null || true

if [ "${FAIL_COUNT}" -gt 0 ]; then
  exit 1
fi

# Fix: 0 passes should also fail
if [ "${PASS_COUNT}" -lt 1 ]; then
  echo "ERROR: No tests passed — LLM likely did not execute tools"
  exit 1
fi

if [ "${PASS_COUNT}" -lt 20 ]; then
  echo "ERROR: Too few tests passed (expected >=20, got ${PASS_COUNT})"
  exit 1
fi

echo "=== All tests passed ==="
exit 0
