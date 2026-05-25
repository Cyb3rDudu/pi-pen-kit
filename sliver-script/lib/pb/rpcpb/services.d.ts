import type { CallContext, CallOptions } from "nice-grpc-common";
import { AllHosts, AllLoot, Backdoor, BackdoorReq, Beacon, BeaconIntegrity, Beacons, BeaconTask, BeaconTasks, Builder, Builders, C2ProfileReq, Canaries, CertificateAuthorityInfo, CertificateInfo, CertificatesReq, ClientLogData, Compiler, CrackBenchmark, CrackCommand, CrackFile, CrackFileChunk, CrackFiles, CrackResponse, Crackstation, Crackstations, CrackTask, Credential, Credentials, DeleteReq, DllHijack, DllHijackReq, DNSListenerReq, Event, ExternalGenerateReq, ExternalImplantBinary, ExternalImplantConfig, Generate, GenerateReq, GenerateSpoofMetadataReq, GenerateStageReq, GetSystemReq, Host, HTTPC2Config, HTTPC2ConfigReq, HTTPC2Configs, HTTPListenerReq, ImplantBuild, ImplantBuilds, ImplantProfile, ImplantProfiles, ImplantStageReq, IOC, Jobs, KillJob, KillJobReq, ListenerJob, Loot, MigrateReq, MonitoringProvider, MonitoringProviders, MSFRemoteReq, MSFReq, MTLSListenerReq, Operators, PivotGraph, RegenerateReq, RenameReq, RestartJobReq, Sessions, ShellcodeEncode, ShellcodeEncodeReq, ShellcodeEncoderMap, ShellcodeRDI, ShellcodeRDIReq, StagerListener, StagerListenerReq, TrafficEncoder, TrafficEncoderMap, TrafficEncoderTests, UniqueWGIP, Version, Website, WebsiteAddContent, WebsiteRemoveContent, Websites, WGClientConfig, WGListenerReq } from "../clientpb/client";
import { Empty, Response } from "../commonpb/common";
import { CallExtension, CallExtensionReq, CdReq, Chmod, ChmodReq, Chown, ChownReq, Chtimes, ChtimesReq, CloseSession, Cp, CpReq, CurrentTokenOwner, CurrentTokenOwnerReq, Download, DownloadReq, EnvInfo, EnvReq, Execute, ExecuteAssembly, ExecuteAssemblyReq, ExecuteChildren, ExecuteChildrenReq, ExecuteReq, ExecuteWindowsReq, ExecWasmExtension, ExecWasmExtensionReq, GetPrivs, GetPrivsReq, GetSystem, Grep, GrepReq, Ifconfig, IfconfigReq, Impersonate, ImpersonateReq, InvokeSpawnDllReq, KillReq, ListExtensions, ListExtensionsReq, ListWasmExtensions, ListWasmExtensionsReq, Ls, LsReq, MakeToken, MakeTokenReq, MemfilesAdd, MemfilesAddReq, MemfilesListReq, MemfilesRm, MemfilesRmReq, Migrate, Mkdir, MkdirReq, Mount, MountReq, Mv, MvReq, Netstat, NetstatReq, OpenSession, Ping, PivotListener, PivotListeners, PivotListenersReq, PivotStartListenerReq, PivotStopListenerReq, Portfwd, PortfwdReq, ProcessDump, ProcessDumpReq, Ps, PsReq, Pwd, PwdReq, Reconfigure, ReconfigureReq, RegisterExtension, RegisterExtensionReq, RegisterWasmExtension, RegisterWasmExtensionReq, RegistryCreateKey, RegistryCreateKeyReq, RegistryDeleteKey, RegistryDeleteKeyReq, RegistryListValuesReq, RegistryRead, RegistryReadHive, RegistryReadHiveReq, RegistryReadReq, RegistrySubKeyList, RegistrySubKeyListReq, RegistryValuesList, RegistryWrite, RegistryWriteReq, RemoveServiceReq, RevToSelf, RevToSelfReq, Rm, RmReq, RportFwdListener, RportFwdListeners, RportFwdListenersReq, RportFwdStartListenerReq, RportFwdStopListenerReq, RunAs, RunAsReq, Screenshot, ScreenshotReq, ServiceDetail, ServiceDetailReq, ServiceInfo, Services, ServicesReq, SetEnv, SetEnvReq, Shell, ShellReq, ShellResizeReq, Sideload, SideloadReq, Socks, SocksData, SpawnDll, SSHCommand, SSHCommandReq, StartServiceByNameReq, StartServiceReq, StopServiceReq, Task, TaskReq, Terminate, TerminateReq, Tunnel, TunnelData, UnsetEnv, UnsetEnvReq, Upload, UploadReq, WGPortForward, WGPortForwardStartReq, WGPortForwardStopReq, WGSocks, WGSocksServers, WGSocksServersReq, WGSocksStartReq, WGSocksStopReq, WGTCPForwarders, WGTCPForwardersReq } from "../sliverpb/sliver";
export declare const protobufPackage = "rpcpb";
export type SliverRPCDefinition = typeof SliverRPCDefinition;
export declare const SliverRPCDefinition: {
    readonly name: "SliverRPC";
    readonly fullName: "rpcpb.SliverRPC";
    readonly methods: {
        /** ** Version *** */
        readonly getVersion: {
            readonly name: "GetVersion";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Version>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Client Logs *** */
        readonly clientLog: {
            readonly name: "ClientLog";
            readonly requestType: import("../clientpb/client").MessageFns<ClientLogData>;
            readonly requestStream: true;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Operator Commands *** */
        readonly getOperators: {
            readonly name: "GetOperators";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Operators>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Generic *** */
        readonly kill: {
            readonly name: "Kill";
            readonly requestType: import("../sliverpb/sliver").MessageFns<KillReq>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly reconfigure: {
            readonly name: "Reconfigure";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ReconfigureReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Reconfigure>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly rename: {
            readonly name: "Rename";
            readonly requestType: import("../clientpb/client").MessageFns<RenameReq>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Sessions *** */
        readonly getSessions: {
            readonly name: "GetSessions";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Sessions>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** **Threat monitoring *** */
        readonly monitorStart: {
            readonly name: "MonitorStart";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Response>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly monitorStop: {
            readonly name: "MonitorStop";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly monitorListConfig: {
            readonly name: "MonitorListConfig";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<MonitoringProviders>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly monitorAddConfig: {
            readonly name: "MonitorAddConfig";
            readonly requestType: import("../clientpb/client").MessageFns<MonitoringProvider>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Response>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly monitorDelConfig: {
            readonly name: "MonitorDelConfig";
            readonly requestType: import("../clientpb/client").MessageFns<MonitoringProvider>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Response>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Listeners *** */
        readonly startMTLSListener: {
            readonly name: "StartMTLSListener";
            readonly requestType: import("../clientpb/client").MessageFns<MTLSListenerReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ListenerJob>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly startWGListener: {
            readonly name: "StartWGListener";
            readonly requestType: import("../clientpb/client").MessageFns<WGListenerReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ListenerJob>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly startDNSListener: {
            readonly name: "StartDNSListener";
            readonly requestType: import("../clientpb/client").MessageFns<DNSListenerReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ListenerJob>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly startHTTPSListener: {
            readonly name: "StartHTTPSListener";
            readonly requestType: import("../clientpb/client").MessageFns<HTTPListenerReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ListenerJob>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly startHTTPListener: {
            readonly name: "StartHTTPListener";
            readonly requestType: import("../clientpb/client").MessageFns<HTTPListenerReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ListenerJob>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Beacons *** */
        readonly getBeacons: {
            readonly name: "GetBeacons";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Beacons>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getBeacon: {
            readonly name: "GetBeacon";
            readonly requestType: import("../clientpb/client").MessageFns<Beacon>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Beacon>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly rmBeacon: {
            readonly name: "RmBeacon";
            readonly requestType: import("../clientpb/client").MessageFns<Beacon>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getBeaconTasks: {
            readonly name: "GetBeaconTasks";
            readonly requestType: import("../clientpb/client").MessageFns<Beacon>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<BeaconTasks>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getBeaconTaskContent: {
            readonly name: "GetBeaconTaskContent";
            readonly requestType: import("../clientpb/client").MessageFns<BeaconTask>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<BeaconTask>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly cancelBeaconTask: {
            readonly name: "CancelBeaconTask";
            readonly requestType: import("../clientpb/client").MessageFns<BeaconTask>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<BeaconTask>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly updateBeaconIntegrityInformation: {
            readonly name: "UpdateBeaconIntegrityInformation";
            readonly requestType: import("../clientpb/client").MessageFns<BeaconIntegrity>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Jobs *** */
        readonly getJobs: {
            readonly name: "GetJobs";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Jobs>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly killJob: {
            readonly name: "KillJob";
            readonly requestType: import("../clientpb/client").MessageFns<KillJobReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<KillJob>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly restartJobs: {
            readonly name: "RestartJobs";
            readonly requestType: import("../clientpb/client").MessageFns<RestartJobReq>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Stager Listener *** */
        readonly startTCPStagerListener: {
            readonly name: "StartTCPStagerListener";
            readonly requestType: import("../clientpb/client").MessageFns<StagerListenerReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<StagerListener>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Loot *** */
        readonly lootAdd: {
            readonly name: "LootAdd";
            readonly requestType: import("../clientpb/client").MessageFns<Loot>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Loot>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly lootRm: {
            readonly name: "LootRm";
            readonly requestType: import("../clientpb/client").MessageFns<Loot>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly lootUpdate: {
            readonly name: "LootUpdate";
            readonly requestType: import("../clientpb/client").MessageFns<Loot>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Loot>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly lootContent: {
            readonly name: "LootContent";
            readonly requestType: import("../clientpb/client").MessageFns<Loot>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Loot>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly lootAll: {
            readonly name: "LootAll";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<AllLoot>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Creds *** */
        readonly creds: {
            readonly name: "Creds";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Credentials>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly credsAdd: {
            readonly name: "CredsAdd";
            readonly requestType: import("../clientpb/client").MessageFns<Credentials>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly credsRm: {
            readonly name: "CredsRm";
            readonly requestType: import("../clientpb/client").MessageFns<Credentials>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly credsUpdate: {
            readonly name: "CredsUpdate";
            readonly requestType: import("../clientpb/client").MessageFns<Credentials>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getCredByID: {
            readonly name: "GetCredByID";
            readonly requestType: import("../clientpb/client").MessageFns<Credential>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Credential>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getCredsByHashType: {
            readonly name: "GetCredsByHashType";
            readonly requestType: import("../clientpb/client").MessageFns<Credential>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Credentials>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getPlaintextCredsByHashType: {
            readonly name: "GetPlaintextCredsByHashType";
            readonly requestType: import("../clientpb/client").MessageFns<Credential>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Credentials>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly credsSniffHashType: {
            readonly name: "CredsSniffHashType";
            readonly requestType: import("../clientpb/client").MessageFns<Credential>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Credential>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Hosts *** */
        readonly hosts: {
            readonly name: "Hosts";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<AllHosts>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly host: {
            readonly name: "Host";
            readonly requestType: import("../clientpb/client").MessageFns<Host>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Host>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly hostRm: {
            readonly name: "HostRm";
            readonly requestType: import("../clientpb/client").MessageFns<Host>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly hostIOCRm: {
            readonly name: "HostIOCRm";
            readonly requestType: import("../clientpb/client").MessageFns<IOC>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Implants *** */
        readonly generate: {
            readonly name: "Generate";
            readonly requestType: import("../clientpb/client").MessageFns<GenerateReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Generate>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly generateSpoofMetadata: {
            readonly name: "GenerateSpoofMetadata";
            readonly requestType: import("../clientpb/client").MessageFns<GenerateSpoofMetadataReq>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly generateExternal: {
            readonly name: "GenerateExternal";
            readonly requestType: import("../clientpb/client").MessageFns<ExternalGenerateReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ExternalImplantConfig>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly generateExternalSaveBuild: {
            readonly name: "GenerateExternalSaveBuild";
            readonly requestType: import("../clientpb/client").MessageFns<ExternalImplantBinary>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly generateExternalGetBuildConfig: {
            readonly name: "GenerateExternalGetBuildConfig";
            readonly requestType: import("../clientpb/client").MessageFns<ImplantBuild>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ExternalImplantConfig>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly generateStage: {
            readonly name: "GenerateStage";
            readonly requestType: import("../clientpb/client").MessageFns<GenerateStageReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Generate>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly stageImplantBuild: {
            readonly name: "StageImplantBuild";
            readonly requestType: import("../clientpb/client").MessageFns<ImplantStageReq>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** HTTP C2 Profiles *** */
        readonly getHTTPC2Profiles: {
            readonly name: "GetHTTPC2Profiles";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<HTTPC2Configs>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getHTTPC2ProfileByName: {
            readonly name: "GetHTTPC2ProfileByName";
            readonly requestType: import("../clientpb/client").MessageFns<C2ProfileReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<HTTPC2Config>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly saveHTTPC2Profile: {
            readonly name: "SaveHTTPC2Profile";
            readonly requestType: import("../clientpb/client").MessageFns<HTTPC2ConfigReq>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Builders *** */
        readonly builderRegister: {
            readonly name: "BuilderRegister";
            readonly requestType: import("../clientpb/client").MessageFns<Builder>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Event>;
            readonly responseStream: true;
            readonly options: {};
        };
        readonly builderTrigger: {
            readonly name: "BuilderTrigger";
            readonly requestType: import("../clientpb/client").MessageFns<Event>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly builders: {
            readonly name: "Builders";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Builders>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Certificates *** */
        readonly getCertificateInfo: {
            readonly name: "GetCertificateInfo";
            readonly requestType: import("../clientpb/client").MessageFns<CertificatesReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<CertificateInfo>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getCertificateAuthorityInfo: {
            readonly name: "GetCertificateAuthorityInfo";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<CertificateAuthorityInfo>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Crackstation *** */
        readonly crack: {
            readonly name: "Crack";
            readonly requestType: import("../clientpb/client").MessageFns<CrackCommand>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<CrackResponse>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly crackstationRegister: {
            readonly name: "CrackstationRegister";
            readonly requestType: import("../clientpb/client").MessageFns<Crackstation>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Event>;
            readonly responseStream: true;
            readonly options: {};
        };
        readonly crackstationTrigger: {
            readonly name: "CrackstationTrigger";
            readonly requestType: import("../clientpb/client").MessageFns<Event>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly crackstationBenchmark: {
            readonly name: "CrackstationBenchmark";
            readonly requestType: import("../clientpb/client").MessageFns<CrackBenchmark>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly crackstations: {
            readonly name: "Crackstations";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Crackstations>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly crackTaskByID: {
            readonly name: "CrackTaskByID";
            readonly requestType: import("../clientpb/client").MessageFns<CrackTask>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<CrackTask>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly crackTaskUpdate: {
            readonly name: "CrackTaskUpdate";
            readonly requestType: import("../clientpb/client").MessageFns<CrackTask>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly crackFilesList: {
            readonly name: "CrackFilesList";
            readonly requestType: import("../clientpb/client").MessageFns<CrackFile>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<CrackFiles>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly crackFileCreate: {
            readonly name: "CrackFileCreate";
            readonly requestType: import("../clientpb/client").MessageFns<CrackFile>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<CrackFile>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly crackFileChunkUpload: {
            readonly name: "CrackFileChunkUpload";
            readonly requestType: import("../clientpb/client").MessageFns<CrackFileChunk>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly crackFileChunkDownload: {
            readonly name: "CrackFileChunkDownload";
            readonly requestType: import("../clientpb/client").MessageFns<CrackFileChunk>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<CrackFileChunk>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly crackFileComplete: {
            readonly name: "CrackFileComplete";
            readonly requestType: import("../clientpb/client").MessageFns<CrackFile>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly crackFileDelete: {
            readonly name: "CrackFileDelete";
            readonly requestType: import("../clientpb/client").MessageFns<CrackFile>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Payloads *** */
        readonly regenerate: {
            readonly name: "Regenerate";
            readonly requestType: import("../clientpb/client").MessageFns<RegenerateReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Generate>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly implantBuilds: {
            readonly name: "ImplantBuilds";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ImplantBuilds>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly deleteImplantBuild: {
            readonly name: "DeleteImplantBuild";
            readonly requestType: import("../clientpb/client").MessageFns<DeleteReq>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly canaries: {
            readonly name: "Canaries";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Canaries>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly generateWGClientConfig: {
            readonly name: "GenerateWGClientConfig";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<WGClientConfig>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly generateUniqueIP: {
            readonly name: "GenerateUniqueIP";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<UniqueWGIP>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly implantProfiles: {
            readonly name: "ImplantProfiles";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ImplantProfiles>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly deleteImplantProfile: {
            readonly name: "DeleteImplantProfile";
            readonly requestType: import("../clientpb/client").MessageFns<DeleteReq>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly saveImplantProfile: {
            readonly name: "SaveImplantProfile";
            readonly requestType: import("../clientpb/client").MessageFns<ImplantProfile>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ImplantProfile>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly shellcodeRDI: {
            readonly name: "ShellcodeRDI";
            readonly requestType: import("../clientpb/client").MessageFns<ShellcodeRDIReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ShellcodeRDI>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getCompiler: {
            readonly name: "GetCompiler";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Compiler>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly shellcodeEncoder: {
            readonly name: "ShellcodeEncoder";
            readonly requestType: import("../clientpb/client").MessageFns<ShellcodeEncodeReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ShellcodeEncode>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly shellcodeEncoderMap: {
            readonly name: "ShellcodeEncoderMap";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<ShellcodeEncoderMap>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly trafficEncoderMap: {
            readonly name: "TrafficEncoderMap";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<TrafficEncoderMap>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly trafficEncoderAdd: {
            readonly name: "TrafficEncoderAdd";
            readonly requestType: import("../clientpb/client").MessageFns<TrafficEncoder>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<TrafficEncoderTests>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly trafficEncoderRm: {
            readonly name: "TrafficEncoderRm";
            readonly requestType: import("../clientpb/client").MessageFns<TrafficEncoder>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Websites *** */
        readonly websites: {
            readonly name: "Websites";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Websites>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly website: {
            readonly name: "Website";
            readonly requestType: import("../clientpb/client").MessageFns<Website>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Website>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly websiteRemove: {
            readonly name: "WebsiteRemove";
            readonly requestType: import("../clientpb/client").MessageFns<Website>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly websiteAddContent: {
            readonly name: "WebsiteAddContent";
            readonly requestType: import("../clientpb/client").MessageFns<WebsiteAddContent>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Website>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly websiteUpdateContent: {
            readonly name: "WebsiteUpdateContent";
            readonly requestType: import("../clientpb/client").MessageFns<WebsiteAddContent>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Website>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly websiteRemoveContent: {
            readonly name: "WebsiteRemoveContent";
            readonly requestType: import("../clientpb/client").MessageFns<WebsiteRemoveContent>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Website>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Session Interactions *** */
        readonly ping: {
            readonly name: "Ping";
            readonly requestType: import("../sliverpb/sliver").MessageFns<Ping>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Ping>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly ps: {
            readonly name: "Ps";
            readonly requestType: import("../sliverpb/sliver").MessageFns<PsReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Ps>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly terminate: {
            readonly name: "Terminate";
            readonly requestType: import("../sliverpb/sliver").MessageFns<TerminateReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Terminate>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly ifconfig: {
            readonly name: "Ifconfig";
            readonly requestType: import("../sliverpb/sliver").MessageFns<IfconfigReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Ifconfig>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly netstat: {
            readonly name: "Netstat";
            readonly requestType: import("../sliverpb/sliver").MessageFns<NetstatReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Netstat>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly ls: {
            readonly name: "Ls";
            readonly requestType: import("../sliverpb/sliver").MessageFns<LsReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Ls>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly cd: {
            readonly name: "Cd";
            readonly requestType: import("../sliverpb/sliver").MessageFns<CdReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Pwd>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly pwd: {
            readonly name: "Pwd";
            readonly requestType: import("../sliverpb/sliver").MessageFns<PwdReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Pwd>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly mv: {
            readonly name: "Mv";
            readonly requestType: import("../sliverpb/sliver").MessageFns<MvReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Mv>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly cp: {
            readonly name: "Cp";
            readonly requestType: import("../sliverpb/sliver").MessageFns<CpReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Cp>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly rm: {
            readonly name: "Rm";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RmReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Rm>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly mkdir: {
            readonly name: "Mkdir";
            readonly requestType: import("../sliverpb/sliver").MessageFns<MkdirReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Mkdir>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly download: {
            readonly name: "Download";
            readonly requestType: import("../sliverpb/sliver").MessageFns<DownloadReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Download>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly upload: {
            readonly name: "Upload";
            readonly requestType: import("../sliverpb/sliver").MessageFns<UploadReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Upload>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly grep: {
            readonly name: "Grep";
            readonly requestType: import("../sliverpb/sliver").MessageFns<GrepReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Grep>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly chmod: {
            readonly name: "Chmod";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ChmodReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Chmod>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly chown: {
            readonly name: "Chown";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ChownReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Chown>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly chtimes: {
            readonly name: "Chtimes";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ChtimesReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Chtimes>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly memfilesList: {
            readonly name: "MemfilesList";
            readonly requestType: import("../sliverpb/sliver").MessageFns<MemfilesListReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Ls>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly memfilesAdd: {
            readonly name: "MemfilesAdd";
            readonly requestType: import("../sliverpb/sliver").MessageFns<MemfilesAddReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<MemfilesAdd>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly memfilesRm: {
            readonly name: "MemfilesRm";
            readonly requestType: import("../sliverpb/sliver").MessageFns<MemfilesRmReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<MemfilesRm>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly mount: {
            readonly name: "Mount";
            readonly requestType: import("../sliverpb/sliver").MessageFns<MountReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Mount>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly processDump: {
            readonly name: "ProcessDump";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ProcessDumpReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<ProcessDump>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly runAs: {
            readonly name: "RunAs";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RunAsReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RunAs>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly impersonate: {
            readonly name: "Impersonate";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ImpersonateReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Impersonate>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly revToSelf: {
            readonly name: "RevToSelf";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RevToSelfReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RevToSelf>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getSystem: {
            readonly name: "GetSystem";
            readonly requestType: import("../clientpb/client").MessageFns<GetSystemReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<GetSystem>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly task: {
            readonly name: "Task";
            readonly requestType: import("../sliverpb/sliver").MessageFns<TaskReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Task>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly msf: {
            readonly name: "Msf";
            readonly requestType: import("../clientpb/client").MessageFns<MSFReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Task>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly msfRemote: {
            readonly name: "MsfRemote";
            readonly requestType: import("../clientpb/client").MessageFns<MSFRemoteReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Task>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly executeAssembly: {
            readonly name: "ExecuteAssembly";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ExecuteAssemblyReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<ExecuteAssembly>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly migrate: {
            readonly name: "Migrate";
            readonly requestType: import("../clientpb/client").MessageFns<MigrateReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Migrate>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly execute: {
            readonly name: "Execute";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ExecuteReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Execute>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly executeWindows: {
            readonly name: "ExecuteWindows";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ExecuteWindowsReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Execute>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly executeChildren: {
            readonly name: "ExecuteChildren";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ExecuteChildrenReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<ExecuteChildren>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly sideload: {
            readonly name: "Sideload";
            readonly requestType: import("../sliverpb/sliver").MessageFns<SideloadReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Sideload>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly spawnDll: {
            readonly name: "SpawnDll";
            readonly requestType: import("../sliverpb/sliver").MessageFns<InvokeSpawnDllReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<SpawnDll>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly screenshot: {
            readonly name: "Screenshot";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ScreenshotReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Screenshot>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly currentTokenOwner: {
            readonly name: "CurrentTokenOwner";
            readonly requestType: import("../sliverpb/sliver").MessageFns<CurrentTokenOwnerReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<CurrentTokenOwner>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly services: {
            readonly name: "Services";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ServicesReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Services>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly serviceDetail: {
            readonly name: "ServiceDetail";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ServiceDetailReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<ServiceDetail>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly startServiceByName: {
            readonly name: "StartServiceByName";
            readonly requestType: import("../sliverpb/sliver").MessageFns<StartServiceByNameReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<ServiceInfo>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Pivots *** */
        readonly pivotStartListener: {
            readonly name: "PivotStartListener";
            readonly requestType: import("../sliverpb/sliver").MessageFns<PivotStartListenerReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<PivotListener>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly pivotStopListener: {
            readonly name: "PivotStopListener";
            readonly requestType: import("../sliverpb/sliver").MessageFns<PivotStopListenerReq>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly pivotSessionListeners: {
            readonly name: "PivotSessionListeners";
            readonly requestType: import("../sliverpb/sliver").MessageFns<PivotListenersReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<PivotListeners>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly pivotGraph: {
            readonly name: "PivotGraph";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<PivotGraph>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly startService: {
            readonly name: "StartService";
            readonly requestType: import("../sliverpb/sliver").MessageFns<StartServiceReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<ServiceInfo>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly stopService: {
            readonly name: "StopService";
            readonly requestType: import("../sliverpb/sliver").MessageFns<StopServiceReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<ServiceInfo>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly removeService: {
            readonly name: "RemoveService";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RemoveServiceReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<ServiceInfo>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly makeToken: {
            readonly name: "MakeToken";
            readonly requestType: import("../sliverpb/sliver").MessageFns<MakeTokenReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<MakeToken>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getEnv: {
            readonly name: "GetEnv";
            readonly requestType: import("../sliverpb/sliver").MessageFns<EnvReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<EnvInfo>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly setEnv: {
            readonly name: "SetEnv";
            readonly requestType: import("../sliverpb/sliver").MessageFns<SetEnvReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<SetEnv>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly unsetEnv: {
            readonly name: "UnsetEnv";
            readonly requestType: import("../sliverpb/sliver").MessageFns<UnsetEnvReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<UnsetEnv>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly backdoor: {
            readonly name: "Backdoor";
            readonly requestType: import("../clientpb/client").MessageFns<BackdoorReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Backdoor>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly registryRead: {
            readonly name: "RegistryRead";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RegistryReadReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RegistryRead>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly registryWrite: {
            readonly name: "RegistryWrite";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RegistryWriteReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RegistryWrite>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly registryCreateKey: {
            readonly name: "RegistryCreateKey";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RegistryCreateKeyReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RegistryCreateKey>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly registryDeleteKey: {
            readonly name: "RegistryDeleteKey";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RegistryDeleteKeyReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RegistryDeleteKey>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly registryListSubKeys: {
            readonly name: "RegistryListSubKeys";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RegistrySubKeyListReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RegistrySubKeyList>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly registryListValues: {
            readonly name: "RegistryListValues";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RegistryListValuesReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RegistryValuesList>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly registryReadHive: {
            readonly name: "RegistryReadHive";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RegistryReadHiveReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RegistryReadHive>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly runSSHCommand: {
            readonly name: "RunSSHCommand";
            readonly requestType: import("../sliverpb/sliver").MessageFns<SSHCommandReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<SSHCommand>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly hijackDLL: {
            readonly name: "HijackDLL";
            readonly requestType: import("../clientpb/client").MessageFns<DllHijackReq>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<DllHijack>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getPrivs: {
            readonly name: "GetPrivs";
            readonly requestType: import("../sliverpb/sliver").MessageFns<GetPrivsReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<GetPrivs>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly startRportFwdListener: {
            readonly name: "StartRportFwdListener";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RportFwdStartListenerReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RportFwdListener>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly getRportFwdListeners: {
            readonly name: "GetRportFwdListeners";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RportFwdListenersReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RportFwdListeners>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly stopRportFwdListener: {
            readonly name: "StopRportFwdListener";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RportFwdStopListenerReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RportFwdListener>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Beacon *** -only commands */
        readonly openSession: {
            readonly name: "OpenSession";
            readonly requestType: import("../sliverpb/sliver").MessageFns<OpenSession>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<OpenSession>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly closeSession: {
            readonly name: "CloseSession";
            readonly requestType: import("../sliverpb/sliver").MessageFns<CloseSession>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Extensions *** */
        readonly registerExtension: {
            readonly name: "RegisterExtension";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RegisterExtensionReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RegisterExtension>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly callExtension: {
            readonly name: "CallExtension";
            readonly requestType: import("../sliverpb/sliver").MessageFns<CallExtensionReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<CallExtension>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly listExtensions: {
            readonly name: "ListExtensions";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ListExtensionsReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<ListExtensions>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Wasm Extensions *** */
        readonly registerWasmExtension: {
            readonly name: "RegisterWasmExtension";
            readonly requestType: import("../sliverpb/sliver").MessageFns<RegisterWasmExtensionReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<RegisterWasmExtension>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly listWasmExtensions: {
            readonly name: "ListWasmExtensions";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ListWasmExtensionsReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<ListWasmExtensions>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly execWasmExtension: {
            readonly name: "ExecWasmExtension";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ExecWasmExtensionReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<ExecWasmExtension>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Wireguard Specific *** */
        readonly wGStartPortForward: {
            readonly name: "WGStartPortForward";
            readonly requestType: import("../sliverpb/sliver").MessageFns<WGPortForwardStartReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<WGPortForward>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly wGStopPortForward: {
            readonly name: "WGStopPortForward";
            readonly requestType: import("../sliverpb/sliver").MessageFns<WGPortForwardStopReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<WGPortForward>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly wGStartSocks: {
            readonly name: "WGStartSocks";
            readonly requestType: import("../sliverpb/sliver").MessageFns<WGSocksStartReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<WGSocks>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly wGStopSocks: {
            readonly name: "WGStopSocks";
            readonly requestType: import("../sliverpb/sliver").MessageFns<WGSocksStopReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<WGSocks>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly wGListForwarders: {
            readonly name: "WGListForwarders";
            readonly requestType: import("../sliverpb/sliver").MessageFns<WGTCPForwardersReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<WGTCPForwarders>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly wGListSocksServers: {
            readonly name: "WGListSocksServers";
            readonly requestType: import("../sliverpb/sliver").MessageFns<WGSocksServersReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<WGSocksServers>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Realtime Commands *** */
        readonly shell: {
            readonly name: "Shell";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ShellReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Shell>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly shellResize: {
            readonly name: "ShellResize";
            readonly requestType: import("../sliverpb/sliver").MessageFns<ShellResizeReq>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly portfwd: {
            readonly name: "Portfwd";
            readonly requestType: import("../sliverpb/sliver").MessageFns<PortfwdReq>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Portfwd>;
            readonly responseStream: false;
            readonly options: {};
        };
        /** ** Socks5 *** */
        readonly createSocks: {
            readonly name: "CreateSocks";
            readonly requestType: import("../sliverpb/sliver").MessageFns<Socks>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Socks>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly closeSocks: {
            readonly name: "CloseSocks";
            readonly requestType: import("../sliverpb/sliver").MessageFns<Socks>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly socksProxy: {
            readonly name: "SocksProxy";
            readonly requestType: import("../sliverpb/sliver").MessageFns<SocksData>;
            readonly requestStream: true;
            readonly responseType: import("../sliverpb/sliver").MessageFns<SocksData>;
            readonly responseStream: true;
            readonly options: {};
        };
        /** ** Tunnels *** */
        readonly createTunnel: {
            readonly name: "CreateTunnel";
            readonly requestType: import("../sliverpb/sliver").MessageFns<Tunnel>;
            readonly requestStream: false;
            readonly responseType: import("../sliverpb/sliver").MessageFns<Tunnel>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly closeTunnel: {
            readonly name: "CloseTunnel";
            readonly requestType: import("../sliverpb/sliver").MessageFns<Tunnel>;
            readonly requestStream: false;
            readonly responseType: import("../commonpb/common").MessageFns<Empty>;
            readonly responseStream: false;
            readonly options: {};
        };
        readonly tunnelData: {
            readonly name: "TunnelData";
            readonly requestType: import("../sliverpb/sliver").MessageFns<TunnelData>;
            readonly requestStream: true;
            readonly responseType: import("../sliverpb/sliver").MessageFns<TunnelData>;
            readonly responseStream: true;
            readonly options: {};
        };
        /** ** Events *** */
        readonly events: {
            readonly name: "Events";
            readonly requestType: import("../commonpb/common").MessageFns<Empty>;
            readonly requestStream: false;
            readonly responseType: import("../clientpb/client").MessageFns<Event>;
            readonly responseStream: true;
            readonly options: {};
        };
    };
};
export interface SliverRPCServiceImplementation<CallContextExt = {}> {
    /** ** Version *** */
    getVersion(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Version>>;
    /** ** Client Logs *** */
    clientLog(request: AsyncIterable<ClientLogData>, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    /** ** Operator Commands *** */
    getOperators(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Operators>>;
    /** ** Generic *** */
    kill(request: KillReq, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    reconfigure(request: ReconfigureReq, context: CallContext & CallContextExt): Promise<DeepPartial<Reconfigure>>;
    rename(request: RenameReq, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    /** ** Sessions *** */
    getSessions(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Sessions>>;
    /** **Threat monitoring *** */
    monitorStart(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Response>>;
    monitorStop(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    monitorListConfig(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<MonitoringProviders>>;
    monitorAddConfig(request: MonitoringProvider, context: CallContext & CallContextExt): Promise<DeepPartial<Response>>;
    monitorDelConfig(request: MonitoringProvider, context: CallContext & CallContextExt): Promise<DeepPartial<Response>>;
    /** ** Listeners *** */
    startMTLSListener(request: MTLSListenerReq, context: CallContext & CallContextExt): Promise<DeepPartial<ListenerJob>>;
    startWGListener(request: WGListenerReq, context: CallContext & CallContextExt): Promise<DeepPartial<ListenerJob>>;
    startDNSListener(request: DNSListenerReq, context: CallContext & CallContextExt): Promise<DeepPartial<ListenerJob>>;
    startHTTPSListener(request: HTTPListenerReq, context: CallContext & CallContextExt): Promise<DeepPartial<ListenerJob>>;
    startHTTPListener(request: HTTPListenerReq, context: CallContext & CallContextExt): Promise<DeepPartial<ListenerJob>>;
    /** ** Beacons *** */
    getBeacons(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Beacons>>;
    getBeacon(request: Beacon, context: CallContext & CallContextExt): Promise<DeepPartial<Beacon>>;
    rmBeacon(request: Beacon, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    getBeaconTasks(request: Beacon, context: CallContext & CallContextExt): Promise<DeepPartial<BeaconTasks>>;
    getBeaconTaskContent(request: BeaconTask, context: CallContext & CallContextExt): Promise<DeepPartial<BeaconTask>>;
    cancelBeaconTask(request: BeaconTask, context: CallContext & CallContextExt): Promise<DeepPartial<BeaconTask>>;
    updateBeaconIntegrityInformation(request: BeaconIntegrity, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    /** ** Jobs *** */
    getJobs(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Jobs>>;
    killJob(request: KillJobReq, context: CallContext & CallContextExt): Promise<DeepPartial<KillJob>>;
    restartJobs(request: RestartJobReq, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    /** ** Stager Listener *** */
    startTCPStagerListener(request: StagerListenerReq, context: CallContext & CallContextExt): Promise<DeepPartial<StagerListener>>;
    /** ** Loot *** */
    lootAdd(request: Loot, context: CallContext & CallContextExt): Promise<DeepPartial<Loot>>;
    lootRm(request: Loot, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    lootUpdate(request: Loot, context: CallContext & CallContextExt): Promise<DeepPartial<Loot>>;
    lootContent(request: Loot, context: CallContext & CallContextExt): Promise<DeepPartial<Loot>>;
    lootAll(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<AllLoot>>;
    /** ** Creds *** */
    creds(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Credentials>>;
    credsAdd(request: Credentials, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    credsRm(request: Credentials, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    credsUpdate(request: Credentials, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    getCredByID(request: Credential, context: CallContext & CallContextExt): Promise<DeepPartial<Credential>>;
    getCredsByHashType(request: Credential, context: CallContext & CallContextExt): Promise<DeepPartial<Credentials>>;
    getPlaintextCredsByHashType(request: Credential, context: CallContext & CallContextExt): Promise<DeepPartial<Credentials>>;
    credsSniffHashType(request: Credential, context: CallContext & CallContextExt): Promise<DeepPartial<Credential>>;
    /** ** Hosts *** */
    hosts(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<AllHosts>>;
    host(request: Host, context: CallContext & CallContextExt): Promise<DeepPartial<Host>>;
    hostRm(request: Host, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    hostIOCRm(request: IOC, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    /** ** Implants *** */
    generate(request: GenerateReq, context: CallContext & CallContextExt): Promise<DeepPartial<Generate>>;
    generateSpoofMetadata(request: GenerateSpoofMetadataReq, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    generateExternal(request: ExternalGenerateReq, context: CallContext & CallContextExt): Promise<DeepPartial<ExternalImplantConfig>>;
    generateExternalSaveBuild(request: ExternalImplantBinary, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    generateExternalGetBuildConfig(request: ImplantBuild, context: CallContext & CallContextExt): Promise<DeepPartial<ExternalImplantConfig>>;
    generateStage(request: GenerateStageReq, context: CallContext & CallContextExt): Promise<DeepPartial<Generate>>;
    stageImplantBuild(request: ImplantStageReq, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    /** ** HTTP C2 Profiles *** */
    getHTTPC2Profiles(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<HTTPC2Configs>>;
    getHTTPC2ProfileByName(request: C2ProfileReq, context: CallContext & CallContextExt): Promise<DeepPartial<HTTPC2Config>>;
    saveHTTPC2Profile(request: HTTPC2ConfigReq, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    /** ** Builders *** */
    builderRegister(request: Builder, context: CallContext & CallContextExt): ServerStreamingMethodResult<DeepPartial<Event>>;
    builderTrigger(request: Event, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    builders(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Builders>>;
    /** ** Certificates *** */
    getCertificateInfo(request: CertificatesReq, context: CallContext & CallContextExt): Promise<DeepPartial<CertificateInfo>>;
    getCertificateAuthorityInfo(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<CertificateAuthorityInfo>>;
    /** ** Crackstation *** */
    crack(request: CrackCommand, context: CallContext & CallContextExt): Promise<DeepPartial<CrackResponse>>;
    crackstationRegister(request: Crackstation, context: CallContext & CallContextExt): ServerStreamingMethodResult<DeepPartial<Event>>;
    crackstationTrigger(request: Event, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    crackstationBenchmark(request: CrackBenchmark, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    crackstations(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Crackstations>>;
    crackTaskByID(request: CrackTask, context: CallContext & CallContextExt): Promise<DeepPartial<CrackTask>>;
    crackTaskUpdate(request: CrackTask, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    crackFilesList(request: CrackFile, context: CallContext & CallContextExt): Promise<DeepPartial<CrackFiles>>;
    crackFileCreate(request: CrackFile, context: CallContext & CallContextExt): Promise<DeepPartial<CrackFile>>;
    crackFileChunkUpload(request: CrackFileChunk, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    crackFileChunkDownload(request: CrackFileChunk, context: CallContext & CallContextExt): Promise<DeepPartial<CrackFileChunk>>;
    crackFileComplete(request: CrackFile, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    crackFileDelete(request: CrackFile, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    /** ** Payloads *** */
    regenerate(request: RegenerateReq, context: CallContext & CallContextExt): Promise<DeepPartial<Generate>>;
    implantBuilds(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<ImplantBuilds>>;
    deleteImplantBuild(request: DeleteReq, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    canaries(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Canaries>>;
    generateWGClientConfig(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<WGClientConfig>>;
    generateUniqueIP(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<UniqueWGIP>>;
    implantProfiles(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<ImplantProfiles>>;
    deleteImplantProfile(request: DeleteReq, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    saveImplantProfile(request: ImplantProfile, context: CallContext & CallContextExt): Promise<DeepPartial<ImplantProfile>>;
    shellcodeRDI(request: ShellcodeRDIReq, context: CallContext & CallContextExt): Promise<DeepPartial<ShellcodeRDI>>;
    getCompiler(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Compiler>>;
    shellcodeEncoder(request: ShellcodeEncodeReq, context: CallContext & CallContextExt): Promise<DeepPartial<ShellcodeEncode>>;
    shellcodeEncoderMap(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<ShellcodeEncoderMap>>;
    trafficEncoderMap(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<TrafficEncoderMap>>;
    trafficEncoderAdd(request: TrafficEncoder, context: CallContext & CallContextExt): Promise<DeepPartial<TrafficEncoderTests>>;
    trafficEncoderRm(request: TrafficEncoder, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    /** ** Websites *** */
    websites(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<Websites>>;
    website(request: Website, context: CallContext & CallContextExt): Promise<DeepPartial<Website>>;
    websiteRemove(request: Website, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    websiteAddContent(request: WebsiteAddContent, context: CallContext & CallContextExt): Promise<DeepPartial<Website>>;
    websiteUpdateContent(request: WebsiteAddContent, context: CallContext & CallContextExt): Promise<DeepPartial<Website>>;
    websiteRemoveContent(request: WebsiteRemoveContent, context: CallContext & CallContextExt): Promise<DeepPartial<Website>>;
    /** ** Session Interactions *** */
    ping(request: Ping, context: CallContext & CallContextExt): Promise<DeepPartial<Ping>>;
    ps(request: PsReq, context: CallContext & CallContextExt): Promise<DeepPartial<Ps>>;
    terminate(request: TerminateReq, context: CallContext & CallContextExt): Promise<DeepPartial<Terminate>>;
    ifconfig(request: IfconfigReq, context: CallContext & CallContextExt): Promise<DeepPartial<Ifconfig>>;
    netstat(request: NetstatReq, context: CallContext & CallContextExt): Promise<DeepPartial<Netstat>>;
    ls(request: LsReq, context: CallContext & CallContextExt): Promise<DeepPartial<Ls>>;
    cd(request: CdReq, context: CallContext & CallContextExt): Promise<DeepPartial<Pwd>>;
    pwd(request: PwdReq, context: CallContext & CallContextExt): Promise<DeepPartial<Pwd>>;
    mv(request: MvReq, context: CallContext & CallContextExt): Promise<DeepPartial<Mv>>;
    cp(request: CpReq, context: CallContext & CallContextExt): Promise<DeepPartial<Cp>>;
    rm(request: RmReq, context: CallContext & CallContextExt): Promise<DeepPartial<Rm>>;
    mkdir(request: MkdirReq, context: CallContext & CallContextExt): Promise<DeepPartial<Mkdir>>;
    download(request: DownloadReq, context: CallContext & CallContextExt): Promise<DeepPartial<Download>>;
    upload(request: UploadReq, context: CallContext & CallContextExt): Promise<DeepPartial<Upload>>;
    grep(request: GrepReq, context: CallContext & CallContextExt): Promise<DeepPartial<Grep>>;
    chmod(request: ChmodReq, context: CallContext & CallContextExt): Promise<DeepPartial<Chmod>>;
    chown(request: ChownReq, context: CallContext & CallContextExt): Promise<DeepPartial<Chown>>;
    chtimes(request: ChtimesReq, context: CallContext & CallContextExt): Promise<DeepPartial<Chtimes>>;
    memfilesList(request: MemfilesListReq, context: CallContext & CallContextExt): Promise<DeepPartial<Ls>>;
    memfilesAdd(request: MemfilesAddReq, context: CallContext & CallContextExt): Promise<DeepPartial<MemfilesAdd>>;
    memfilesRm(request: MemfilesRmReq, context: CallContext & CallContextExt): Promise<DeepPartial<MemfilesRm>>;
    mount(request: MountReq, context: CallContext & CallContextExt): Promise<DeepPartial<Mount>>;
    processDump(request: ProcessDumpReq, context: CallContext & CallContextExt): Promise<DeepPartial<ProcessDump>>;
    runAs(request: RunAsReq, context: CallContext & CallContextExt): Promise<DeepPartial<RunAs>>;
    impersonate(request: ImpersonateReq, context: CallContext & CallContextExt): Promise<DeepPartial<Impersonate>>;
    revToSelf(request: RevToSelfReq, context: CallContext & CallContextExt): Promise<DeepPartial<RevToSelf>>;
    getSystem(request: GetSystemReq, context: CallContext & CallContextExt): Promise<DeepPartial<GetSystem>>;
    task(request: TaskReq, context: CallContext & CallContextExt): Promise<DeepPartial<Task>>;
    msf(request: MSFReq, context: CallContext & CallContextExt): Promise<DeepPartial<Task>>;
    msfRemote(request: MSFRemoteReq, context: CallContext & CallContextExt): Promise<DeepPartial<Task>>;
    executeAssembly(request: ExecuteAssemblyReq, context: CallContext & CallContextExt): Promise<DeepPartial<ExecuteAssembly>>;
    migrate(request: MigrateReq, context: CallContext & CallContextExt): Promise<DeepPartial<Migrate>>;
    execute(request: ExecuteReq, context: CallContext & CallContextExt): Promise<DeepPartial<Execute>>;
    executeWindows(request: ExecuteWindowsReq, context: CallContext & CallContextExt): Promise<DeepPartial<Execute>>;
    executeChildren(request: ExecuteChildrenReq, context: CallContext & CallContextExt): Promise<DeepPartial<ExecuteChildren>>;
    sideload(request: SideloadReq, context: CallContext & CallContextExt): Promise<DeepPartial<Sideload>>;
    spawnDll(request: InvokeSpawnDllReq, context: CallContext & CallContextExt): Promise<DeepPartial<SpawnDll>>;
    screenshot(request: ScreenshotReq, context: CallContext & CallContextExt): Promise<DeepPartial<Screenshot>>;
    currentTokenOwner(request: CurrentTokenOwnerReq, context: CallContext & CallContextExt): Promise<DeepPartial<CurrentTokenOwner>>;
    services(request: ServicesReq, context: CallContext & CallContextExt): Promise<DeepPartial<Services>>;
    serviceDetail(request: ServiceDetailReq, context: CallContext & CallContextExt): Promise<DeepPartial<ServiceDetail>>;
    startServiceByName(request: StartServiceByNameReq, context: CallContext & CallContextExt): Promise<DeepPartial<ServiceInfo>>;
    /** ** Pivots *** */
    pivotStartListener(request: PivotStartListenerReq, context: CallContext & CallContextExt): Promise<DeepPartial<PivotListener>>;
    pivotStopListener(request: PivotStopListenerReq, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    pivotSessionListeners(request: PivotListenersReq, context: CallContext & CallContextExt): Promise<DeepPartial<PivotListeners>>;
    pivotGraph(request: Empty, context: CallContext & CallContextExt): Promise<DeepPartial<PivotGraph>>;
    startService(request: StartServiceReq, context: CallContext & CallContextExt): Promise<DeepPartial<ServiceInfo>>;
    stopService(request: StopServiceReq, context: CallContext & CallContextExt): Promise<DeepPartial<ServiceInfo>>;
    removeService(request: RemoveServiceReq, context: CallContext & CallContextExt): Promise<DeepPartial<ServiceInfo>>;
    makeToken(request: MakeTokenReq, context: CallContext & CallContextExt): Promise<DeepPartial<MakeToken>>;
    getEnv(request: EnvReq, context: CallContext & CallContextExt): Promise<DeepPartial<EnvInfo>>;
    setEnv(request: SetEnvReq, context: CallContext & CallContextExt): Promise<DeepPartial<SetEnv>>;
    unsetEnv(request: UnsetEnvReq, context: CallContext & CallContextExt): Promise<DeepPartial<UnsetEnv>>;
    backdoor(request: BackdoorReq, context: CallContext & CallContextExt): Promise<DeepPartial<Backdoor>>;
    registryRead(request: RegistryReadReq, context: CallContext & CallContextExt): Promise<DeepPartial<RegistryRead>>;
    registryWrite(request: RegistryWriteReq, context: CallContext & CallContextExt): Promise<DeepPartial<RegistryWrite>>;
    registryCreateKey(request: RegistryCreateKeyReq, context: CallContext & CallContextExt): Promise<DeepPartial<RegistryCreateKey>>;
    registryDeleteKey(request: RegistryDeleteKeyReq, context: CallContext & CallContextExt): Promise<DeepPartial<RegistryDeleteKey>>;
    registryListSubKeys(request: RegistrySubKeyListReq, context: CallContext & CallContextExt): Promise<DeepPartial<RegistrySubKeyList>>;
    registryListValues(request: RegistryListValuesReq, context: CallContext & CallContextExt): Promise<DeepPartial<RegistryValuesList>>;
    registryReadHive(request: RegistryReadHiveReq, context: CallContext & CallContextExt): Promise<DeepPartial<RegistryReadHive>>;
    runSSHCommand(request: SSHCommandReq, context: CallContext & CallContextExt): Promise<DeepPartial<SSHCommand>>;
    hijackDLL(request: DllHijackReq, context: CallContext & CallContextExt): Promise<DeepPartial<DllHijack>>;
    getPrivs(request: GetPrivsReq, context: CallContext & CallContextExt): Promise<DeepPartial<GetPrivs>>;
    startRportFwdListener(request: RportFwdStartListenerReq, context: CallContext & CallContextExt): Promise<DeepPartial<RportFwdListener>>;
    getRportFwdListeners(request: RportFwdListenersReq, context: CallContext & CallContextExt): Promise<DeepPartial<RportFwdListeners>>;
    stopRportFwdListener(request: RportFwdStopListenerReq, context: CallContext & CallContextExt): Promise<DeepPartial<RportFwdListener>>;
    /** ** Beacon *** -only commands */
    openSession(request: OpenSession, context: CallContext & CallContextExt): Promise<DeepPartial<OpenSession>>;
    closeSession(request: CloseSession, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    /** ** Extensions *** */
    registerExtension(request: RegisterExtensionReq, context: CallContext & CallContextExt): Promise<DeepPartial<RegisterExtension>>;
    callExtension(request: CallExtensionReq, context: CallContext & CallContextExt): Promise<DeepPartial<CallExtension>>;
    listExtensions(request: ListExtensionsReq, context: CallContext & CallContextExt): Promise<DeepPartial<ListExtensions>>;
    /** ** Wasm Extensions *** */
    registerWasmExtension(request: RegisterWasmExtensionReq, context: CallContext & CallContextExt): Promise<DeepPartial<RegisterWasmExtension>>;
    listWasmExtensions(request: ListWasmExtensionsReq, context: CallContext & CallContextExt): Promise<DeepPartial<ListWasmExtensions>>;
    execWasmExtension(request: ExecWasmExtensionReq, context: CallContext & CallContextExt): Promise<DeepPartial<ExecWasmExtension>>;
    /** ** Wireguard Specific *** */
    wGStartPortForward(request: WGPortForwardStartReq, context: CallContext & CallContextExt): Promise<DeepPartial<WGPortForward>>;
    wGStopPortForward(request: WGPortForwardStopReq, context: CallContext & CallContextExt): Promise<DeepPartial<WGPortForward>>;
    wGStartSocks(request: WGSocksStartReq, context: CallContext & CallContextExt): Promise<DeepPartial<WGSocks>>;
    wGStopSocks(request: WGSocksStopReq, context: CallContext & CallContextExt): Promise<DeepPartial<WGSocks>>;
    wGListForwarders(request: WGTCPForwardersReq, context: CallContext & CallContextExt): Promise<DeepPartial<WGTCPForwarders>>;
    wGListSocksServers(request: WGSocksServersReq, context: CallContext & CallContextExt): Promise<DeepPartial<WGSocksServers>>;
    /** ** Realtime Commands *** */
    shell(request: ShellReq, context: CallContext & CallContextExt): Promise<DeepPartial<Shell>>;
    shellResize(request: ShellResizeReq, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    portfwd(request: PortfwdReq, context: CallContext & CallContextExt): Promise<DeepPartial<Portfwd>>;
    /** ** Socks5 *** */
    createSocks(request: Socks, context: CallContext & CallContextExt): Promise<DeepPartial<Socks>>;
    closeSocks(request: Socks, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    socksProxy(request: AsyncIterable<SocksData>, context: CallContext & CallContextExt): ServerStreamingMethodResult<DeepPartial<SocksData>>;
    /** ** Tunnels *** */
    createTunnel(request: Tunnel, context: CallContext & CallContextExt): Promise<DeepPartial<Tunnel>>;
    closeTunnel(request: Tunnel, context: CallContext & CallContextExt): Promise<DeepPartial<Empty>>;
    tunnelData(request: AsyncIterable<TunnelData>, context: CallContext & CallContextExt): ServerStreamingMethodResult<DeepPartial<TunnelData>>;
    /** ** Events *** */
    events(request: Empty, context: CallContext & CallContextExt): ServerStreamingMethodResult<DeepPartial<Event>>;
}
export interface SliverRPCClient<CallOptionsExt = {}> {
    /** ** Version *** */
    getVersion(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Version>;
    /** ** Client Logs *** */
    clientLog(request: AsyncIterable<DeepPartial<ClientLogData>>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    /** ** Operator Commands *** */
    getOperators(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Operators>;
    /** ** Generic *** */
    kill(request: DeepPartial<KillReq>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    reconfigure(request: DeepPartial<ReconfigureReq>, options?: CallOptions & CallOptionsExt): Promise<Reconfigure>;
    rename(request: DeepPartial<RenameReq>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    /** ** Sessions *** */
    getSessions(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Sessions>;
    /** **Threat monitoring *** */
    monitorStart(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Response>;
    monitorStop(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    monitorListConfig(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<MonitoringProviders>;
    monitorAddConfig(request: DeepPartial<MonitoringProvider>, options?: CallOptions & CallOptionsExt): Promise<Response>;
    monitorDelConfig(request: DeepPartial<MonitoringProvider>, options?: CallOptions & CallOptionsExt): Promise<Response>;
    /** ** Listeners *** */
    startMTLSListener(request: DeepPartial<MTLSListenerReq>, options?: CallOptions & CallOptionsExt): Promise<ListenerJob>;
    startWGListener(request: DeepPartial<WGListenerReq>, options?: CallOptions & CallOptionsExt): Promise<ListenerJob>;
    startDNSListener(request: DeepPartial<DNSListenerReq>, options?: CallOptions & CallOptionsExt): Promise<ListenerJob>;
    startHTTPSListener(request: DeepPartial<HTTPListenerReq>, options?: CallOptions & CallOptionsExt): Promise<ListenerJob>;
    startHTTPListener(request: DeepPartial<HTTPListenerReq>, options?: CallOptions & CallOptionsExt): Promise<ListenerJob>;
    /** ** Beacons *** */
    getBeacons(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Beacons>;
    getBeacon(request: DeepPartial<Beacon>, options?: CallOptions & CallOptionsExt): Promise<Beacon>;
    rmBeacon(request: DeepPartial<Beacon>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    getBeaconTasks(request: DeepPartial<Beacon>, options?: CallOptions & CallOptionsExt): Promise<BeaconTasks>;
    getBeaconTaskContent(request: DeepPartial<BeaconTask>, options?: CallOptions & CallOptionsExt): Promise<BeaconTask>;
    cancelBeaconTask(request: DeepPartial<BeaconTask>, options?: CallOptions & CallOptionsExt): Promise<BeaconTask>;
    updateBeaconIntegrityInformation(request: DeepPartial<BeaconIntegrity>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    /** ** Jobs *** */
    getJobs(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Jobs>;
    killJob(request: DeepPartial<KillJobReq>, options?: CallOptions & CallOptionsExt): Promise<KillJob>;
    restartJobs(request: DeepPartial<RestartJobReq>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    /** ** Stager Listener *** */
    startTCPStagerListener(request: DeepPartial<StagerListenerReq>, options?: CallOptions & CallOptionsExt): Promise<StagerListener>;
    /** ** Loot *** */
    lootAdd(request: DeepPartial<Loot>, options?: CallOptions & CallOptionsExt): Promise<Loot>;
    lootRm(request: DeepPartial<Loot>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    lootUpdate(request: DeepPartial<Loot>, options?: CallOptions & CallOptionsExt): Promise<Loot>;
    lootContent(request: DeepPartial<Loot>, options?: CallOptions & CallOptionsExt): Promise<Loot>;
    lootAll(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<AllLoot>;
    /** ** Creds *** */
    creds(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Credentials>;
    credsAdd(request: DeepPartial<Credentials>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    credsRm(request: DeepPartial<Credentials>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    credsUpdate(request: DeepPartial<Credentials>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    getCredByID(request: DeepPartial<Credential>, options?: CallOptions & CallOptionsExt): Promise<Credential>;
    getCredsByHashType(request: DeepPartial<Credential>, options?: CallOptions & CallOptionsExt): Promise<Credentials>;
    getPlaintextCredsByHashType(request: DeepPartial<Credential>, options?: CallOptions & CallOptionsExt): Promise<Credentials>;
    credsSniffHashType(request: DeepPartial<Credential>, options?: CallOptions & CallOptionsExt): Promise<Credential>;
    /** ** Hosts *** */
    hosts(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<AllHosts>;
    host(request: DeepPartial<Host>, options?: CallOptions & CallOptionsExt): Promise<Host>;
    hostRm(request: DeepPartial<Host>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    hostIOCRm(request: DeepPartial<IOC>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    /** ** Implants *** */
    generate(request: DeepPartial<GenerateReq>, options?: CallOptions & CallOptionsExt): Promise<Generate>;
    generateSpoofMetadata(request: DeepPartial<GenerateSpoofMetadataReq>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    generateExternal(request: DeepPartial<ExternalGenerateReq>, options?: CallOptions & CallOptionsExt): Promise<ExternalImplantConfig>;
    generateExternalSaveBuild(request: DeepPartial<ExternalImplantBinary>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    generateExternalGetBuildConfig(request: DeepPartial<ImplantBuild>, options?: CallOptions & CallOptionsExt): Promise<ExternalImplantConfig>;
    generateStage(request: DeepPartial<GenerateStageReq>, options?: CallOptions & CallOptionsExt): Promise<Generate>;
    stageImplantBuild(request: DeepPartial<ImplantStageReq>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    /** ** HTTP C2 Profiles *** */
    getHTTPC2Profiles(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<HTTPC2Configs>;
    getHTTPC2ProfileByName(request: DeepPartial<C2ProfileReq>, options?: CallOptions & CallOptionsExt): Promise<HTTPC2Config>;
    saveHTTPC2Profile(request: DeepPartial<HTTPC2ConfigReq>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    /** ** Builders *** */
    builderRegister(request: DeepPartial<Builder>, options?: CallOptions & CallOptionsExt): AsyncIterable<Event>;
    builderTrigger(request: DeepPartial<Event>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    builders(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Builders>;
    /** ** Certificates *** */
    getCertificateInfo(request: DeepPartial<CertificatesReq>, options?: CallOptions & CallOptionsExt): Promise<CertificateInfo>;
    getCertificateAuthorityInfo(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<CertificateAuthorityInfo>;
    /** ** Crackstation *** */
    crack(request: DeepPartial<CrackCommand>, options?: CallOptions & CallOptionsExt): Promise<CrackResponse>;
    crackstationRegister(request: DeepPartial<Crackstation>, options?: CallOptions & CallOptionsExt): AsyncIterable<Event>;
    crackstationTrigger(request: DeepPartial<Event>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    crackstationBenchmark(request: DeepPartial<CrackBenchmark>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    crackstations(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Crackstations>;
    crackTaskByID(request: DeepPartial<CrackTask>, options?: CallOptions & CallOptionsExt): Promise<CrackTask>;
    crackTaskUpdate(request: DeepPartial<CrackTask>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    crackFilesList(request: DeepPartial<CrackFile>, options?: CallOptions & CallOptionsExt): Promise<CrackFiles>;
    crackFileCreate(request: DeepPartial<CrackFile>, options?: CallOptions & CallOptionsExt): Promise<CrackFile>;
    crackFileChunkUpload(request: DeepPartial<CrackFileChunk>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    crackFileChunkDownload(request: DeepPartial<CrackFileChunk>, options?: CallOptions & CallOptionsExt): Promise<CrackFileChunk>;
    crackFileComplete(request: DeepPartial<CrackFile>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    crackFileDelete(request: DeepPartial<CrackFile>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    /** ** Payloads *** */
    regenerate(request: DeepPartial<RegenerateReq>, options?: CallOptions & CallOptionsExt): Promise<Generate>;
    implantBuilds(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<ImplantBuilds>;
    deleteImplantBuild(request: DeepPartial<DeleteReq>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    canaries(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Canaries>;
    generateWGClientConfig(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<WGClientConfig>;
    generateUniqueIP(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<UniqueWGIP>;
    implantProfiles(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<ImplantProfiles>;
    deleteImplantProfile(request: DeepPartial<DeleteReq>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    saveImplantProfile(request: DeepPartial<ImplantProfile>, options?: CallOptions & CallOptionsExt): Promise<ImplantProfile>;
    shellcodeRDI(request: DeepPartial<ShellcodeRDIReq>, options?: CallOptions & CallOptionsExt): Promise<ShellcodeRDI>;
    getCompiler(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Compiler>;
    shellcodeEncoder(request: DeepPartial<ShellcodeEncodeReq>, options?: CallOptions & CallOptionsExt): Promise<ShellcodeEncode>;
    shellcodeEncoderMap(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<ShellcodeEncoderMap>;
    trafficEncoderMap(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<TrafficEncoderMap>;
    trafficEncoderAdd(request: DeepPartial<TrafficEncoder>, options?: CallOptions & CallOptionsExt): Promise<TrafficEncoderTests>;
    trafficEncoderRm(request: DeepPartial<TrafficEncoder>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    /** ** Websites *** */
    websites(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<Websites>;
    website(request: DeepPartial<Website>, options?: CallOptions & CallOptionsExt): Promise<Website>;
    websiteRemove(request: DeepPartial<Website>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    websiteAddContent(request: DeepPartial<WebsiteAddContent>, options?: CallOptions & CallOptionsExt): Promise<Website>;
    websiteUpdateContent(request: DeepPartial<WebsiteAddContent>, options?: CallOptions & CallOptionsExt): Promise<Website>;
    websiteRemoveContent(request: DeepPartial<WebsiteRemoveContent>, options?: CallOptions & CallOptionsExt): Promise<Website>;
    /** ** Session Interactions *** */
    ping(request: DeepPartial<Ping>, options?: CallOptions & CallOptionsExt): Promise<Ping>;
    ps(request: DeepPartial<PsReq>, options?: CallOptions & CallOptionsExt): Promise<Ps>;
    terminate(request: DeepPartial<TerminateReq>, options?: CallOptions & CallOptionsExt): Promise<Terminate>;
    ifconfig(request: DeepPartial<IfconfigReq>, options?: CallOptions & CallOptionsExt): Promise<Ifconfig>;
    netstat(request: DeepPartial<NetstatReq>, options?: CallOptions & CallOptionsExt): Promise<Netstat>;
    ls(request: DeepPartial<LsReq>, options?: CallOptions & CallOptionsExt): Promise<Ls>;
    cd(request: DeepPartial<CdReq>, options?: CallOptions & CallOptionsExt): Promise<Pwd>;
    pwd(request: DeepPartial<PwdReq>, options?: CallOptions & CallOptionsExt): Promise<Pwd>;
    mv(request: DeepPartial<MvReq>, options?: CallOptions & CallOptionsExt): Promise<Mv>;
    cp(request: DeepPartial<CpReq>, options?: CallOptions & CallOptionsExt): Promise<Cp>;
    rm(request: DeepPartial<RmReq>, options?: CallOptions & CallOptionsExt): Promise<Rm>;
    mkdir(request: DeepPartial<MkdirReq>, options?: CallOptions & CallOptionsExt): Promise<Mkdir>;
    download(request: DeepPartial<DownloadReq>, options?: CallOptions & CallOptionsExt): Promise<Download>;
    upload(request: DeepPartial<UploadReq>, options?: CallOptions & CallOptionsExt): Promise<Upload>;
    grep(request: DeepPartial<GrepReq>, options?: CallOptions & CallOptionsExt): Promise<Grep>;
    chmod(request: DeepPartial<ChmodReq>, options?: CallOptions & CallOptionsExt): Promise<Chmod>;
    chown(request: DeepPartial<ChownReq>, options?: CallOptions & CallOptionsExt): Promise<Chown>;
    chtimes(request: DeepPartial<ChtimesReq>, options?: CallOptions & CallOptionsExt): Promise<Chtimes>;
    memfilesList(request: DeepPartial<MemfilesListReq>, options?: CallOptions & CallOptionsExt): Promise<Ls>;
    memfilesAdd(request: DeepPartial<MemfilesAddReq>, options?: CallOptions & CallOptionsExt): Promise<MemfilesAdd>;
    memfilesRm(request: DeepPartial<MemfilesRmReq>, options?: CallOptions & CallOptionsExt): Promise<MemfilesRm>;
    mount(request: DeepPartial<MountReq>, options?: CallOptions & CallOptionsExt): Promise<Mount>;
    processDump(request: DeepPartial<ProcessDumpReq>, options?: CallOptions & CallOptionsExt): Promise<ProcessDump>;
    runAs(request: DeepPartial<RunAsReq>, options?: CallOptions & CallOptionsExt): Promise<RunAs>;
    impersonate(request: DeepPartial<ImpersonateReq>, options?: CallOptions & CallOptionsExt): Promise<Impersonate>;
    revToSelf(request: DeepPartial<RevToSelfReq>, options?: CallOptions & CallOptionsExt): Promise<RevToSelf>;
    getSystem(request: DeepPartial<GetSystemReq>, options?: CallOptions & CallOptionsExt): Promise<GetSystem>;
    task(request: DeepPartial<TaskReq>, options?: CallOptions & CallOptionsExt): Promise<Task>;
    msf(request: DeepPartial<MSFReq>, options?: CallOptions & CallOptionsExt): Promise<Task>;
    msfRemote(request: DeepPartial<MSFRemoteReq>, options?: CallOptions & CallOptionsExt): Promise<Task>;
    executeAssembly(request: DeepPartial<ExecuteAssemblyReq>, options?: CallOptions & CallOptionsExt): Promise<ExecuteAssembly>;
    migrate(request: DeepPartial<MigrateReq>, options?: CallOptions & CallOptionsExt): Promise<Migrate>;
    execute(request: DeepPartial<ExecuteReq>, options?: CallOptions & CallOptionsExt): Promise<Execute>;
    executeWindows(request: DeepPartial<ExecuteWindowsReq>, options?: CallOptions & CallOptionsExt): Promise<Execute>;
    executeChildren(request: DeepPartial<ExecuteChildrenReq>, options?: CallOptions & CallOptionsExt): Promise<ExecuteChildren>;
    sideload(request: DeepPartial<SideloadReq>, options?: CallOptions & CallOptionsExt): Promise<Sideload>;
    spawnDll(request: DeepPartial<InvokeSpawnDllReq>, options?: CallOptions & CallOptionsExt): Promise<SpawnDll>;
    screenshot(request: DeepPartial<ScreenshotReq>, options?: CallOptions & CallOptionsExt): Promise<Screenshot>;
    currentTokenOwner(request: DeepPartial<CurrentTokenOwnerReq>, options?: CallOptions & CallOptionsExt): Promise<CurrentTokenOwner>;
    services(request: DeepPartial<ServicesReq>, options?: CallOptions & CallOptionsExt): Promise<Services>;
    serviceDetail(request: DeepPartial<ServiceDetailReq>, options?: CallOptions & CallOptionsExt): Promise<ServiceDetail>;
    startServiceByName(request: DeepPartial<StartServiceByNameReq>, options?: CallOptions & CallOptionsExt): Promise<ServiceInfo>;
    /** ** Pivots *** */
    pivotStartListener(request: DeepPartial<PivotStartListenerReq>, options?: CallOptions & CallOptionsExt): Promise<PivotListener>;
    pivotStopListener(request: DeepPartial<PivotStopListenerReq>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    pivotSessionListeners(request: DeepPartial<PivotListenersReq>, options?: CallOptions & CallOptionsExt): Promise<PivotListeners>;
    pivotGraph(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): Promise<PivotGraph>;
    startService(request: DeepPartial<StartServiceReq>, options?: CallOptions & CallOptionsExt): Promise<ServiceInfo>;
    stopService(request: DeepPartial<StopServiceReq>, options?: CallOptions & CallOptionsExt): Promise<ServiceInfo>;
    removeService(request: DeepPartial<RemoveServiceReq>, options?: CallOptions & CallOptionsExt): Promise<ServiceInfo>;
    makeToken(request: DeepPartial<MakeTokenReq>, options?: CallOptions & CallOptionsExt): Promise<MakeToken>;
    getEnv(request: DeepPartial<EnvReq>, options?: CallOptions & CallOptionsExt): Promise<EnvInfo>;
    setEnv(request: DeepPartial<SetEnvReq>, options?: CallOptions & CallOptionsExt): Promise<SetEnv>;
    unsetEnv(request: DeepPartial<UnsetEnvReq>, options?: CallOptions & CallOptionsExt): Promise<UnsetEnv>;
    backdoor(request: DeepPartial<BackdoorReq>, options?: CallOptions & CallOptionsExt): Promise<Backdoor>;
    registryRead(request: DeepPartial<RegistryReadReq>, options?: CallOptions & CallOptionsExt): Promise<RegistryRead>;
    registryWrite(request: DeepPartial<RegistryWriteReq>, options?: CallOptions & CallOptionsExt): Promise<RegistryWrite>;
    registryCreateKey(request: DeepPartial<RegistryCreateKeyReq>, options?: CallOptions & CallOptionsExt): Promise<RegistryCreateKey>;
    registryDeleteKey(request: DeepPartial<RegistryDeleteKeyReq>, options?: CallOptions & CallOptionsExt): Promise<RegistryDeleteKey>;
    registryListSubKeys(request: DeepPartial<RegistrySubKeyListReq>, options?: CallOptions & CallOptionsExt): Promise<RegistrySubKeyList>;
    registryListValues(request: DeepPartial<RegistryListValuesReq>, options?: CallOptions & CallOptionsExt): Promise<RegistryValuesList>;
    registryReadHive(request: DeepPartial<RegistryReadHiveReq>, options?: CallOptions & CallOptionsExt): Promise<RegistryReadHive>;
    runSSHCommand(request: DeepPartial<SSHCommandReq>, options?: CallOptions & CallOptionsExt): Promise<SSHCommand>;
    hijackDLL(request: DeepPartial<DllHijackReq>, options?: CallOptions & CallOptionsExt): Promise<DllHijack>;
    getPrivs(request: DeepPartial<GetPrivsReq>, options?: CallOptions & CallOptionsExt): Promise<GetPrivs>;
    startRportFwdListener(request: DeepPartial<RportFwdStartListenerReq>, options?: CallOptions & CallOptionsExt): Promise<RportFwdListener>;
    getRportFwdListeners(request: DeepPartial<RportFwdListenersReq>, options?: CallOptions & CallOptionsExt): Promise<RportFwdListeners>;
    stopRportFwdListener(request: DeepPartial<RportFwdStopListenerReq>, options?: CallOptions & CallOptionsExt): Promise<RportFwdListener>;
    /** ** Beacon *** -only commands */
    openSession(request: DeepPartial<OpenSession>, options?: CallOptions & CallOptionsExt): Promise<OpenSession>;
    closeSession(request: DeepPartial<CloseSession>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    /** ** Extensions *** */
    registerExtension(request: DeepPartial<RegisterExtensionReq>, options?: CallOptions & CallOptionsExt): Promise<RegisterExtension>;
    callExtension(request: DeepPartial<CallExtensionReq>, options?: CallOptions & CallOptionsExt): Promise<CallExtension>;
    listExtensions(request: DeepPartial<ListExtensionsReq>, options?: CallOptions & CallOptionsExt): Promise<ListExtensions>;
    /** ** Wasm Extensions *** */
    registerWasmExtension(request: DeepPartial<RegisterWasmExtensionReq>, options?: CallOptions & CallOptionsExt): Promise<RegisterWasmExtension>;
    listWasmExtensions(request: DeepPartial<ListWasmExtensionsReq>, options?: CallOptions & CallOptionsExt): Promise<ListWasmExtensions>;
    execWasmExtension(request: DeepPartial<ExecWasmExtensionReq>, options?: CallOptions & CallOptionsExt): Promise<ExecWasmExtension>;
    /** ** Wireguard Specific *** */
    wGStartPortForward(request: DeepPartial<WGPortForwardStartReq>, options?: CallOptions & CallOptionsExt): Promise<WGPortForward>;
    wGStopPortForward(request: DeepPartial<WGPortForwardStopReq>, options?: CallOptions & CallOptionsExt): Promise<WGPortForward>;
    wGStartSocks(request: DeepPartial<WGSocksStartReq>, options?: CallOptions & CallOptionsExt): Promise<WGSocks>;
    wGStopSocks(request: DeepPartial<WGSocksStopReq>, options?: CallOptions & CallOptionsExt): Promise<WGSocks>;
    wGListForwarders(request: DeepPartial<WGTCPForwardersReq>, options?: CallOptions & CallOptionsExt): Promise<WGTCPForwarders>;
    wGListSocksServers(request: DeepPartial<WGSocksServersReq>, options?: CallOptions & CallOptionsExt): Promise<WGSocksServers>;
    /** ** Realtime Commands *** */
    shell(request: DeepPartial<ShellReq>, options?: CallOptions & CallOptionsExt): Promise<Shell>;
    shellResize(request: DeepPartial<ShellResizeReq>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    portfwd(request: DeepPartial<PortfwdReq>, options?: CallOptions & CallOptionsExt): Promise<Portfwd>;
    /** ** Socks5 *** */
    createSocks(request: DeepPartial<Socks>, options?: CallOptions & CallOptionsExt): Promise<Socks>;
    closeSocks(request: DeepPartial<Socks>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    socksProxy(request: AsyncIterable<DeepPartial<SocksData>>, options?: CallOptions & CallOptionsExt): AsyncIterable<SocksData>;
    /** ** Tunnels *** */
    createTunnel(request: DeepPartial<Tunnel>, options?: CallOptions & CallOptionsExt): Promise<Tunnel>;
    closeTunnel(request: DeepPartial<Tunnel>, options?: CallOptions & CallOptionsExt): Promise<Empty>;
    tunnelData(request: AsyncIterable<DeepPartial<TunnelData>>, options?: CallOptions & CallOptionsExt): AsyncIterable<TunnelData>;
    /** ** Events *** */
    events(request: DeepPartial<Empty>, options?: CallOptions & CallOptionsExt): AsyncIterable<Event>;
}
type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
export type ServerStreamingMethodResult<Response> = {
    [Symbol.asyncIterator](): AsyncIterator<Response, void>;
};
export {};
