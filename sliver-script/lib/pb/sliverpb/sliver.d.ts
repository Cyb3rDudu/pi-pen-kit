import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { EnvVar, Process, Request, Response } from "../commonpb/common";
export declare const protobufPackage = "sliverpb";
/** Registry - Registry related messages */
export declare enum RegistryType {
    Unknown = 0,
    Binary = 1,
    String = 2,
    DWORD = 3,
    QWORD = 4,
    UNRECOGNIZED = -1
}
export declare function registryTypeFromJSON(object: any): RegistryType;
export declare function registryTypeToJSON(object: RegistryType): string;
export declare enum PivotType {
    TCP = 0,
    UDP = 1,
    NamedPipe = 2,
    UNRECOGNIZED = -1
}
export declare function pivotTypeFromJSON(object: any): PivotType;
export declare function pivotTypeToJSON(object: PivotType): string;
export declare enum PeerFailureType {
    SEND_FAILURE = 0,
    DISCONNECT = 1,
    UNRECOGNIZED = -1
}
export declare function peerFailureTypeFromJSON(object: any): PeerFailureType;
export declare function peerFailureTypeToJSON(object: PeerFailureType): string;
/**
 * Envelope - Used to encode implant<->server messages since we
 *            cannot use gRPC due to the various transports used.
 */
export interface Envelope {
    /** Envelope ID used to track request/response */
    ID: string;
    /** Message type */
    Type: number;
    /** Actual message data */
    Data: Buffer;
    /** Set if the implant did not understand the message */
    UnknownMessageType: boolean;
}
/** BeaconTasks - DO NOT CONFUSE WITH clientpb.BeaconTasks */
export interface BeaconTasks {
    ID: string;
    Tasks: Envelope[];
    NextCheckin: string;
}
/** Register - First message the implant sends to the server */
export interface Register {
    Name: string;
    Hostname: string;
    Uuid: string;
    Username: string;
    Uid: string;
    Gid: string;
    Os: string;
    Arch: string;
    Pid: number;
    Filename: string;
    ActiveC2: string;
    Version: string;
    ReconnectInterval: string;
    ProxyURL: string;
    ConfigID: string;
    PeerID: string;
    Locale: string;
}
export interface BeaconRegister {
    ID: string;
    Interval: string;
    Jitter: string;
    Register?: Register | undefined;
    NextCheckin: string;
}
export interface SessionRegister {
    ID: string;
    Register?: Register | undefined;
}
export interface OpenSession {
    C2s: string[];
    Delay: string;
    Response?: Response | undefined;
    Request?: Request | undefined;
}
export interface CloseSession {
    Response?: Response | undefined;
    Request?: Request | undefined;
}
/**
 * Ping - Not ICMP, just sends a rount trip message to an implant to
 *        see if it's still responding.
 */
