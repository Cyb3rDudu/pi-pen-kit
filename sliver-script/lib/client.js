"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliverClient = exports.InteractiveSession = exports.InteractiveBeacon = void 0;
const node_zlib_1 = require("node:zlib");
const node_util_1 = require("node:util");
const nice_grpc_1 = require("nice-grpc");
const rxjs_1 = require("rxjs");
const credentials_1 = require("./internal/credentials");
const timeout_1 = require("./internal/timeout");
const tunnelManager_1 = require("./internal/tunnelManager");
const client_1 = require("./pb/clientpb/client");
const services_1 = require("./pb/rpcpb/services");
const sliver_1 = require("./pb/sliverpb/sliver");
const gzip = (0, node_util_1.promisify)(node_zlib_1.gzip);
const gunzip = (0, node_util_1.promisify)(node_zlib_1.gunzip);
const DEFAULT_TIMEOUT_SECONDS = 30;
const KiB = 1024;
const MiB = 1024 * KiB;
const GiB = 1024 * MiB;
class BaseCommands {
    rpc;
    constructor(rpc) {
        this.rpc = rpc;
    }
    request(timeoutSeconds) {
        return { Async: false, Timeout: `${timeoutSeconds}`, BeaconID: "", SessionID: "" };
    }
    async unary(timeoutSeconds, fn) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, fn);
    }
    ping(nonce, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.ping({ Nonce: nonce, Request: this.request(timeoutSeconds) }, { signal }));
    }
    ps(fullInfo = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.ps({ FullInfo: fullInfo, Request: this.request(timeoutSeconds) }, { signal }));
    }
    ls(path = ".", timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.ls({ Path: path, Request: this.request(timeoutSeconds) }, { signal }));
    }
    download(path, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, async (signal) => {
            const download = await this.rpc.download({ Path: path, Request: this.request(timeoutSeconds) }, { signal });
            if (download.Encoder === "gzip") {
                return await gunzip(download.Data);
            }
            if (download.Encoder !== "") {
                throw new Error(`Unsupported encoder: ${download.Encoder}`);
            }
            return download.Data;
        });
    }
    upload(path, data, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, async (signal) => {
            const payload = await gzip(data);
            return this.rpc.upload({ Path: path, Encoder: "gzip", Data: payload, Request: this.request(timeoutSeconds) }, { signal });
        });
    }
    terminate(pid, force = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.terminate({ Pid: pid, Force: force, Request: this.request(timeoutSeconds) }, { signal }));
    }
    ifconfig(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.ifconfig({ Request: this.request(timeoutSeconds) }, { signal }));
    }
    netstat(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.netstat({ Request: this.request(timeoutSeconds) }, { signal }));
    }
    cd(path, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.cd({ Path: path, Request: this.request(timeoutSeconds) }, { signal }));
    }
    pwd(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.pwd({ Request: this.request(timeoutSeconds) }, { signal }));
    }
    rm(path, recursive = false, force = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.rm({ Path: path, Recursive: recursive, Force: force, Request: this.request(timeoutSeconds) }, { signal }));
    }
    mkdir(path, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.mkdir({ Path: path, Request: this.request(timeoutSeconds) }, { signal }));
    }
    processDump(pid, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.processDump({ Pid: pid, Request: this.request(timeoutSeconds) }, { signal }));
    }
    runAs(userName, processName, args, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.runAs({ Username: userName, ProcessName: processName, Args: args, Request: this.request(timeoutSeconds) }, { signal }));
    }
    impersonate(userName, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.impersonate({ Username: userName, Request: this.request(timeoutSeconds) }, { signal }));
    }
    revToSelf(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.revToSelf({ Request: this.request(timeoutSeconds) }, { signal }));
    }
    getSystem(hostingProcess, config, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.getSystem({ HostingProcess: hostingProcess, Config: config, Request: this.request(timeoutSeconds) }, { signal }));
    }
    /**
     * Execute arbitrary shellcode (aka "task" in Sliver terminology).
     *
     * Note: For beacon interactions this will queue an async task; use the
     * returned Response.TaskID to fetch results.
     */
    task(pid, shellcode, encoder = "", rwxPages = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.task({
            Pid: pid,
            Data: shellcode,
            Encoder: encoder,
            RWXPages: rwxPages,
            Request: this.request(timeoutSeconds),
        }, { signal }));
    }
    msf(payload, lhost, lport, encoder = "", iterations = 0, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.msf({ Payload: payload, LHost: lhost, LPort: lport, Encoder: encoder, Iterations: iterations, Request: this.request(timeoutSeconds) }, { signal }));
    }
    msfRemote(pid, payload, lhost, lport, encoder = "", iterations = 0, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.msfRemote({ PID: pid, Payload: payload, LHost: lhost, LPort: lport, Encoder: encoder, Iterations: iterations, Request: this.request(timeoutSeconds) }, { signal }));
    }
    executeAssembly(assembly, args = [], process = "", timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.executeAssembly({ Assembly: assembly, Arguments: args, Process: process, Request: this.request(timeoutSeconds) }, { signal }));
    }
    migrate(pid, config, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.migrate({ Pid: pid, Config: config, Request: this.request(timeoutSeconds) }, { signal }));
    }
    execute(exe, args = [], output = true, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.execute({ Path: exe, Args: args, Output: output, Request: this.request(timeoutSeconds) }, { signal }));
    }
    sideload(data, processName, args = [], entryPoint, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.sideload({ Data: data, ProcessName: processName, Args: args, EntryPoint: entryPoint, Request: this.request(timeoutSeconds) }, { signal }));
    }
    spawnDll(data, entrypoint, processName, args = [], timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.spawnDll({ Data: data, EntryPoint: entrypoint, ProcessName: processName, Args: args, Request: this.request(timeoutSeconds) }, { signal }));
    }
    screenshot(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.unary(timeoutSeconds, (signal) => this.rpc.screenshot({ Request: this.request(timeoutSeconds) }, { signal }));
    }
}
class InteractiveBeacon extends BaseCommands {
    taskResult$;
    beaconId;
    constructor(rpc, taskResult$, beaconId) {
        super(rpc);
        this.taskResult$ = taskResult$;
        this.beaconId = beaconId;
    }
    request(timeoutSeconds) {
        return {
            Async: true,
            Timeout: `${timeoutSeconds}`,
            BeaconID: this.beaconId,
            SessionID: "",
        };
    }
    /** Generic beacon task queue — call fn, extract TaskID, return { id, wait } */
    async queueTask(fn, decode, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const raw = await fn();
        if (raw.Response?.Err) {
            throw new Error(raw.Response.Err);
        }
        const taskId = raw.Response?.TaskID;
        if (!taskId) {
            throw new Error("Missing beacon task id");
        }
        return {
            id: taskId,
            wait: async (waitTimeoutSeconds = timeoutSeconds) => {
                const beaconTask = await waitForBeaconTask(this.taskResult$, taskId, waitTimeoutSeconds);
                const taskContent = await this.unary(waitTimeoutSeconds, (signal) => this.rpc.getBeaconTaskContent({ ID: beaconTask.ID }, { signal }));
                return decode(taskContent.Response);
            },
        };
    }
    async lsTask(path = ".", timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.queueTask(() => super.ls(path, timeoutSeconds), sliver_1.Ls.decode, timeoutSeconds);
    }
    async ls(path = ".", timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const t = await this.lsTask(path, timeoutSeconds);
        return t.wait(timeoutSeconds);
    }
    async executeTask(exe, args = [], output = true, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.queueTask(() => super.execute(exe, args, output, timeoutSeconds), sliver_1.Execute.decode, timeoutSeconds);
    }
    async execute(exe, args = [], output = true, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const t = await this.executeTask(exe, args, output, timeoutSeconds);
        return t.wait(timeoutSeconds);
    }
    async pwdTask(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.queueTask(() => super.pwd(timeoutSeconds), sliver_1.Pwd.decode, timeoutSeconds);
    }
    async pwd(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const t = await this.pwdTask(timeoutSeconds);
        return t.wait(timeoutSeconds);
    }
    async cdTask(path, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.queueTask(() => super.cd(path, timeoutSeconds), sliver_1.Pwd.decode, timeoutSeconds);
    }
    async cd(path, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const t = await this.cdTask(path, timeoutSeconds);
        return t.wait(timeoutSeconds);
    }
    async rmTask(path, recursive = false, force = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.queueTask(() => super.rm(path, recursive, force, timeoutSeconds), sliver_1.Rm.decode, timeoutSeconds);
    }
    async rm(path, recursive = false, force = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const t = await this.rmTask(path, recursive, force, timeoutSeconds);
        return t.wait(timeoutSeconds);
    }
    async mkdirTask(path, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.queueTask(() => super.mkdir(path, timeoutSeconds), sliver_1.Mkdir.decode, timeoutSeconds);
    }
    async mkdir(path, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const t = await this.mkdirTask(path, timeoutSeconds);
        return t.wait(timeoutSeconds);
    }
    async download(path, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        // Download RPC returns a TaskID (unlike session downloads which return data).
        // Queue the task, wait for the beacon to check in, then fetch the content.
        const raw = await super.download(path, timeoutSeconds);
        if (raw.Response?.Err) {
            throw new Error(raw.Response.Err);
        }
        const taskId = raw.Response?.TaskID;
        if (!taskId) {
            throw new Error("Missing beacon task id for download");
        }
        const beaconTask = await waitForBeaconTask(this.taskResult$, taskId, timeoutSeconds);
        const taskContent = await this.unary(timeoutSeconds, (signal) => this.rpc.getBeaconTaskContent({ ID: beaconTask.ID }, { signal }));
        // Download content is the raw task content (not a proto message)
        const data = taskContent.Response;
        if (data instanceof Uint8Array || Buffer.isBuffer(data)) {
            // Check if gzipped
            if (data.length >= 2 && data[0] === 0x1f && data[1] === 0x8b) {
                return gunzip(data);
            }
            return Buffer.isBuffer(data) ? data : Buffer.from(data);
        }
        throw new Error(`Unexpected download content type: ${typeof data}`);
    }
    async upload(path, data, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        // Upload RPC for beacons returns a TaskID — wait for the implant to acknowledge it.
        const raw = await super.upload(path, data, timeoutSeconds);
        if (raw.Response?.Err) {
            throw new Error(raw.Response.Err);
        }
        const taskId = raw.Response?.TaskID;
        if (!taskId) {
            // No TaskID means the server handled it synchronously — upload succeeded
            return raw;
        }
        await waitForBeaconTask(this.taskResult$, taskId, timeoutSeconds);
        return raw;
    }
    async psTask(fullInfo = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.queueTask(() => super.ps(fullInfo, timeoutSeconds), sliver_1.Ps.decode, timeoutSeconds);
    }
    async ps(fullInfo = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const t = await this.psTask(fullInfo, timeoutSeconds);
        return t.wait(timeoutSeconds);
    }
    async ifconfigTask(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.queueTask(() => super.ifconfig(timeoutSeconds), sliver_1.Ifconfig.decode, timeoutSeconds);
    }
    async ifconfig(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const t = await this.ifconfigTask(timeoutSeconds);
        return t.wait(timeoutSeconds);
    }
    async netstatTask(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.queueTask(() => super.netstat(timeoutSeconds), sliver_1.Netstat.decode, timeoutSeconds);
    }
    async netstat(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const t = await this.netstatTask(timeoutSeconds);
        return t.wait(timeoutSeconds);
    }
    async terminateTask(pid, force = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.queueTask(() => super.terminate(pid, force, timeoutSeconds), sliver_1.Terminate.decode, timeoutSeconds);
    }
    async terminate(pid, force = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const t = await this.terminateTask(pid, force, timeoutSeconds);
        return t.wait(timeoutSeconds);
    }
    async screenshotTask(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return this.queueTask(() => super.screenshot(timeoutSeconds), sliver_1.Screenshot.decode, timeoutSeconds);
    }
    async screenshot(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const t = await this.screenshotTask(timeoutSeconds);
        return t.wait(timeoutSeconds);
    }
}
exports.InteractiveBeacon = InteractiveBeacon;
class InteractiveSession extends BaseCommands {
    tunnels;
    sessionId;
    constructor(rpc, tunnels, sessionId) {
        super(rpc);
        this.tunnels = tunnels;
        this.sessionId = sessionId;
    }
    request(timeoutSeconds) {
        return {
            Async: false,
            Timeout: `${timeoutSeconds}`,
            BeaconID: "",
            SessionID: this.sessionId,
        };
    }
    async shell(path, pty = true, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const tunnel = await this.unary(timeoutSeconds, (signal) => this.rpc.createTunnel({ SessionID: this.sessionId }, { signal }));
        if (!tunnel?.TunnelID) {
            throw new Error("Failed to create tunnel");
        }
        const tunnelId = tunnel.TunnelID;
        // Subscribe first so we don't miss early data.
        const stdout$ = this.tunnels.subscribe(tunnelId).pipe((0, rxjs_1.filter)((msg) => msg.TunnelID === tunnelId), (0, rxjs_1.filter)((msg) => msg.Data.length > 0), (0, rxjs_1.map)((msg) => msg.Data));
        // Bind tunnel to the tunnel stream.
        this.tunnels.send({ TunnelID: tunnelId, SessionID: this.sessionId });
        // Ask the implant to open a shell on the bound tunnel.
        await this.unary(timeoutSeconds, (signal) => this.rpc.shell({
            Path: path,
            EnablePTY: pty,
            TunnelID: tunnelId,
            Request: this.request(timeoutSeconds),
        }, { signal }));
        return {
            id: tunnelId,
            stdout$,
            write: (data) => {
                const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
                this.tunnels.send({ TunnelID: tunnelId, SessionID: this.sessionId, Data: buf });
            },
            close: async () => {
                await this.unary(DEFAULT_TIMEOUT_SECONDS, (signal) => this.rpc.closeTunnel({ TunnelID: tunnelId, SessionID: this.sessionId }, { signal }));
            },
        };
    }
}
exports.InteractiveSession = InteractiveSession;
class SliverClient {
    config;
    static EVENT_BEACON_REGISTERED = "beacon-registered";
    static EVENT_BEACON_TASKRESULT = "beacon-taskresult";
    empty = {};
    rpcClient = null;
    channel = null;
    eventsAbort = null;
    tunnels = null;
    eventSubject = new rxjs_1.Subject();
    event$ = this.eventSubject.asObservable();
    session$ = this.event$.pipe((0, rxjs_1.filter)((event) => event.Session !== undefined));
    job$ = this.event$.pipe((0, rxjs_1.filter)((event) => event.Job !== undefined));
    client$ = this.event$.pipe((0, rxjs_1.filter)((event) => event.Client !== undefined));
    beacon$ = this.event$.pipe((0, rxjs_1.filter)((event) => event.EventType === SliverClient.EVENT_BEACON_REGISTERED));
    taskResult$ = this.event$.pipe((0, rxjs_1.filter)((event) => event.EventType === SliverClient.EVENT_BEACON_TASKRESULT));
    constructor(config) {
        this.config = config;
    }
    rpcHost() {
        return `${this.config.lhost}:${this.config.lport}`;
    }
    get rpc() {
        if (!this.rpcClient) {
            throw new Error("SliverClient is not connected");
        }
        return this.rpcClient;
    }
    get isConnected() {
        return this.rpcClient !== null;
    }
    async connect() {
        if (this.rpcClient)
            return this;
        this.eventsAbort = new AbortController();
        this.tunnels = new tunnelManager_1.TunnelManager();
        const creds = (0, credentials_1.createSliverRpcCredentials)(this.config);
        this.channel = (0, nice_grpc_1.createChannel)(this.rpcHost(), creds, {
            "grpc.max_send_message_length": (2 * GiB) - 1,
            "grpc.max_receive_message_length": (2 * GiB) - 1,
        });
        this.rpcClient = (0, nice_grpc_1.createClient)(services_1.SliverRPCDefinition, this.channel);
        // Ensure auth and connectivity are working before we start streams.
        await this.getVersion();
        this.tunnels.start(this.rpcClient);
        this.startEventsStream();
        return this;
    }
    async disconnect() {
        this.eventsAbort?.abort();
        this.eventsAbort = null;
        await this.tunnels?.stop();
        this.tunnels = null;
        this.rpcClient = null;
        this.channel?.close();
        this.channel = null;
    }
    startEventsStream() {
        const rpc = this.rpcClient;
        const abort = this.eventsAbort;
        if (!rpc || !abort)
            return;
        (async () => {
            try {
                const stream = rpc.events(this.empty, { signal: abort.signal });
                for await (const event of stream) {
                    this.eventSubject.next(event);
                }
            }
            catch (err) {
                // Abort is expected on disconnect; don't surface as an error.
                if (abort.signal.aborted) {
                    return;
                }
                this.eventSubject.error(err);
            }
        })();
    }
    // --- Convenience APIs (typed, promise-based) ---
    getVersion(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.getVersion(this.empty, { signal }));
    }
    getOperators(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.getOperators(this.empty, { signal }));
    }
    getSessions(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.getSessions(this.empty, { signal }));
    }
    getBeacons(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.getBeacons(this.empty, { signal }));
    }
    getJobs(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.getJobs(this.empty, { signal }));
    }
    killJob(jobId, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.killJob({ ID: jobId }, { signal }));
    }
    restartJobs(jobIds, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, async (signal) => {
            await this.rpc.restartJobs({ JobIDs: jobIds }, { signal });
        });
    }
    startMTLSListener(host, port, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.startMTLSListener({ Host: host, Port: port }, { signal }));
    }
    startWGListener(host, port, tunIP, nPort, keyPort, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.startWGListener({ Host: host, Port: port, TunIP: tunIP, NPort: nPort, KeyPort: keyPort }, { signal }));
    }
    startDNSListener(domains, canaries, host, port, enforceOTP = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.startDNSListener({ Domains: domains, Canaries: canaries, Host: host, Port: port, EnforceOTP: enforceOTP }, { signal }));
    }
    startHTTPListener(domain, host, port, website = "", enforceOTP = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.startHTTPListener({ Domain: domain, Host: host, Port: port, Secure: false, Website: website, EnforceOTP: enforceOTP }, { signal }));
    }
    startHTTPSListener(domain, host, port, website = "", acme = false, cert, key, enforceOTP = false, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.startHTTPSListener({
            Domain: domain,
            Host: host,
            Port: port,
            Secure: true,
            Website: website,
            ACME: acme,
            Cert: cert ?? Buffer.alloc(0),
            Key: key ?? Buffer.alloc(0),
            EnforceOTP: enforceOTP,
        }, { signal }));
    }
    startTCPStagerListener(host, port, data, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.startTCPStagerListener({ Protocol: 0, Host: host, Port: port, Data: data }, { signal }));
    }
    async generate(config, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const res = await (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.generate({ Config: config }, { signal }));
        return res.File;
    }
    generateSpoofMetadata(req, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, async (signal) => {
            await this.rpc.generateSpoofMetadata(req, { signal });
        });
    }
    async regenerate(implantName, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const res = await (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.regenerate({ ImplantName: implantName }, { signal }));
        return res.File;
    }
    implantBuilds(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.implantBuilds(this.empty, { signal }));
    }
    deleteImplantBuild(name, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, async (signal) => {
            await this.rpc.deleteImplantBuild({ Name: name }, { signal });
        });
    }
    canaries(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.canaries(this.empty, { signal }));
    }
    implantProfiles(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.implantProfiles(this.empty, { signal }));
    }
    saveImplantProfile(profile, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.saveImplantProfile(profile, { signal }));
    }
    deleteImplantProfile(name, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, async (signal) => {
            await this.rpc.deleteImplantProfile({ Name: name }, { signal });
        });
    }
    lootAll(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, async (signal) => {
            const res = await this.rpc.lootAll(this.empty, { signal });
            return res.Loot;
        });
    }
    lootAdd(loot, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.lootAdd(loot, { signal }));
    }
    lootUpdate(loot, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.lootUpdate(loot, { signal }));
    }
    lootRemove(lootId, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, async (signal) => {
            await this.rpc.lootRm({ ID: lootId }, { signal });
        });
    }
    lootContent(lootId, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.lootContent({ ID: lootId }, { signal }));
    }
    websites(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, async (signal) => {
            const res = await this.rpc.websites(this.empty, { signal });
            return res.Websites;
        });
    }
    website(name, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.website({ Name: name }, { signal }));
    }
    websiteRemove(name, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, async (signal) => {
            await this.rpc.websiteRemove({ Name: name }, { signal });
        });
    }
    websiteAddContent(name, contents, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.websiteAddContent({ Name: name, Contents: contents }, { signal }));
    }
    websiteUpdateContent(name, contents, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.websiteUpdateContent({ Name: name, Contents: contents }, { signal }));
    }
    websiteRemoveContent(name, paths, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        return (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.websiteRemoveContent({ Name: name, Paths: paths }, { signal }));
    }
    // --- High-level helpers (ergonomic wrappers) ---
    async operators(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const res = await this.getOperators(timeoutSeconds);
        return res.Operators;
    }
    async sessions(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const res = await this.getSessions(timeoutSeconds);
        return res.Sessions;
    }
    async beacons(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const res = await this.getBeacons(timeoutSeconds);
        return res.Beacons;
    }
    async jobs(timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        const res = await this.getJobs(timeoutSeconds);
        return res.Active;
    }
    interactSession(sessionId) {
        if (!this.tunnels) {
            throw new Error("SliverClient is not connected");
        }
        return new InteractiveSession(this.rpc, this.tunnels, sessionId);
    }
    interactBeacon(beaconId) {
        return new InteractiveBeacon(this.rpc, this.taskResult$, beaconId);
    }
    async rmBeacon(beaconId, timeoutSeconds = DEFAULT_TIMEOUT_SECONDS) {
        await (0, timeout_1.withTimeoutSignal)(timeoutSeconds, (signal) => this.rpc.rmBeacon({ ID: beaconId }, { signal }));
    }
}
exports.SliverClient = SliverClient;
async function waitForBeaconTask(taskResult$, taskId, timeoutSeconds) {
    return new Promise((resolve, reject) => {
        const timeoutMs = Math.floor(timeoutSeconds * 1000);
        let receivedWrongId = false;
        const timer = setTimeout(() => {
            sub.unsubscribe();
            reject(new Error(`Timeout waiting for beacon task result: ${taskId}${receivedWrongId ? " (received task results for other tasks but not this one)" : ""}`));
        }, timeoutMs);
        const sub = taskResult$.subscribe({
            next: (event) => {
                try {
                    const task = client_1.BeaconTask.decode(event.Data);
                    if (task.ID !== taskId) {
                        receivedWrongId = true;
                        return;
                    }
                    clearTimeout(timer);
                    sub.unsubscribe();
                    resolve(task);
                }
                catch (err) {
                    clearTimeout(timer);
                    sub.unsubscribe();
                    reject(new Error(`Failed to decode beacon task result: ${err instanceof Error ? err.message : String(err)}`));
                }
            },
            error: (err) => {
                clearTimeout(timer);
                sub.unsubscribe();
                reject(err);
            },
        });
    });
}
