import { type Observable } from "rxjs";
import type { SliverClientConfig } from "./config";
import { TunnelManager } from "./internal/tunnelManager";
import type { Event, Operators, Sessions, Version, Beacons, Jobs, Beacon, GenerateSpoofMetadataReq, ImplantConfig, ImplantProfile, Loot, WebContent } from "./pb/clientpb/client";
import type { Request as CommonRequest } from "./pb/commonpb/common";
import type { SliverRPCClient } from "./pb/rpcpb/services";
import { Ls, Execute, Pwd, Rm, Mkdir, Download, Upload, Ps, Ifconfig, Netstat, Terminate, Screenshot } from "./pb/sliverpb/sliver";
export interface Tunnel {
    readonly id: string;
    readonly stdout$: Observable<Buffer>;
    write(data: Buffer | string): void;
    close(): Promise<void>;
}
declare class BaseCommands {
    protected readonly rpc: SliverRPCClient;
    constructor(rpc: SliverRPCClient);
    protected request(timeoutSeconds: number): CommonRequest;
    protected unary<T>(timeoutSeconds: number, fn: (signal: AbortSignal) => Promise<T>): Promise<T>;
    ping(nonce: number, timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").Ping>;
    ps(fullInfo?: boolean, timeoutSeconds?: number): Promise<Ps>;
    ls(path?: string, timeoutSeconds?: number): Promise<Ls>;
    download(path: string, timeoutSeconds?: number): Promise<Buffer>;
    upload(path: string, data: Buffer, timeoutSeconds?: number): Promise<Upload>;
    terminate(pid: number, force?: boolean, timeoutSeconds?: number): Promise<Terminate>;
    ifconfig(timeoutSeconds?: number): Promise<Ifconfig>;
    netstat(timeoutSeconds?: number): Promise<Netstat>;
    cd(path: string, timeoutSeconds?: number): Promise<Pwd>;
    pwd(timeoutSeconds?: number): Promise<Pwd>;
    rm(path: string, recursive?: boolean, force?: boolean, timeoutSeconds?: number): Promise<Rm>;
    mkdir(path: string, timeoutSeconds?: number): Promise<Mkdir>;
    processDump(pid: number, timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").ProcessDump>;
    runAs(userName: string, processName: string, args: string, timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").RunAs>;
    impersonate(userName: string, timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").Impersonate>;
    revToSelf(timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").RevToSelf>;
    getSystem(hostingProcess: string, config: ImplantConfig, timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").GetSystem>;
    /**
     * Execute arbitrary shellcode (aka "task" in Sliver terminology).
     *
     * Note: For beacon interactions this will queue an async task; use the
     * returned Response.TaskID to fetch results.
     */
    task(pid: number, shellcode: Buffer, encoder?: string, rwxPages?: boolean, timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").Task>;
    msf(payload: string, lhost: string, lport: number, encoder?: string, iterations?: number, timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").Task>;
    msfRemote(pid: number, payload: string, lhost: string, lport: number, encoder?: string, iterations?: number, timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").Task>;
    executeAssembly(assembly: Buffer, args?: string[], process?: string, timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").ExecuteAssembly>;
    migrate(pid: number, config: ImplantConfig, timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").Migrate>;
    execute(exe: string, args?: string[], output?: boolean, timeoutSeconds?: number): Promise<Execute>;
    sideload(data: Buffer, processName: string, args: string[] | undefined, entryPoint: string, timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").Sideload>;
    spawnDll(data: Buffer, entrypoint: string, processName: string, args?: string[], timeoutSeconds?: number): Promise<import("./pb/sliverpb/sliver").SpawnDll>;
    screenshot(timeoutSeconds?: number): Promise<Screenshot>;
}
export declare class InteractiveBeacon extends BaseCommands {
    private readonly taskResult$;
    private readonly beaconId;
    constructor(rpc: SliverRPCClient, taskResult$: Observable<Event>, beaconId: string);
    protected request(timeoutSeconds: number): CommonRequest;
    /** Generic beacon task queue — call fn, extract TaskID, return { id, wait } */
    private queueTask;
    lsTask(path?: string, timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Ls>;
    }>;
    ls(path?: string, timeoutSeconds?: number): Promise<Ls>;
    executeTask(exe: string, args?: string[], output?: boolean, timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Execute>;
    }>;
    execute(exe: string, args?: string[], output?: boolean, timeoutSeconds?: number): Promise<Execute>;
    pwdTask(timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Pwd>;
    }>;
    pwd(timeoutSeconds?: number): Promise<Pwd>;
    cdTask(path: string, timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Pwd>;
    }>;
    cd(path: string, timeoutSeconds?: number): Promise<Pwd>;
    rmTask(path: string, recursive?: boolean, force?: boolean, timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Rm>;
    }>;
    rm(path: string, recursive?: boolean, force?: boolean, timeoutSeconds?: number): Promise<Rm>;
    mkdirTask(path: string, timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Mkdir>;
    }>;
    mkdir(path: string, timeoutSeconds?: number): Promise<Mkdir>;
    downloadTask(path: string, timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Download>;
    }>;
    download(path: string, timeoutSeconds?: number): Promise<Buffer>;
    uploadTask(path: string, data: Buffer, timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Upload>;
    }>;
    upload(path: string, data: Buffer, timeoutSeconds?: number): Promise<Upload>;
    psTask(fullInfo?: boolean, timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Ps>;
    }>;
    ps(fullInfo?: boolean, timeoutSeconds?: number): Promise<Ps>;
    ifconfigTask(timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Ifconfig>;
    }>;
    ifconfig(timeoutSeconds?: number): Promise<Ifconfig>;
    netstatTask(timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Netstat>;
    }>;
    netstat(timeoutSeconds?: number): Promise<Netstat>;
    terminateTask(pid: number, force?: boolean, timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Terminate>;
    }>;
    terminate(pid: number, force?: boolean, timeoutSeconds?: number): Promise<Terminate>;
    screenshotTask(timeoutSeconds?: number): Promise<{
        id: any;
        wait: (waitTimeoutSeconds?: number) => Promise<Screenshot>;
    }>;
    screenshot(timeoutSeconds?: number): Promise<Screenshot>;
}
export declare class InteractiveSession extends BaseCommands {
    private readonly tunnels;
    private readonly sessionId;
    constructor(rpc: SliverRPCClient, tunnels: TunnelManager, sessionId: string);
    protected request(timeoutSeconds: number): CommonRequest;
    shell(path: string, pty?: boolean, timeoutSeconds?: number): Promise<Tunnel>;
}
export declare class SliverClient {
    readonly config: SliverClientConfig;
    static readonly EVENT_BEACON_REGISTERED = "beacon-registered";
    static readonly EVENT_BEACON_TASKRESULT = "beacon-taskresult";
    private readonly empty;
    private rpcClient;
    private channel;
    private eventsAbort;
    private tunnels;
    private readonly eventSubject;
    readonly event$: Observable<Event>;
    readonly session$: Observable<Event & {
        Session: NonNullable<Event["Session"]>;
    }>;
    readonly job$: Observable<Event & {
        Job: NonNullable<Event["Job"]>;
    }>;
    readonly client$: Observable<Event & {
        Client: NonNullable<Event["Client"]>;
    }>;
    readonly beacon$: Observable<Event>;
    readonly taskResult$: Observable<Event>;
    constructor(config: SliverClientConfig);
    rpcHost(): string;
    get rpc(): SliverRPCClient;
    get isConnected(): boolean;
    connect(): Promise<this>;
    disconnect(): Promise<void>;
    private startEventsStream;
    getVersion(timeoutSeconds?: number): Promise<Version>;
    getOperators(timeoutSeconds?: number): Promise<Operators>;
    getSessions(timeoutSeconds?: number): Promise<Sessions>;
    getBeacons(timeoutSeconds?: number): Promise<Beacons>;
    getJobs(timeoutSeconds?: number): Promise<Jobs>;
    killJob(jobId: number, timeoutSeconds?: number): Promise<import("./pb/clientpb/client").KillJob>;
    restartJobs(jobIds: number[], timeoutSeconds?: number): Promise<void>;
    startMTLSListener(host: string, port: number, timeoutSeconds?: number): Promise<import("./pb/clientpb/client").ListenerJob>;
    startWGListener(host: string, port: number, tunIP: string, nPort: number, keyPort: number, timeoutSeconds?: number): Promise<import("./pb/clientpb/client").ListenerJob>;
    startDNSListener(domains: string[], canaries: boolean, host: string, port: number, enforceOTP?: boolean, timeoutSeconds?: number): Promise<import("./pb/clientpb/client").ListenerJob>;
    startHTTPListener(domain: string, host: string, port: number, website?: string, enforceOTP?: boolean, timeoutSeconds?: number): Promise<import("./pb/clientpb/client").ListenerJob>;
    startHTTPSListener(domain: string, host: string, port: number, website?: string, acme?: boolean, cert?: Buffer, key?: Buffer, enforceOTP?: boolean, timeoutSeconds?: number): Promise<import("./pb/clientpb/client").ListenerJob>;
    startTCPStagerListener(host: string, port: number, data: Buffer, timeoutSeconds?: number): Promise<import("./pb/clientpb/client").StagerListener>;
    generate(config: ImplantConfig, timeoutSeconds?: number): Promise<import("./pb/commonpb/common").File | undefined>;
    generateSpoofMetadata(req: GenerateSpoofMetadataReq, timeoutSeconds?: number): Promise<void>;
    regenerate(implantName: string, timeoutSeconds?: number): Promise<import("./pb/commonpb/common").File | undefined>;
    implantBuilds(timeoutSeconds?: number): Promise<import("./pb/clientpb/client").ImplantBuilds>;
    deleteImplantBuild(name: string, timeoutSeconds?: number): Promise<void>;
    canaries(timeoutSeconds?: number): Promise<import("./pb/clientpb/client").Canaries>;
    implantProfiles(timeoutSeconds?: number): Promise<import("./pb/clientpb/client").ImplantProfiles>;
    saveImplantProfile(profile: ImplantProfile, timeoutSeconds?: number): Promise<ImplantProfile>;
    deleteImplantProfile(name: string, timeoutSeconds?: number): Promise<void>;
    lootAll(timeoutSeconds?: number): Promise<Loot[]>;
    lootAdd(loot: Loot, timeoutSeconds?: number): Promise<Loot>;
    lootUpdate(loot: Loot, timeoutSeconds?: number): Promise<Loot>;
    lootRemove(lootId: string, timeoutSeconds?: number): Promise<void>;
    lootContent(lootId: string, timeoutSeconds?: number): Promise<Loot>;
    websites(timeoutSeconds?: number): Promise<import("./pb/clientpb/client").Website[]>;
    website(name: string, timeoutSeconds?: number): Promise<import("./pb/clientpb/client").Website>;
    websiteRemove(name: string, timeoutSeconds?: number): Promise<void>;
    websiteAddContent(name: string, contents: Record<string, WebContent>, timeoutSeconds?: number): Promise<import("./pb/clientpb/client").Website>;
    websiteUpdateContent(name: string, contents: Record<string, WebContent>, timeoutSeconds?: number): Promise<import("./pb/clientpb/client").Website>;
    websiteRemoveContent(name: string, paths: string[], timeoutSeconds?: number): Promise<import("./pb/clientpb/client").Website>;
    operators(timeoutSeconds?: number): Promise<import("./pb/clientpb/client").Operator[]>;
    sessions(timeoutSeconds?: number): Promise<import("./pb/clientpb/client").Session[]>;
    beacons(timeoutSeconds?: number): Promise<Beacon[]>;
    jobs(timeoutSeconds?: number): Promise<import("./pb/clientpb/client").Job[]>;
    interactSession(sessionId: string): InteractiveSession;
    interactBeacon(beaconId: string): InteractiveBeacon;
    rmBeacon(beaconId: string, timeoutSeconds?: number): Promise<void>;
}
export {};