export interface Ping {
    Nonce: number;
    /** Ping is special */
    Response?: Response | undefined;
    Request?: Request | undefined;
}
/** KillSessionReq - Request the implant to kill a session */
export interface KillReq {
    Force: boolean;
    Request?: Request | undefined;
}
/** PsReq - Request the implant to list processes of a remote session. */
export interface PsReq {
    FullInfo: boolean;
    Request?: Request | undefined;
}
export interface Ps {
    Processes: Process[];
    Response?: Response | undefined;
}
/** TerminateReq - Request the implant terminate a remote processes */
export interface TerminateReq {
    Pid: number;
    Force: boolean;
    Request?: Request | undefined;
}
export interface Terminate {
    Pid: number;
    Response?: Response | undefined;
}
/** IfconfigReq - Request the implant to list network interfaces */
export interface IfconfigReq {
    Request?: Request | undefined;
}
export interface Ifconfig {
    NetInterfaces: NetInterface[];
    Response?: Response | undefined;
}
export interface NetInterface {
    Index: number;
    Name: string;
    MAC: string;
    IPAddresses: string[];
}
export interface LsReq {
    Path: string;
    Request?: Request | undefined;
}
export interface Ls {
    Path: string;
    Exists: boolean;
    Files: FileInfo[];
    timezone: string;
    timezoneOffset: number;
    Response?: Response | undefined;
}
export interface FileInfo {
    Name: string;
    IsDir: boolean;
    Size: string;
    ModTime: string;
    Mode: string;
    Link: string;
    Uid: string;
    Gid: string;
}
export interface CdReq {
    Path: string;
    Request?: Request | undefined;
}
export interface PwdReq {
    Request?: Request | undefined;
}
export interface Pwd {
    Path: string;
    Response?: Response | undefined;
}
export interface RmReq {
    Path: string;
    Recursive: boolean;
    Force: boolean;
    Request?: Request | undefined;
}
export interface Rm {
    Path: string;
    Response?: Response | undefined;
}
export interface MvReq {
    Src: string;
    Dst: string;
    Request?: Request | undefined;
}
export interface Mv {
    Src: string;
    Dst: string;
    Response?: Response | undefined;
}
export interface CpReq {
    Src: string;
    Dst: string;
    Request?: Request | undefined;
}
export interface Cp {
    Src: string;
    Dst: string;
    BytesWritten: string;
    Response?: Response | undefined;
}
export interface MkdirReq {
    Path: string;
    Request?: Request | undefined;
}
export interface Mkdir {
    Path: string;
    Response?: Response | undefined;
}
export interface DownloadReq {
    Path: string;
    Start: string;
    Stop: string;
    Recurse: boolean;
    MaxBytes: string;
    MaxLines: string;
    RestrictedToFile: boolean;
    Request?: Request | undefined;
}
export interface Download {
    Path: string;
    Encoder: string;
    Exists: boolean;
    Start: string;
    Stop: string;
    Data: Buffer;
    IsDir: boolean;
    ReadFiles: number;
    UnreadableFiles: number;
    Response?: Response | undefined;
}
export interface UploadReq {
    Path: string;
    Encoder: string;
    Data: Buffer;
    IsIOC: boolean;
    FileName: string;
    IsDirectory: boolean;
    Overwrite: boolean;
    Request?: Request | undefined;
}
export interface Upload {
    Path: string;
    WrittenFiles: number;
    UnwriteableFiles: number;
    Response?: Response | undefined;
}
export interface GrepReq {
    SearchPattern: string;
    Path: string;
    Recursive: boolean;
    LinesBefore: number;
    LinesAfter: number;
    Request?: Request | undefined;
}
export interface GrepLinePosition {
    Start: number;
    End: number;
}
export interface GrepResult {
    LineNumber: string;
    Positions: GrepLinePosition[];
    Line: string;
    LinesBefore: string[];
    LinesAfter: string[];
}
export interface GrepResultsForFile {
    FileResults: GrepResult[];
    IsBinary: boolean;
}
export interface Grep {
    Results: {
        [key: string]: GrepResultsForFile;
    };
    SearchPathAbsolute: string;
    Response?: Response | undefined;
}
export interface Grep_ResultsEntry {
    key: string;
    value?: GrepResultsForFile | undefined;
}
export interface MountReq {
    Request?: Request | undefined;
}
export interface MountInfo {
    VolumeName: string;
    VolumeType: string;
    MountPoint: string;
    Label: string;
    FileSystem: string;
    UsedSpace: string;
    FreeSpace: string;
    TotalSpace: string;
    MountOptions: string;
}
export interface Mount {
    Info: MountInfo[];
    Response?: Response | undefined;
}
export interface ProcessDumpReq {
    Pid: number;
    Timeout: number;
    Request?: Request | undefined;
}
export interface ProcessDump {
    Data: Buffer;
    Response?: Response | undefined;
}
export interface RunAsReq {
    Username: string;
    ProcessName: string;
    Args: string;
    Domain: string;
    Password: string;
    HideWindow: boolean;
    NetOnly: boolean;
    Request?: Request | undefined;
}
export interface RunAs {
    Output: string;
    Response?: Response | undefined;
}
export interface ImpersonateReq {
    Username: string;
    Request?: Request | undefined;
}
export interface Impersonate {
    Response?: Response | undefined;
}
export interface RevToSelfReq {
    Request?: Request | undefined;
}
export interface RevToSelf {
    Response?: Response | undefined;
}
export interface CurrentTokenOwnerReq {
    Request?: Request | undefined;
}
export interface CurrentTokenOwner {
    Output: string;
    Response?: Response | undefined;
}
/**
 * InvokeGetSystemReq - Implant-side version of GetSystemReq, this message
 *                      contains the .Data based on the client's req.Config
 */
export interface InvokeGetSystemReq {
    Data: Buffer;
    HostingProcess: string;
    Request?: Request | undefined;
}
/** GetSystem - The result of a InvokeGetSystemReq attempt */
export interface GetSystem {
    Response?: Response | undefined;
}
export interface MakeTokenReq {
    Username: string;
    Password: string;
    Domain: string;
    LogonType: number;
    Request?: Request | undefined;
}
export interface MakeToken {
    Response?: Response | undefined;
}
export interface TaskReq {
    Encoder: string;
    RWXPages: boolean;
    Pid: number;
    Data: Buffer;
    Request?: Request | undefined;
}
export interface Task {
    Response?: Response | undefined;
}
export interface ExecuteAssemblyReq {
    Assembly: Buffer;
    Arguments: string[];
    Process: string;
    IsDLL: boolean;
    Arch: string;
    ClassName: string;
    Method: string;
    AppDomain: string;
    PPid: number;
    ProcessArgs: string[];
    /** In process specific fields */
    InProcess: boolean;
    Runtime: string;
    AmsiBypass: boolean;
    EtwBypass: boolean;
    Request?: Request | undefined;
}
export interface InvokeExecuteAssemblyReq {
    Data: Buffer;
    process: string;
    PPid: number;
    ProcessArgs: string[];
    Request?: Request | undefined;
}
export interface InvokeInProcExecuteAssemblyReq {
    Data: Buffer;
    Arguments: string[];
    Runtime: string;
    AmsiBypass: boolean;
    EtwBypass: boolean;
    Request?: Request | undefined;
}
export interface ExecuteAssembly {
    Output: Buffer;
    Response?: Response | undefined;
}
export interface InvokeMigrateReq {
    Pid: number;
    Data: Buffer;
    ProcName: string;
    Request?: Request | undefined;
}
export interface Migrate {
    Success: boolean;
    Pid: number;
    Response?: Response | undefined;
}
export interface ExecuteReq {
    Path: string;
    Args: string[];
    Output: boolean;
    Stdout: string;
    Stderr: string;
    EnvInheritance: boolean;
    Env: {
        [key: string]: string;
    };
    Background: boolean;
    PPid: number;
    Request?: Request | undefined;
}
export interface ExecuteReq_EnvEntry {
    key: string;
    value: string;
}
export interface ExecuteWindowsReq {
    Path: string;
    Args: string[];
    Output: boolean;
    Stdout: string;
    Stderr: string;
    UseToken: boolean;
    HideWindow: boolean;
    Background: boolean;
    PPid: number;
    Request?: Request | undefined;
}
export interface Execute {
    Status: number;
    Stdout: Buffer;
    Stderr: Buffer;
    Pid: number;
    Response?: Response | undefined;
}
export interface ExecuteChildrenReq {
    Request?: Request | undefined;
}
export interface ExecuteChild {
    Pid: number;
    Path: string;
    Args: string[];
    StartTime: string;
    Exited: boolean;
    ExitCode: number;
    ExitTime: string;
    Stdout: string;
    Stderr: string;
    Error: string;
}
export interface ExecuteChildren {
    Children: ExecuteChild[];
    Response?: Response | undefined;
}
export interface SideloadReq {
    Data: Buffer;
    ProcessName: string;
    Args: string[];
    EntryPoint: string;
    Kill: boolean;
    isDLL: boolean;
    isUnicode: boolean;
    PPid: number;
    ProcessArgs: string[];
    Request?: Request | undefined;
}
export interface Sideload {
    Result: string;
    Response?: Response | undefined;
}
export interface InvokeSpawnDllReq {
    Data: Buffer;
    ProcessName: string;
    Args: string[];
    EntryPoint: string;
    Kill: boolean;
    PPid: number;
    ProcessArgs: string[];
    Request?: Request | undefined;
}
export interface SpawnDllReq {
    Data: Buffer;
    ProcessName: string;
    Offset: number;
    Args: string[];
    Kill: boolean;
    PPid: number;
    ProcessArgs: string[];
    Request?: Request | undefined;
}
export interface SpawnDll {
    Result: string;
    Response?: Response | undefined;
}
export interface NetstatReq {
    TCP: boolean;
    UDP: boolean;
    IP4: boolean;
    IP6: boolean;
    Listening: boolean;
    Request?: Request | undefined;
}
export interface SockTabEntry {
    LocalAddr?: SockTabEntry_SockAddr | undefined;
    RemoteAddr?: SockTabEntry_SockAddr | undefined;
    SkState: string;
    UID: number;
    Process?: Process | undefined;
    Protocol: string;
}
export interface SockTabEntry_SockAddr {
    Ip: string;
    Port: number;
}
export interface Netstat {
    Entries: SockTabEntry[];
    Response?: Response | undefined;
}
export interface EnvReq {
    Name: string;
    Request?: Request | undefined;
}
export interface EnvInfo {
    Variables: EnvVar[];
    Response?: Response | undefined;
}
export interface SetEnvReq {
    Variable?: EnvVar | undefined;
    Request?: Request | undefined;
}
export interface SetEnv {
    Response?: Response | undefined;
}
export interface UnsetEnvReq {
    Name: string;
    Request?: Request | undefined;
}
export interface UnsetEnv {
    Response?: Response | undefined;
}
/** HTTP Sepecific message */
export interface HTTPSessionInit {
    Key: Buffer;
}
/** ScreenshotReq - Request the implant take a screenshot */
export interface ScreenshotReq {
    Request?: Request | undefined;
}
export interface Screenshot {
    Data: Buffer;
    Response?: Response | undefined;
}
export interface StartServiceReq {
    ServiceName: string;
    ServiceDescription: string;
    BinPath: string;
    Hostname: string;
    Arguments: string;
    Request?: Request | undefined;
}
export interface ServiceInfo {
    Response?: Response | undefined;
}
export interface ServiceInfoReq {
    ServiceName: string;
    Hostname: string;
}
export interface StopServiceReq {
    ServiceInfo?: ServiceInfoReq | undefined;
    Request?: Request | undefined;
}
export interface RemoveServiceReq {
    ServiceInfo?: ServiceInfoReq | undefined;
    Request?: Request | undefined;
}
export interface RegistryReadReq {
    Hive: string;
    Path: string;
    Key: string;
    Hostname: string;
    Request?: Request | undefined;
}
export interface RegistryRead {
    Value: string;
    Response?: Response | undefined;
}
export interface RegistryWriteReq {
    Hive: string;
    Path: string;
    Key: string;
    Hostname: string;
    StringValue: string;
    ByteValue: Buffer;
    DWordValue: number;
    QWordValue: string;
    Type: number;
    Request?: Request | undefined;
}
export interface RegistryWrite {
    Response?: Response | undefined;
}
export interface RegistryCreateKeyReq {
    Hive: string;
    Path: string;
    Key: string;
    Hostname: string;
    Request?: Request | undefined;
}
export interface RegistryCreateKey {
    Response?: Response | undefined;
}
export interface RegistryDeleteKeyReq {
    Hive: string;
    Path: string;
    Key: string;
    Hostname: string;
    Request?: Request | undefined;
}
export interface RegistryDeleteKey {
    Response?: Response | undefined;
}
export interface RegistrySubKeyListReq {
    Hive: string;
    Path: string;
    /** Keep the same ID as the other registry operations */
    Hostname: string;
    Request?: Request | undefined;
}
export interface RegistrySubKeyList {
    Subkeys: string[];
    Response?: Response | undefined;
}
export interface RegistryListValuesReq {
    Hive: string;
    Path: string;
    /** Keep the same ID as the other registry operations */
    Hostname: string;
    Request?: Request | undefined;
}
export interface RegistryValuesList {
    ValueNames: string[];
    Response?: Response | undefined;
}
export interface RegistryReadHiveReq {
    RootHive: string;
    RequestedHive: string;
    Request?: Request | undefined;
}
export interface RegistryReadHive {
    Data: Buffer;
    Encoder: string;
    Response?: Response | undefined;
}
/** Tunnel - Tunnel related messages */
export interface Tunnel {
    TunnelID: string;
    SessionID: string;
}
export interface TunnelData {
    Data: Buffer;
    Closed: boolean;
    Sequence: string;
    Ack: string;
    Resend: boolean;
    CreateReverse: boolean;
    rportfwd?: RPortfwd | undefined;
    TunnelID: string;
    SessionID: string;
}
/** ShellReq - Request the implant open a realtime shell tunnel */
export interface ShellReq {
    Path: string;
    EnablePTY: boolean;
    Pid: number;
    Rows: number;
    Cols: number;
    /** Bind to this tunnel */
    TunnelID: string;
    Request?: Request | undefined;
}
/** Shell - Request the implant open a realtime shell tunnel */
export interface Shell {
    Path: string;
    EnablePTY: boolean;
    Pid: number;
    TunnelID: string;
    Response?: Response | undefined;
}
export interface ShellResizeReq {
    Rows: number;
    Cols: number;
    TunnelID: string;
    Request?: Request | undefined;
}
export interface PortfwdReq {
    Port: number;
    Protocol: number;
    Host: string;
    /** Bind to this tunnel */
    TunnelID: string;
    Request?: Request | undefined;
}
export interface Portfwd {
    Port: number;
    Protocol: number;
    Host: string;
    /** Bind to this tunnel */
    TunnelID: string;
    Response?: Response | undefined;
}
export interface Socks {
    TunnelID: string;
    SessionID: string;
}
export interface SocksData {
    Data: Buffer;
    CloseConn: boolean;
    Username: string;
    Password: string;
    Sequence: string;
    TunnelID: string;
    Request?: Request | undefined;
}
export interface PivotStartListenerReq {
    Type: PivotType;
    BindAddress: string;
    Options: boolean[];
    Request?: Request | undefined;
}
export interface PivotStopListenerReq {
    ID: number;
    Request?: Request | undefined;
}
export interface PivotListener {
    ID: number;
    Type: PivotType;
    BindAddress: string;
    Pivots: NetConnPivot[];
    Response?: Response | undefined;
}
export interface PivotHello {
    PublicKey: Buffer;
    PeerID: string;
    PublicKeySignature: string;
    SessionKey: Buffer;
}
export interface PivotServerKeyExchange {
    OriginID: string;
    SessionKey: Buffer;
}
export interface PivotPeer {
    PeerID: string;
    Name: string;
}
export interface PivotPeerEnvelope {
    Peers: PivotPeer[];
    Type: number;
    PivotSessionID: Buffer;
    Data: Buffer;
    PeerFailureAt: string;
}
export interface PivotPing {
    Nonce: number;
}
export interface NetConnPivot {
    PeerID: string;
    RemoteAddress: string;
}
export interface PivotPeerFailure {
    PeerID: string;
    Type: PeerFailureType;
    Err: string;
}
export interface PivotListenersReq {
    Request?: Request | undefined;
}
export interface PivotListeners {
    Listeners: PivotListener[];
    Response?: Response | undefined;
}
export interface WGPortForwardStartReq {
    LocalPort: number;
    RemoteAddress: string;
    Request?: Request | undefined;
}
export interface WGPortForward {
    Forwarder?: WGTCPForwarder | undefined;
    Response?: Response | undefined;
}
export interface WGPortForwardStopReq {
    ID: number;
    Request?: Request | undefined;
}
export interface WGSocksStartReq {
    Port: number;
    Request?: Request | undefined;
}
export interface WGSocks {
    Server?: WGSocksServer | undefined;
    Response?: Response | undefined;
}
export interface WGSocksStopReq {
    ID: number;
    Request?: Request | undefined;
}
export interface WGTCPForwardersReq {
    Request?: Request | undefined;
}
export interface WGSocksServersReq {
    Request?: Request | undefined;
}
export interface WGTCPForwarder {
    ID: number;
    LocalAddr: string;
    RemoteAddr: string;
}
export interface WGSocksServer {
    ID: number;
    LocalAddr: string;
}
export interface WGSocksServers {
    Servers: WGSocksServer[];
    Response?: Response | undefined;
}
export interface WGTCPForwarders {
    Forwarders: WGTCPForwarder[];
    Response?: Response | undefined;
}
/** ReconfigureReq - Request the implant to reconfigure itself */
export interface ReconfigureReq {
    ReconnectInterval: string;
    BeaconInterval: string;
    BeaconJitter: string;
    C2URI: string;
    Request?: Request | undefined;
}
export interface Reconfigure {
    Response?: Response | undefined;
}
/** PollIntervalReq - Request the implant to update it's poll intervbal */
export interface PollIntervalReq {
    PollInterval: string;
    Request?: Request | undefined;
}
export interface PollInterval {
    Response?: Response | undefined;
}
export interface SSHCommandReq {
    Username: string;
    Hostname: string;
    Port: number;
    Command: string;
    Password: string;
    PrivKey: Buffer;
    Krb5Conf: string;
    Keytab: Buffer;
    Realm: string;
    Request?: Request | undefined;
}
export interface SSHCommand {
    StdOut: string;
    StdErr: string;
    Response?: Response | undefined;
}
export interface GetPrivsReq {
    Request?: Request | undefined;
}
export interface WindowsPrivilegeEntry {
    Name: string;
    Description: string;
    Enabled: boolean;
    EnabledByDefault: boolean;
    Removed: boolean;
    UsedForAccess: boolean;
}
export interface GetPrivs {
    PrivInfo: WindowsPrivilegeEntry[];
    ProcessIntegrity: string;
    ProcessName: string;
    Response?: Response | undefined;
}
export interface RegisterExtensionReq {
    Name: string;
    Data: Buffer;
    OS: string;
    Init: string;
    Request?: Request | undefined;
}
export interface RegisterExtension {
    Response?: Response | undefined;
}
export interface CallExtensionReq {
    Name: string;
    ServerStore: boolean;
    Args: Buffer;
    Export: string;
    Request?: Request | undefined;
}
export interface CallExtension {
    Output: Buffer;
    ServerStore: boolean;
    Response?: Response | undefined;
}
export interface ListExtensionsReq {
    Request?: Request | undefined;
}
export interface ListExtensions {
    Names: string[];
    Response?: Response | undefined;
}
export interface RportFwdStopListenerReq {
    ID: number;
    Request?: Request | undefined;
}
export interface RportFwdStartListenerReq {
    BindAddress: string;
    BindPort: number;
    ForwardPort: number;
    ForwardAddress: string;
    Request?: Request | undefined;
}
export interface RportFwdListener {
    ID: number;
    BindAddress: string;
    BindPort: number;
    ForwardAddress: string;
    ForwardPort: number;
    Response?: Response | undefined;
}
export interface RportFwdListeners {
    Listeners: RportFwdListener[];
    Response?: Response | undefined;
}
export interface RportFwdListenersReq {
    Request?: Request | undefined;
}
export interface RPortfwd {
    Port: number;
    Protocol: number;
    Host: string;
    /** Bind to this tunnel */
    TunnelID: string;
    Response?: Response | undefined;
}
export interface RPortfwdReq {
    Port: number;
    Protocol: number;
    Host: string;
    /** Bind to this tunnel */
    TunnelID: string;
    Request?: Request | undefined;
}
export interface ChmodReq {
    Path: string;
    FileMode: string;
    Recursive: boolean;
    Request?: Request | undefined;
}
export interface Chmod {
    Path: string;
    Response?: Response | undefined;
}
export interface ChownReq {
    Path: string;
    Uid: string;
    Gid: string;
    Recursive: boolean;
    Request?: Request | undefined;
}
export interface Chown {
    Path: string;
    Response?: Response | undefined;
}
export interface ChtimesReq {
    Path: string;
    ATime: string;
    MTime: string;
    Request?: Request | undefined;
}
export interface Chtimes {
    Path: string;
    Response?: Response | undefined;
}
export interface MemfilesListReq {
    Request?: Request | undefined;
}
export interface MemfilesAddReq {
    Request?: Request | undefined;
}
export interface MemfilesAdd {
    Fd: string;
    Response?: Response | undefined;
}
export interface MemfilesRmReq {
    Fd: string;
    Request?: Request | undefined;
}
export interface MemfilesRm {
    Fd: string;
    Response?: Response | undefined;
}
export interface RegisterWasmExtensionReq {
    Name: string;
    WasmGz: Buffer;
    Request?: Request | undefined;
}
export interface RegisterWasmExtension {
    Response?: Response | undefined;
}
export interface DeregisterWasmExtensionReq {
    Name: string;
    Request?: Request | undefined;
}
export interface ListWasmExtensionsReq {
    Request?: Request | undefined;
}
export interface ListWasmExtensions {
    Names: string[];
    Response?: Response | undefined;
}
export interface ExecWasmExtensionReq {
    Name: string;
    Args: string[];
    Interactive: boolean;
    MemFS: {
        [key: string]: Buffer;
    };
    /** Bind to this tunnel */
    TunnelID: string;
    Request?: Request | undefined;
}
export interface ExecWasmExtensionReq_MemFSEntry {
    key: string;
    value: Buffer;
}
export interface ExecWasmExtension {
    Stdout: Buffer;
    Stderr: Buffer;
    ExitCode: number;
    Response?: Response | undefined;
}
export interface ServicesReq {
    Hostname: string;
    Request?: Request | undefined;
}
export interface ServiceDetailReq {
    ServiceInfo?: ServiceInfoReq | undefined;
    Request?: Request | undefined;
}
export interface ServiceDetails {
    Name: string;
    DisplayName: string;
    Description: string;
    Status: number;
    StartupType: number;
    BinPath: string;
    Account: string;
}
export interface Services {
    Details: ServiceDetails[];
    Error: string;
    Response?: Response | undefined;
}
export interface ServiceDetail {
    Detail?: ServiceDetails | undefined;
    Message: string;
    Response?: Response | undefined;
}
export interface StartServiceByNameReq {
    ServiceInfo?: ServiceInfoReq | undefined;
    Request?: Request | undefined;
}
export declare const Envelope: MessageFns<Envelope>;
export declare const BeaconTasks: MessageFns<BeaconTasks>;
export declare const Register: MessageFns<Register>;
export declare const BeaconRegister: MessageFns<BeaconRegister>;
export declare const SessionRegister: MessageFns<SessionRegister>;
export declare const OpenSession: MessageFns<OpenSession>;
export declare const CloseSession: MessageFns<CloseSession>;
export declare const Ping: MessageFns<Ping>;
export declare const KillReq: MessageFns<KillReq>;
export declare const PsReq: MessageFns<PsReq>;
export declare const Ps: MessageFns<Ps>;
export declare const TerminateReq: MessageFns<TerminateReq>;
export declare const Terminate: MessageFns<Terminate>;
export declare const IfconfigReq: MessageFns<IfconfigReq>;
export declare const Ifconfig: MessageFns<Ifconfig>;
export declare const NetInterface: MessageFns<NetInterface>;
export declare const LsReq: MessageFns<LsReq>;
export declare const Ls: MessageFns<Ls>;
export declare const FileInfo: MessageFns<FileInfo>;
export declare const CdReq: MessageFns<CdReq>;
export declare const PwdReq: MessageFns<PwdReq>;
export declare const Pwd: MessageFns<Pwd>;
export declare const RmReq: MessageFns<RmReq>;
export declare const Rm: MessageFns<Rm>;
export declare const MvReq: MessageFns<MvReq>;
export declare const Mv: MessageFns<Mv>;
export declare const CpReq: MessageFns<CpReq>;
export declare const Cp: MessageFns<Cp>;
export declare const MkdirReq: MessageFns<MkdirReq>;
export declare const Mkdir: MessageFns<Mkdir>;
export declare const DownloadReq: MessageFns<DownloadReq>;
export declare const Download: MessageFns<Download>;
export declare const UploadReq: MessageFns<UploadReq>;
export declare const Upload: MessageFns<Upload>;
export declare const GrepReq: MessageFns<GrepReq>;
export declare const GrepLinePosition: MessageFns<GrepLinePosition>;
export declare const GrepResult: MessageFns<GrepResult>;
export declare const GrepResultsForFile: MessageFns<GrepResultsForFile>;
export declare const Grep: MessageFns<Grep>;
export declare const Grep_ResultsEntry: MessageFns<Grep_ResultsEntry>;
export declare const MountReq: MessageFns<MountReq>;
export declare const MountInfo: MessageFns<MountInfo>;
export declare const Mount: MessageFns<Mount>;
export declare const ProcessDumpReq: MessageFns<ProcessDumpReq>;
export declare const ProcessDump: MessageFns<ProcessDump>;
export declare const RunAsReq: MessageFns<RunAsReq>;
export declare const RunAs: MessageFns<RunAs>;
export declare const ImpersonateReq: MessageFns<ImpersonateReq>;
export declare const Impersonate: MessageFns<Impersonate>;
export declare const RevToSelfReq: MessageFns<RevToSelfReq>;
export declare const RevToSelf: MessageFns<RevToSelf>;
export declare const CurrentTokenOwnerReq: MessageFns<CurrentTokenOwnerReq>;
export declare const CurrentTokenOwner: MessageFns<CurrentTokenOwner>;
export declare const InvokeGetSystemReq: MessageFns<InvokeGetSystemReq>;
export declare const GetSystem: MessageFns<GetSystem>;
export declare const MakeTokenReq: MessageFns<MakeTokenReq>;
export declare const MakeToken: MessageFns<MakeToken>;
export declare const TaskReq: MessageFns<TaskReq>;
export declare const Task: MessageFns<Task>;
export declare const ExecuteAssemblyReq: MessageFns<ExecuteAssemblyReq>;
export declare const InvokeExecuteAssemblyReq: MessageFns<InvokeExecuteAssemblyReq>;
export declare const InvokeInProcExecuteAssemblyReq: MessageFns<InvokeInProcExecuteAssemblyReq>;
export declare const ExecuteAssembly: MessageFns<ExecuteAssembly>;
export declare const InvokeMigrateReq: MessageFns<InvokeMigrateReq>;
export declare const Migrate: MessageFns<Migrate>;
export declare const ExecuteReq: MessageFns<ExecuteReq>;
export declare const ExecuteReq_EnvEntry: MessageFns<ExecuteReq_EnvEntry>;
export declare const ExecuteWindowsReq: MessageFns<ExecuteWindowsReq>;
export declare const Execute: MessageFns<Execute>;
export declare const ExecuteChildrenReq: MessageFns<ExecuteChildrenReq>;
export declare const ExecuteChild: MessageFns<ExecuteChild>;
export declare const ExecuteChildren: MessageFns<ExecuteChildren>;
export declare const SideloadReq: MessageFns<SideloadReq>;
export declare const Sideload: MessageFns<Sideload>;
export declare const InvokeSpawnDllReq: MessageFns<InvokeSpawnDllReq>;
export declare const SpawnDllReq: MessageFns<SpawnDllReq>;
export declare const SpawnDll: MessageFns<SpawnDll>;
export declare const NetstatReq: MessageFns<NetstatReq>;
export declare const SockTabEntry: MessageFns<SockTabEntry>;
export declare const SockTabEntry_SockAddr: MessageFns<SockTabEntry_SockAddr>;
export declare const Netstat: MessageFns<Netstat>;
export declare const EnvReq: MessageFns<EnvReq>;
export declare const EnvInfo: MessageFns<EnvInfo>;
export declare const SetEnvReq: MessageFns<SetEnvReq>;
export declare const SetEnv: MessageFns<SetEnv>;
export declare const UnsetEnvReq: MessageFns<UnsetEnvReq>;
export declare const UnsetEnv: MessageFns<UnsetEnv>;
export declare const HTTPSessionInit: MessageFns<HTTPSessionInit>;
export declare const ScreenshotReq: MessageFns<ScreenshotReq>;
export declare const Screenshot: MessageFns<Screenshot>;
export declare const StartServiceReq: MessageFns<StartServiceReq>;
export declare const ServiceInfo: MessageFns<ServiceInfo>;
export declare const ServiceInfoReq: MessageFns<ServiceInfoReq>;
export declare const StopServiceReq: MessageFns<StopServiceReq>;
export declare const RemoveServiceReq: MessageFns<RemoveServiceReq>;
export declare const RegistryReadReq: MessageFns<RegistryReadReq>;
export declare const RegistryRead: MessageFns<RegistryRead>;
export declare const RegistryWriteReq: MessageFns<RegistryWriteReq>;
export declare const RegistryWrite: MessageFns<RegistryWrite>;
export declare const RegistryCreateKeyReq: MessageFns<RegistryCreateKeyReq>;
export declare const RegistryCreateKey: MessageFns<RegistryCreateKey>;
export declare const RegistryDeleteKeyReq: MessageFns<RegistryDeleteKeyReq>;
export declare const RegistryDeleteKey: MessageFns<RegistryDeleteKey>;
export declare const RegistrySubKeyListReq: MessageFns<RegistrySubKeyListReq>;
export declare const RegistrySubKeyList: MessageFns<RegistrySubKeyList>;
export declare const RegistryListValuesReq: MessageFns<RegistryListValuesReq>;
export declare const RegistryValuesList: MessageFns<RegistryValuesList>;
export declare const RegistryReadHiveReq: MessageFns<RegistryReadHiveReq>;
export declare const RegistryReadHive: MessageFns<RegistryReadHive>;
export declare const Tunnel: MessageFns<Tunnel>;
export declare const TunnelData: MessageFns<TunnelData>;
export declare const ShellReq: MessageFns<ShellReq>;
export declare const Shell: MessageFns<Shell>;
export declare const ShellResizeReq: MessageFns<ShellResizeReq>;
export declare const PortfwdReq: MessageFns<PortfwdReq>;
export declare const Portfwd: MessageFns<Portfwd>;
export declare const Socks: MessageFns<Socks>;
export declare const SocksData: MessageFns<SocksData>;
export declare const PivotStartListenerReq: MessageFns<PivotStartListenerReq>;
export declare const PivotStopListenerReq: MessageFns<PivotStopListenerReq>;
export declare const PivotListener: MessageFns<PivotListener>;
export declare const PivotHello: MessageFns<PivotHello>;
export declare const PivotServerKeyExchange: MessageFns<PivotServerKeyExchange>;
export declare const PivotPeer: MessageFns<PivotPeer>;
export declare const PivotPeerEnvelope: MessageFns<PivotPeerEnvelope>;
export declare const PivotPing: MessageFns<PivotPing>;
export declare const NetConnPivot: MessageFns<NetConnPivot>;
export declare const PivotPeerFailure: MessageFns<PivotPeerFailure>;
export declare const PivotListenersReq: MessageFns<PivotListenersReq>;
export declare const PivotListeners: MessageFns<PivotListeners>;
export declare const WGPortForwardStartReq: MessageFns<WGPortForwardStartReq>;
export declare const WGPortForward: MessageFns<WGPortForward>;
export declare const WGPortForwardStopReq: MessageFns<WGPortForwardStopReq>;
export declare const WGSocksStartReq: MessageFns<WGSocksStartReq>;
export declare const WGSocks: MessageFns<WGSocks>;
export declare const WGSocksStopReq: MessageFns<WGSocksStopReq>;
export declare const WGTCPForwardersReq: MessageFns<WGTCPForwardersReq>;
export declare const WGSocksServersReq: MessageFns<WGSocksServersReq>;
export declare const WGTCPForwarder: MessageFns<WGTCPForwarder>;
export declare const WGSocksServer: MessageFns<WGSocksServer>;
export declare const WGSocksServers: MessageFns<WGSocksServers>;
export declare const WGTCPForwarders: MessageFns<WGTCPForwarders>;
export declare const ReconfigureReq: MessageFns<ReconfigureReq>;
export declare const Reconfigure: MessageFns<Reconfigure>;
export declare const PollIntervalReq: MessageFns<PollIntervalReq>;
export declare const PollInterval: MessageFns<PollInterval>;
export declare const SSHCommandReq: MessageFns<SSHCommandReq>;
export declare const SSHCommand: MessageFns<SSHCommand>;
export declare const GetPrivsReq: MessageFns<GetPrivsReq>;
export declare const WindowsPrivilegeEntry: MessageFns<WindowsPrivilegeEntry>;
export declare const GetPrivs: MessageFns<GetPrivs>;
export declare const RegisterExtensionReq: MessageFns<RegisterExtensionReq>;
export declare const RegisterExtension: MessageFns<RegisterExtension>;
export declare const CallExtensionReq: MessageFns<CallExtensionReq>;
export declare const CallExtension: MessageFns<CallExtension>;
export declare const ListExtensionsReq: MessageFns<ListExtensionsReq>;
export declare const ListExtensions: MessageFns<ListExtensions>;
export declare const RportFwdStopListenerReq: MessageFns<RportFwdStopListenerReq>;
export declare const RportFwdStartListenerReq: MessageFns<RportFwdStartListenerReq>;
export declare const RportFwdListener: MessageFns<RportFwdListener>;
export declare const RportFwdListeners: MessageFns<RportFwdListeners>;
export declare const RportFwdListenersReq: MessageFns<RportFwdListenersReq>;
export declare const RPortfwd: MessageFns<RPortfwd>;
export declare const RPortfwdReq: MessageFns<RPortfwdReq>;
export declare const ChmodReq: MessageFns<ChmodReq>;
export declare const Chmod: MessageFns<Chmod>;
export declare const ChownReq: MessageFns<ChownReq>;
export declare const Chown: MessageFns<Chown>;
export declare const ChtimesReq: MessageFns<ChtimesReq>;
export declare const Chtimes: MessageFns<Chtimes>;
export declare const MemfilesListReq: MessageFns<MemfilesListReq>;
export declare const MemfilesAddReq: MessageFns<MemfilesAddReq>;
export declare const MemfilesAdd: MessageFns<MemfilesAdd>;
export declare const MemfilesRmReq: MessageFns<MemfilesRmReq>;
export declare const MemfilesRm: MessageFns<MemfilesRm>;
export declare const RegisterWasmExtensionReq: MessageFns<RegisterWasmExtensionReq>;
export declare const RegisterWasmExtension: MessageFns<RegisterWasmExtension>;
export declare const DeregisterWasmExtensionReq: MessageFns<DeregisterWasmExtensionReq>;
export declare const ListWasmExtensionsReq: MessageFns<ListWasmExtensionsReq>;
export declare const ListWasmExtensions: MessageFns<ListWasmExtensions>;
export declare const ExecWasmExtensionReq: MessageFns<ExecWasmExtensionReq>;
export declare const ExecWasmExtensionReq_MemFSEntry: MessageFns<ExecWasmExtensionReq_MemFSEntry>;
export declare const ExecWasmExtension: MessageFns<ExecWasmExtension>;
export declare const ServicesReq: MessageFns<ServicesReq>;
export declare const ServiceDetailReq: MessageFns<ServiceDetailReq>;
export declare const ServiceDetails: MessageFns<ServiceDetails>;
export declare const Services: MessageFns<Services>;
export declare const ServiceDetail: MessageFns<ServiceDetail>;
export declare const StartServiceByNameReq: MessageFns<StartServiceByNameReq>;
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create(base?: DeepPartial<T>): T;
    fromPartial(object: DeepPartial<T>): T;
}
export {};
