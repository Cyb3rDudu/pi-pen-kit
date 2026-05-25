import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { File, Request, Response } from "../commonpb/common";
export declare const protobufPackage = "clientpb";
export declare enum OutputFormat {
    SHARED_LIB = 0,
    SHELLCODE = 1,
    EXECUTABLE = 2,
    SERVICE = 3,
    THIRD_PARTY = 4,
    UNRECOGNIZED = -1
}
export declare function outputFormatFromJSON(object: any): OutputFormat;
export declare function outputFormatToJSON(object: OutputFormat): string;
export declare enum StageProtocol {
    TCP = 0,
    HTTP = 1,
    HTTPS = 2,
    UNRECOGNIZED = -1
}
export declare function stageProtocolFromJSON(object: any): StageProtocol;
export declare function stageProtocolToJSON(object: StageProtocol): string;
/** [ Loot ] ---------------------------------------- */
export declare enum FileType {
    NO_FILE = 0,
    BINARY = 1,
    TEXT = 2,
    UNRECOGNIZED = -1
}
export declare function fileTypeFromJSON(object: any): FileType;
export declare function fileTypeToJSON(object: FileType): string;
/** [ Shellcode ] ---------------------------------------- */
export declare enum ShellcodeEncoder {
    NONE = 0,
    SHIKATA_GA_NAI = 1,
    XOR = 2,
    XOR_DYNAMIC = 3,
    UNRECOGNIZED = -1
}
export declare function shellcodeEncoderFromJSON(object: any): ShellcodeEncoder;
export declare function shellcodeEncoderToJSON(object: ShellcodeEncoder): string;
export declare enum HTTPC2SegmentType {
    POLL = 0,
    SESSION = 1,
    CLOSE = 2,
    UNRECOGNIZED = -1
}
export declare function hTTPC2SegmentTypeFromJSON(object: any): HTTPC2SegmentType;
export declare function hTTPC2SegmentTypeToJSON(object: HTTPC2SegmentType): string;
export declare enum HashType {
    /** MD5 - MD5 - zero must come first in an enum */
    MD5 = 0,
    /** MD4 - MD4 */
    MD4 = 900,
    /** SHA1 - MD5 */
    SHA1 = 100,
    /** SHA2_224 - SHA2-224 */
    SHA2_224 = 1300,
    /** SHA2_256 - SHA2-256 */
    SHA2_256 = 1400,
    /** SHA2_384 - SHA2-384 */
    SHA2_384 = 10800,
    /** SHA2_512 - SHA2-512 */
    SHA2_512 = 1700,
    /** SHA3_224 - SHA3-224 */
    SHA3_224 = 17300,
    /** SHA3_256 - SHA3-256 */
    SHA3_256 = 17400,
    /** SHA3_384 - SHA3-384 */
    SHA3_384 = 17500,
    /** SHA3_512 - SHA3-512 */
    SHA3_512 = 17600,
    /** RIPEMD_160 - RIPEMD-160 */
    RIPEMD_160 = 6000,
    /** BLAKE2B_256 - BLAKE2b-512 */
    BLAKE2B_256 = 600,
    /** GOST_R_32_11_2012_256 - GOST R 34.11-2012 (Streebog) 256-bit, big-endian */
    GOST_R_32_11_2012_256 = 11700,
    /** GOST_R_32_11_2012_512 - GOST R 34.11-2012 (Streebog) 512-bit, big-endian */
    GOST_R_32_11_2012_512 = 11800,
    /** GOST_R_34_11_94 - GOST R 34.11-94 */
    GOST_R_34_11_94 = 6900,
    /** GPG - GPG (AES-128/AES-256 (SHA-1($pass))) */
    GPG = 17010,
    /** HALF_MD5 - Half MD5 */
    HALF_MD5 = 5100,
    /** KECCAK_224 - Keccak-224 */
    KECCAK_224 = 17700,
    /** KECCAK_256 - Keccak-256 */
    KECCAK_256 = 17800,
    /** KECCAK_384 - Keccak-384 */
    KECCAK_384 = 17900,
    /** KECCAK_512 - Keccak-512 */
    KECCAK_512 = 18000,
    /** WHIRLPOOL - Whirlpool */
    WHIRLPOOL = 6100,
    /** SIPHASH - SipHash */
    SIPHASH = 10100,
    /** MD5_UTF16LE - md5(utf16le($pass)) */
    MD5_UTF16LE = 70,
    /** SHA1_UTF16LE - sha1(utf16le($pass)) */
    SHA1_UTF16LE = 170,
    /** SHA256_UTF16LE - sha256(utf16le($pass)) */
    SHA256_UTF16LE = 1470,
    /** SHA384_UTF16LE - sha384(utf16le($pass)) */
    SHA384_UTF16LE = 10870,
    /** SHA512_UTF16LE - sha512(utf16le($pass)) */
    SHA512_UTF16LE = 1770,
    /** BLAKE2B_512_PW_SALT - BLAKE2b-512($pass.$salt) */
    BLAKE2B_512_PW_SALT = 610,
    /** BLAKE2B_512_SALT_PW - BLAKE2b-512($salt.$pass) */
    BLAKE2B_512_SALT_PW = 620,
    /** MD5_PW_SALT - md5($pass.$salt) */
    MD5_PW_SALT = 10,
    /** MD5_SALT_PW - md5($salt.$pass) */
    MD5_SALT_PW = 20,
    /** MD5_SALT_PW_SALT - md5($salt.$pass.$salt) */
    MD5_SALT_PW_SALT = 3800,
    /** MD5_SALT_MD5_PW - md5($salt.md5($pass)) */
    MD5_SALT_MD5_PW = 3710,
    /** CRC32 - CRC32 */
    CRC32 = 11500,
    /** CRC32C - CRC32B */
    CRC32C = 27900,
    /** CRC64Jones - CRC64-Jones */
    CRC64Jones = 28000,
    JAVA_OBJECT = 18700,
    /** MURMUR - MurmurHash */
    MURMUR = 25700,
    /** MURMUR3 - MurmurHash3 */
    MURMUR3 = 27800,
    /** THREE_DES - 3DES (PT = $salt, key = $pass) */
    THREE_DES = 14100,
    /** DES - DES (PT = $salt, key = $pass) */
    DES = 14000,
    /** AES_128_ECB - AES-128-ECB NOKDF (PT = $salt, key = $pass) */
    AES_128_ECB = 26401,
    /** AES_192_ECB - AES-192-ECB NOKDF (PT = $salt, key = $pass) */
    AES_192_ECB = 26402,
    /** AES_256_ECB - AES-256-ECB NOKDF (PT = $salt, key = $pass) */
    AES_256_ECB = 26403,
    /** CHA_CHA_20 - ChaCha20 */
    CHA_CHA_20 = 15400,
    /** LINUX_KERNEL_CRYPTO_API_24 - Linux Kernel Crypto API (2.4) */
    LINUX_KERNEL_CRYPTO_API_24 = 14500,
    /** SKIP_32 - Skip32 (PT = $salt, key = $pass) */
    SKIP_32 = 14900,
    /** PBKDF2_HMAC_MD5 - PBKDF2-HMAC-MD5 */
    PBKDF2_HMAC_MD5 = 11900,
    /** PBKDF2_HMAC_SHA1 - PBKDF2-HMAC-SHA1 */
    PBKDF2_HMAC_SHA1 = 12000,
    /** PBKDF2_HMAC_SHA256 - PBKDF2-HMAC-SHA256 */
    PBKDF2_HMAC_SHA256 = 10900,
    /** PBKDF2_HMAC_SHA512 - PBKDF2-HMAC-SHA512 */
    PBKDF2_HMAC_SHA512 = 12100,
    /** SCRYPT - scrypt */
    SCRYPT = 8900,
    /** PHPASS - phpass */
    PHPASS = 400,
    /** TACACS_PLUS - TACACS+ */
    TACACS_PLUS = 16100,
    /** SIP_DIGEST - SIP digest authentication (MD5) */
    SIP_DIGEST = 11400,
    /** IKE_MD5 - IKE-PSK MD5 */
    IKE_MD5 = 5300,
    /** IKE_SHA1 - IKE-PSK SHA1 */
    IKE_SHA1 = 5400,
    /** SNMP_V3_HMAC_MD5_96 - SNMPv3 HMAC-MD5-96 */
    SNMP_V3_HMAC_MD5_96 = 25100,
    /** SNMP_V3_HMAC_MD5_96__SHA1_96 - SNMPv3 HMAC-MD5-96 / HMAC-SHA1-96 */
    SNMP_V3_HMAC_MD5_96__SHA1_96 = 25000,
    /** SNMP_V3_HMAC_SHA1_96 - SNMPv3 HMAC-SHA1-96 */
    SNMP_V3_HMAC_SHA1_96 = 25200,
    /** SNMP_V3_HMAC_SHA224_128 - SNMPv3 HMAC-SHA224-128 */
    SNMP_V3_HMAC_SHA224_128 = 26700,
    /** SNMP_V3_HMAC_SHA256_192 - SNMPv3 HMAC-SHA256-192 */
    SNMP_V3_HMAC_SHA256_192 = 26800,
    /** SNMP_V3_HMAC_SHA384_256 - SNMPv3 HMAC-SHA384-256 */
    SNMP_V3_HMAC_SHA384_256 = 26900,
    /** SNMP_V3_HMAC_SHA512_384 - SNMPv3 HMAC-SHA512-384 */
    SNMP_V3_HMAC_SHA512_384 = 27300,
    /** WPA_EAPOL_PBKDF2 - WPA-EAPOL-PBKDF2 */
    WPA_EAPOL_PBKDF2 = 2500,
    /** WPA_EAPOL_PMK - WPA-EAPOL-PMK */
    WPA_EAPOL_PMK = 2501,
    /** WPA_PBKDF2_PMKID_EAPOL - WPA-PBKDF2-PMKID+EAPOL */
    WPA_PBKDF2_PMKID_EAPOL = 22000,
    /** WPA_PMK_PMKID_EAPOL - WPA-PMK-PMKID+EAPOL */
    WPA_PMK_PMKID_EAPOL = 22001,
    /** WPA_PMKID_PBKDF2 - WPA-PMKID-PBKDF2 */
    WPA_PMKID_PBKDF2 = 16800,
    /** WPA_PMKID_PMK - WPA-PMKID-PMK */
    WPA_PMKID_PMK = 16801,
    /** IPMI2_PAKP_HMAC_SHA1 - IPMI2 RAKP HMAC-SHA1 */
    IPMI2_PAKP_HMAC_SHA1 = 7300,
    /** CRAM_MD5 - CRAM-MD5 */
    CRAM_MD5 = 10200,
    /** JWT - JWT (JSON Web Token) */
    JWT = 16500,
    /** RADMIN_3 - Radmin3 */
    RADMIN_3 = 29200,
    /** KERBEROS_17_TGS_REP - Kerberos 5, etype 17, TGS-REP */
    KERBEROS_17_TGS_REP = 19600,
    /** KERBEROS_17_PREAUTH - Kerberos 5, etype 17, Pre-Auth */
    KERBEROS_17_PREAUTH = 19800,
    /** KERBEROS_17_DB - Kerberos 5, etype 17, DB */
    KERBEROS_17_DB = 28800,
    /** KERBEROS_18_TGS_REP - Kerberos 5, etype 18, TGS-REP */
    KERBEROS_18_TGS_REP = 19700,
    /** KERBEROS_18_PREAUTH - Kerberos 5, etype 18, Pre-Auth */
    KERBEROS_18_PREAUTH = 19900,
    /** KERBEROS_18_DB - Kerberos 5, etype 18, DB */
    KERBEROS_18_DB = 28900,
    /** KERBEROS_23_SA_REQ_PREAUTH - Kerberos 5, etype 23, AS-REQ Pre-Auth */
    KERBEROS_23_SA_REQ_PREAUTH = 7500,
    /** KERBEROS_23_TGS_REP - Kerberos 5, etype 23, TGS-REP */
    KERBEROS_23_TGS_REP = 13100,
    /** KERBEROS_23_AS_REP - Kerberos 5, etype 23, AS-REP */
    KERBEROS_23_AS_REP = 18200,
    /** NET_NTLM_V1 - NetNTLMv1 / NetNTLMv1+ESS */
    NET_NTLM_V1 = 5500,
    /** NET_NTLM_V1_NT - NetNTLMv1 / NetNTLMv1+ESS (NT) */
    NET_NTLM_V1_NT = 27000,
    /** NET_NTLM_V2 - NetNTLMv2 */
    NET_NTLM_V2 = 5600,
    /** NET_NTLM_V2_NT - NetNTLMv2 (NT) */
    NET_NTLM_V2_NT = 27100,
    /** FLASK - Flask Session Cookie ($salt.$salt.$pass) */
    FLASK = 29100,
    /** ISCSI_CHAP - iSCSI CHAP authentication, MD5(CHAP) */
    ISCSI_CHAP = 4800,
    RACF = 8500,
    AIX_SMD5 = 6300,
    AIX_SSHA1 = 6700,
    AIX_SSHA256 = 6400,
    AIX_SSHA512 = 6500,
    /** LM - LM */
    LM = 3000,
    /** QNX_MD5 - QNX /etc/shadow (MD5) */
    QNX_MD5 = 19000,
    /** QNX_SHA256 - QNX /etc/shadow (SHA256) */
    QNX_SHA256 = 19100,
    /** QNX_SHA512 - QNX /etc/shadow (SHA512) */
    QNX_SHA512 = 19200,
    /** DPAPI_V1_CTX_1_AND_2 - DPAPI masterkey file v1 (context 1 and 2) */
    DPAPI_V1_CTX_1_AND_2 = 15300,
    /** DPAPI_V1_CTX_3 - DPAPI masterkey file v1 (context 3) */
    DPAPI_V1_CTX_3 = 15310,
    /** DPAPI_V2_CTX_1_AND_2 - DPAPI masterkey file v2 (context 1) */
    DPAPI_V2_CTX_1_AND_2 = 15900,
    /** DPAPI_V2_CTX_3 - DPAPI masterkey file v2 (context 3) */
    DPAPI_V2_CTX_3 = 15910,
    /** GRUB_2 - GRUB 2 */
    GRUB_2 = 7200,
    /** MS_AZURE_SYNC - MS-AzureSync PBKDF2-HMAC-SHA256 */
    MS_AZURE_SYNC = 12800,
    /** BSDI_CRYPT - BSDi Crypt, Extended DES */
    BSDI_CRYPT = 12400,
    /** NTLM - NTLM */
    NTLM = 1000,
    /** RADMIN2 - Radmin2 */
    RADMIN2 = 9900,
    /** SAMSUNG_ANDROID - Samsung Android Password/PIN */
    SAMSUNG_ANDROID = 5800,
    /** WINDOWS_HELLO_PIN - Windows Hello PIN/Password */
    WINDOWS_HELLO_PIN = 28100,
    /** WINDOWS_PHONE - Windows Phone 8+ PIN/Password */
    WINDOWS_PHONE = 13800,
    /** CISCO_ASA_MD5 - Cisco-ASA MD5 */
    CISCO_ASA_MD5 = 2410,
    /** CISCO_IOS_PBKDF2_SHA256 - Cisco-IOS $8$ (PBKDF2-SHA256) */
    CISCO_IOS_PBKDF2_SHA256 = 9200,
    /** CISCO_IOS_SCRYPT - Cisco-IOS $9$ (scrypt) */
    CISCO_IOS_SCRYPT = 9300,
    /** CISCO_PIX_MD5 - Cisco-Pix MD5 */
    CISCO_PIX_MD5 = 2400,
    /** CITRIX_NETSCALER_SHA1 - Citrix NetScaler (SHA1) */
    CITRIX_NETSCALER_SHA1 = 8100,
    /** CITRIX_NETSCALER_SHA512 - Citrix NetScaler (SHA512) */
    CITRIX_NETSCALER_SHA512 = 22200,
    /** DCC - Domain Cached Credentials (DCC), MS Cache */
    DCC = 1100,
    /** DCC2 - Domain Cached Credentials 2 (DCC2), MS Cache 2 */
    DCC2 = 2100,
    /** MACOS_10_8 - macOS v10.8+ (PBKDF2-SHA512) */
    MACOS_10_8 = 7100,
    /** INVALID - Invalid hash type */
    INVALID = 9999,
    /** BCRYPT_UNIX - Out of order */
    BCRYPT_UNIX = 3200,
    /** SHA512_CRYPT_UNIX - sha512crypt $6$, SHA512 (Unix) */
    SHA512_CRYPT_UNIX = 1800,
    UNRECOGNIZED = -1
}
export declare function hashTypeFromJSON(object: any): HashType;
export declare function hashTypeToJSON(object: HashType): string;
export declare enum States {
    IDLE = 0,
    CRACKING = 1,
    INITIALIZING = 2,
    UNRECOGNIZED = -1
}
export declare function statesFromJSON(object: any): States;
export declare function statesToJSON(object: States): string;
export declare enum CrackJobStatus {
    IN_PROGRESS = 0,
    COMPLETED = 1,
    FAILED = 2,
    UNRECOGNIZED = -1
}
export declare function crackJobStatusFromJSON(object: any): CrackJobStatus;
export declare function crackJobStatusToJSON(object: CrackJobStatus): string;
export declare enum CrackAttackMode {
    STRAIGHT = 0,
    COMBINATION = 1,
    BRUTEFORCE = 3,
    HYBRID_WORDLIST_MASK = 6,
    HYBRID_MASK_WORDLIST = 7,
    ASSOCIATION = 9,
    NO_ATTACK = 10,
    UNRECOGNIZED = -1
}
export declare function crackAttackModeFromJSON(object: any): CrackAttackMode;
export declare function crackAttackModeToJSON(object: CrackAttackMode): string;
export declare enum CrackEncoding {
    INVALID_ENCODING = 0,
    ISO_8859_15 = 1,
    UTF_32LE = 2,
    UNRECOGNIZED = -1
}
export declare function crackEncodingFromJSON(object: any): CrackEncoding;
export declare function crackEncodingToJSON(object: CrackEncoding): string;
export declare enum CrackOutfileFormat {
    INVALID_FORMAT = 0,
    /** HASH_SALT - 1 | hash[:salt] */
    HASH_SALT = 1,
    /** PLAIN - 2 | plain */
    PLAIN = 2,
    /** HEX_PLAIN - 3 | hex_plain */
    HEX_PLAIN = 3,
    /** CRACK_POS - 4 | crack_pos */
    CRACK_POS = 4,
    /** TIMESTAMP_ABSOLUTE - 5 | timestamp absolute */
    TIMESTAMP_ABSOLUTE = 5,
    /** TIMESTAMP_RELATIVE - 6 | timestamp relative */
    TIMESTAMP_RELATIVE = 6,
    UNRECOGNIZED = -1
}
export declare function crackOutfileFormatFromJSON(object: any): CrackOutfileFormat;
export declare function crackOutfileFormatToJSON(object: CrackOutfileFormat): string;
export declare enum CrackWorkloadProfile {
    INVALID_WORKLOAD_PROFILE = 0,
    LOW = 1,
    DEFAULT = 2,
    HIGH = 3,
    NIGHTMARE = 4,
    UNRECOGNIZED = -1
}
export declare function crackWorkloadProfileFromJSON(object: any): CrackWorkloadProfile;
export declare function crackWorkloadProfileToJSON(object: CrackWorkloadProfile): string;
export declare enum CrackFileType {
    INVALID_TYPE = 0,
    WORDLIST = 1,
    RULES = 2,
    MARKOV_HCSTAT2 = 3,
    UNRECOGNIZED = -1
}
export declare function crackFileTypeFromJSON(object: any): CrackFileType;
export declare function crackFileTypeToJSON(object: CrackFileType): string;
export interface Version {
    Major: number;
    Minor: number;
    Patch: number;
    Commit: string;
    Dirty: boolean;
    CompiledAt: string;
    OS: string;
    Arch: string;
}
/** [ Client Logs ] ---------------------------------------- */
export interface ClientLogData {
    Stream: string;
    Data: Buffer;
}
export interface Session {
    ID: string;
    Name: string;
    Hostname: string;
    UUID: string;
    Username: string;
    UID: string;
    GID: string;
    OS: string;
    Arch: string;
    Transport: string;
    RemoteAddress: string;
    PID: number;
    /** Argv[0] */
    Filename: string;
    LastCheckin: string;
    ActiveC2: string;
    Version: string;
    Evasion: boolean;
    IsDead: boolean;
    ReconnectInterval: string;
    ProxyURL: string;
    Burned: boolean;
    Extensions: string[];
    /** string ConfigID = 24; */
    PeerID: string;
    Locale: string;
    FirstContact: string;
    Integrity: string;
}
export interface Beacon {
    ID: string;
    Name: string;
    Hostname: string;
    UUID: string;
    Username: string;
    UID: string;
    GID: string;
    OS: string;
    Arch: string;
    Transport: string;
    RemoteAddress: string;
    PID: number;
    /** Argv[0] */
    Filename: string;
    LastCheckin: string;
    ActiveC2: string;
    Version: string;
    Evasion: boolean;
    IsDead: boolean;
    ProxyURL: string;
    ReconnectInterval: string;
    Interval: string;
    Jitter: string;
    Burned: boolean;
    NextCheckin: string;
    TasksCount: string;
    TasksCountCompleted: string;
    Locale: string;
    FirstContact: string;
    Integrity: string;
}
export interface Beacons {
    Beacons: Beacon[];
}
export interface BeaconTask {
    ID: string;
    BeaconID: string;
    CreatedAt: string;
    State: string;
    SentAt: string;
    CompletedAt: string;
    Request: Buffer;
    Response: Buffer;
    Description: string;
}
export interface BeaconTasks {
    BeaconID: string;
    Tasks: BeaconTask[];
}
export interface BeaconIntegrity {
    BeaconID: string;
    Integrity: string;
}
export interface ImplantC2 {
    ID: string;
    Priority: number;
    URL: string;
    /** Protocol specific options */
    Options: string;
}
/**
 * ShellcodeConfig - options used when generating shellcode output.
 *
 * Note: Most fields map to Donut options for Windows shellcode generation.
 * On macOS (darwin/arm64), only `Compress` is currently used (beignet aPLib).
 */
export interface ShellcodeConfig {
    /** 1=none, 2=random names, 3=random names + symmetric encryption (Windows/Donut only) */
    Entropy: number;
    /** 1=none, 2=aplib (Windows/Donut + macOS/beignet) */
    Compress: number;
    /** 1=exit thread, 2=exit process, 3=block (Windows/Donut only) */
    ExitOpt: number;
    /** 1=none, 2=abort on failure, 3=continue on failure (Windows/Donut only) */
    Bypass: number;
    /** 1=overwrite headers, 2=keep headers (Windows/Donut only) */
    Headers: number;
    /** Run unmanaged EXE entrypoint as a new thread (Windows/Donut only) */
    Thread: boolean;
    /** Convert command line to Unicode for unmanaged DLL entrypoints (Windows/Donut only) */
    Unicode: boolean;
    /** Override original entry point (0 = default) (Windows/Donut only) */
    OEP: number;
}
export interface ImplantConfig {
    ID: string;
    ImplantBuilds: ImplantBuild[];
    ImplantProfileID: string;
    IsBeacon: boolean;
    BeaconInterval: string;
    BeaconJitter: string;
    GOOS: string;
    GOARCH: string;
    Debug: boolean;
    Evasion: boolean;
    ObfuscateSymbols: boolean;
    TemplateName: string;
    SGNEnabled: boolean;
    GoPackage: string;
    IncludeMTLS: boolean;
    IncludeHTTP: boolean;
    IncludeWG: boolean;
    IncludeDNS: boolean;
    IncludeNamePipe: boolean;
    IncludeTCP: boolean;
    WGPeerTunIP: string;
    WGKeyExchangePort: number;
    WGTcpCommsPort: number;
    ReconnectInterval: string;
    MaxConnectionErrors: number;
    PollTimeout: string;
    /** c2 */
    C2: ImplantC2[];
    CanaryDomains: string[];
    ConnectionStrategy: string;
    LimitDomainJoined: boolean;
    LimitDatetime: string;
    LimitHostname: string;
    LimitUsername: string;
    LimitFileExists: string;
    LimitLocale: string;
    Format: OutputFormat;
    IsSharedLib: boolean;
    IsService: boolean;
    IsShellcode: boolean;
    RunAtLoad: boolean;
    DebugFile: string;
    exports: string[];
    ShellcodeConfig?: ShellcodeConfig | undefined;
    ShellcodeEncoder: ShellcodeEncoder;
    HTTPC2ConfigName: string;
    NetGoEnabled: boolean;
    TrafficEncodersEnabled: boolean;
    TrafficEncoders: string[];
    Extension: string;
    Assets: File[];
}
export interface SpoofMetadataFile {
    Name: string;
    Data: Buffer;
}
export interface imageResourceDirectory {
    Characteristics: number;
    TimeDateStamp: number;
    /** uint16 in PE headers; encoded as uint32 for protobuf transport. */
    MajorVersion: number;
    /** uint16 in PE headers; encoded as uint32 for protobuf transport. */
    MinorVersion: number;
    /** uint16 in PE headers; encoded as uint32 for protobuf transport. */
    NumberOfNamedEntries: number;
    /** uint16 in PE headers; encoded as uint32 for protobuf transport. */
    NumberOfIdEntries: number;
}
export interface imageResourceDirectoryEntry {
    Name: number;
    OffsetToData: number;
}
export interface imageResourceDataEntry {
    OffsetToData: number;
    Size: number;
    CodePage: number;
    Reserved: number;
}
export interface imageExportDirectory {
    Characteristics: number;
    TimeDateStamp: number;
    /** uint16 in PE headers; encoded as uint32 for protobuf transport. */
    MajorVersion: number;
    /** uint16 in PE headers; encoded as uint32 for protobuf transport. */
    MinorVersion: number;
    Name: number;
    Base: number;
    NumberOfFunctions: number;
    NumberOfNames: number;
    AddressOfFunctions: number;
    AddressOfNames: number;
    AddressOfNameOrdinals: number;
}
export interface PESpoofMetadataConfig {
    /** Reference PE used to clone metadata/resources/timestamps. */
    Source?: SpoofMetadataFile | undefined;
    /** Reserved for future standalone icon mutation support. */
    Icon?: SpoofMetadataFile | undefined;
    ResourceDirectory?: imageResourceDirectory | undefined;
    ResourceDirectoryEntries: imageResourceDirectoryEntry[];
    ResourceDataEntries: imageResourceDataEntry[];
    ExportDirectory?: imageExportDirectory | undefined;
}
export interface SpoofMetadataConfig {
    /**
     * Keep executable formats separated so additional formats can be added later
     * without changing request semantics.
     */
    PE?: PESpoofMetadataConfig | undefined;
}
export interface TrafficEncoder {
    ID: string;
    Wasm?: File | undefined;
    SkipTests: boolean;
    TestID: string;
}
export interface TrafficEncoderMap {
    /** File Name -> TrafficEncoder */
    Encoders: {
        [key: string]: TrafficEncoder;
    };
}
export interface TrafficEncoderMap_EncodersEntry {
    key: string;
    value?: TrafficEncoder | undefined;
}
export interface TrafficEncoderTest {
    Name: string;
    Completed: boolean;
    Success: boolean;
    Duration: string;
    Err: string;
    /** Only used on failed tests */
    Sample: Buffer;
}
export interface TrafficEncoderTests {
    Encoder?: TrafficEncoder | undefined;
    Tests: TrafficEncoderTest[];
    TotalDuration: string;
    TotalTests: number;
}
export interface ExternalImplantConfig {
    Config?: ImplantConfig | undefined;
    Build?: ImplantBuild | undefined;
    HTTPC2?: HTTPC2Config | undefined;
    encoders: {
        [key: string]: string;
    };
}
export interface ExternalImplantConfig_EncodersEntry {
    key: string;
    value: string;
}
export interface ExternalImplantBinary {
    Name: string;
    ImplantBuildID: string;
    File?: File | undefined;
}
/** Configs of previously built implants */
export interface ImplantBuilds {
    Configs: {
        [key: string]: ImplantConfig;
    };
    ResourceIDs: {
        [key: string]: ResourceID;
    };
    staged: {
        [key: string]: boolean;
    };
}
export interface ImplantBuilds_ConfigsEntry {
    key: string;
    value?: ImplantConfig | undefined;
}
export interface ImplantBuilds_ResourceIDsEntry {
    key: string;
    value?: ResourceID | undefined;
}
export interface ImplantBuilds_StagedEntry {
    key: string;
    value: boolean;
}
export interface ImplantStageReq {
    Build: string[];
}
export interface ImplantBuild {
    ID: string;
    Name: string;
    MD5: string;
    SHA1: string;
    SHA256: string;
    Burned: boolean;
    ImplantID: string;
    ImplantConfigID: string;
    AgeServerPublicKey: string;
    PeerPublicKey: string;
    PeerPrivateKey: string;
    PeerPublicKeySignature: string;
    MinisignServerPublicKey: string;
    PeerPublicKeyDigest: string;
    WGImplantPrivKey: string;
    WGServerPubKey: string;
    MtlsCACert: string;
    MtlsCert: string;
    MtlsKey: string;
    Stage: boolean;
}
export interface CompilerTarget {
    /** The server's OS */
    GOOS: string;
    /** The server's Arch */
    GOARCH: string;
    Format: OutputFormat;
}
export interface CrossCompiler {
    /** The server's OS */
    TargetGOOS: string;
    /** The server's Arch */
    TargetGOARCH: string;
    CCPath: string;
    CXXPath: string;
}
export interface Compiler {
    /** The server's OS */
    GOOS: string;
    /** The server's Arch */
    GOARCH: string;
    Targets: CompilerTarget[];
    CrossCompilers: CrossCompiler[];
    UnsupportedTargets: CompilerTarget[];
}
export interface DeleteReq {
    Name: string;
}
/** DNSCanary - Single canary and metadata */
export interface DNSCanary {
    ID: string;
    ImplantName: string;
    Domain: string;
    Triggered: boolean;
    FirstTriggered: string;
    LatestTrigger: string;
    Count: number;
}
export interface Canaries {
    Canaries: DNSCanary[];
}
/** UniqueWGIP - Unique wireguard IP */
export interface UniqueWGIP {
    IP: string;
}
export interface ImplantProfile {
    ID: string;
    Name: string;
    Config?: ImplantConfig | undefined;
}
export interface ImplantProfiles {
    Profiles: ImplantProfile[];
}
export interface RegenerateReq {
    ImplantName: string;
}
export interface Job {
    ID: number;
    Name: string;
    Description: string;
    Protocol: string;
    Port: number;
    Domains: string[];
    ProfileName: string;
}
export interface Jobs {
    Active: Job[];
}
export interface KillJobReq {
    ID: number;
}
export interface RestartJobReq {
    JobIDs: number[];
}
export interface KillJob {
    ID: number;
    Success: boolean;
}
/** [ Listeners ] ---------------------------------------- */
export interface ListenerJob {
    ID: string;
    Type: string;
    JobID: number;
    MTLSConf?: MTLSListenerReq | undefined;
    WGConf?: WGListenerReq | undefined;
    DNSConf?: DNSListenerReq | undefined;
    HTTPConf?: HTTPListenerReq | undefined;
    MultiConf?: MultiplayerListenerReq | undefined;
    TCPConf?: StagerListenerReq | undefined;
}
export interface MultiplayerListenerReq {
    Host: string;
    Port: number;
}
export interface MTLSListenerReq {
    Host: string;
    Port: number;
}
export interface WGListenerReq {
    Host: string;
    Port: number;
    TunIP: string;
    NPort: number;
    KeyPort: number;
}
export interface DNSListenerReq {
    Domains: string[];
    Canaries: boolean;
    Host: string;
    Port: number;
    EnforceOTP: boolean;
}
export interface HTTPListenerReq {
    Domain: string;
    Host: string;
    Port: number;
    /** Enable HTTPS */
    Secure: boolean;
    Website: string;
    Cert: Buffer;
    Key: Buffer;
    ACME: boolean;
    EnforceOTP: boolean;
    LongPollTimeout: string;
    LongPollJitter: string;
    /** Only valid with Secure = true */
    RandomizeJARM: boolean;
}
/** Named Pipes Messages for pivoting */
export interface NamedPipesReq {
    PipeName: string;
    Request?: Request | undefined;
}
export interface NamedPipes {
    Success: boolean;
    Err: string;
    Response?: Response | undefined;
}
/** TCP Messages for pivoting */
export interface TCPPivotReq {
    Address: string;
    Request?: Request | undefined;
}
export interface TCPPivot {
    Success: boolean;
    Err: string;
    Response?: Response | undefined;
}
/** [ commands ] ---------------------------------------- */
export interface Sessions {
    Sessions: Session[];
}
export interface RenameReq {
    SessionID: string;
    BeaconID: string;
    Name: string;
}
export interface GenerateReq {
    Config?: ImplantConfig | undefined;
    Name: string;
}
export interface GenerateStageReq {
    Profile: string;
    Name: string;
    AESEncryptKey: string;
    AESEncryptIv: string;
    RC4EncryptKey: string;
    PrependSize: boolean;
    CompressF: string;
    Compress: string;
}
export interface Generate {
    File?: File | undefined;
    ImplantName: string;
    ImplantBuildID: string;
}
export interface GenerateSpoofMetadataReq {
    ImplantBuildID: string;
    ImplantName: string;
    ResourceID: string;
    SpoofMetadata?: SpoofMetadataConfig | undefined;
}
export interface MSFReq {
    Payload: string;
    LHost: string;
    LPort: number;
    Encoder: string;
    Iterations: number;
    Request?: Request | undefined;
}
export interface MSFRemoteReq {
    Payload: string;
    LHost: string;
    LPort: number;
    Encoder: string;
    Iterations: number;
    PID: number;
    Request?: Request | undefined;
}
export interface StagerListenerReq {
    Protocol: StageProtocol;
    Host: string;
    Port: number;
    Data: Buffer;
    ProfileName: string;
}
export interface StagerListener {
    JobID: number;
}
export interface ShellcodeRDIReq {
    Data: Buffer;
    FunctionName: string;
    Arguments: string;
}
export interface ShellcodeRDI {
    Data: Buffer;
}
/**
 * GetSystemReq - Client request to the server which is translated into
 *                InvokeSystemReq when sending to the implant.
 */
export interface GetSystemReq {
    HostingProcess: string;
    Config?: ImplantConfig | undefined;
    Name: string;
    Request?: Request | undefined;
}
/**
 * MigrateReq - Client request to the server which is translated into
 *              InvokeMigrateReq when sending to the implant.
 */
export interface MigrateReq {
    Pid: number;
    Config?: ImplantConfig | undefined;
    Encoder: ShellcodeEncoder;
    Name: string;
    ProcName: string;
    Request?: Request | undefined;
}
/** [ Tunnels ] ---------------------------------------- */
export interface CreateTunnelReq {
    Request?: Request | undefined;
}
export interface CreateTunnel {
    SessionID: number;
    TunnelID: string;
}
export interface CloseTunnelReq {
    TunnelID: string;
    Request?: Request | undefined;
}
/** [ Pivots ] ---------------------------------------- */
export interface PivotGraphEntry {
    PeerID: string;
    Session?: Session | undefined;
    Name: string;
    Children: PivotGraphEntry[];
}
export interface PivotGraph {
    Children: PivotGraphEntry[];
}
/** [ Events ] ---------------------------------------- */
export interface Client {
    ID: number;
    Name: string;
    Operator?: Operator | undefined;
}
export interface Event {
    EventType: string;
    Session?: Session | undefined;
    Job?: Job | undefined;
    Client?: Client | undefined;
    Data: Buffer;
    /** Can't trigger normal gRPC error */
    Err: string;
}
export interface Operators {
    Operators: Operator[];
}
export interface Operator {
    Online: boolean;
    Name: string;
}
/** [ Websites ] ---------------------------------------- */
export interface WebContent {
    ID: string;
    WebsiteID: string;
    Path: string;
    ContentType: string;
    Size: string;
    OriginalFile: string;
    Sha256: string;
    Content: Buffer;
}
export interface WebsiteAddContent {
    Name: string;
    Contents: {
        [key: string]: WebContent;
    };
}
export interface WebsiteAddContent_ContentsEntry {
    key: string;
    value?: WebContent | undefined;
}
export interface WebsiteRemoveContent {
    Name: string;
    Paths: string[];
}
export interface Website {
    ID: string;
    Name: string;
    Contents: {
        [key: string]: WebContent;
    };
}
export interface Website_ContentsEntry {
    key: string;
    value?: WebContent | undefined;
}
export interface Websites {
    Websites: Website[];
}
export interface WGClientConfig {
    ServerPubKey: string;
    ClientPrivateKey: string;
    ClientPubKey: string;
    ClientIP: string;
}
export interface Loot {
    ID: string;
    Name: string;
    FileType: FileType;
    OriginHostUUID: string;
    Size: string;
    File?: File | undefined;
}
export interface AllLoot {
    Loot: Loot[];
}
/** [ Hosts ] ---------------------------------------- */
export interface IOC {
    Path: string;
    FileHash: string;
    ID: string;
}
export interface ExtensionData {
    Output: string;
}
export interface Host {
    ID: string;
    Hostname: string;
    HostUUID: string;
    OSVersion: string;
    IOCs: IOC[];
    ExtensionData: {
        [key: string]: ExtensionData;
    };
    Locale: string;
    FirstContact: string;
}
export interface Host_ExtensionDataEntry {
    key: string;
    value?: ExtensionData | undefined;
}
export interface AllHosts {
    Hosts: Host[];
}
/** [ Dll Hijack ] ---------------------------------------- */
export interface DllHijackReq {
    ReferenceDLLPath: string;
    TargetLocation: string;
    ReferenceDLL: Buffer;
    TargetDLL: Buffer;
    ProfileName: string;
    Name: string;
    Request?: Request | undefined;
}
export interface DllHijack {
    Response?: Response | undefined;
}
export interface BackdoorReq {
    FilePath: string;
    ProfileName: string;
    Name: string;
    Request?: Request | undefined;
}
export interface Backdoor {
    Response?: Response | undefined;
}
export interface ShellcodeEncodeReq {
    Encoder: ShellcodeEncoder;
    Architecture: string;
    Iterations: number;
    BadChars: Buffer;
    Data: Buffer;
    Request?: Request | undefined;
}
export interface ShellcodeEncode {
    Data: Buffer;
    Response?: Response | undefined;
}
export interface ShellcodeEncoderArchMap {
    Encoders: {
        [key: string]: ShellcodeEncoder;
    };
    Descriptions: {
        [key: string]: string;
    };
}
export interface ShellcodeEncoderArchMap_EncodersEntry {
    key: string;
    value: ShellcodeEncoder;
}
export interface ShellcodeEncoderArchMap_DescriptionsEntry {
    key: string;
    value: string;
}
export interface ShellcodeEncoderMap {
    Encoders: {
        [key: string]: ShellcodeEncoderArchMap;
    };
}
export interface ShellcodeEncoderMap_EncodersEntry {
    key: string;
    value?: ShellcodeEncoderArchMap | undefined;
}
export interface ExternalGenerateReq {
    Config?: ImplantConfig | undefined;
    BuilderName: string;
    Name: string;
}
export interface Builders {
    Builders: Builder[];
}
export interface Builder {
    Name: string;
    OperatorName: string;
    /** The builder's OS */
    GOOS: string;
    /** The builder's Arch */
    GOARCH: string;
    Templates: string[];
    Targets: CompilerTarget[];
    CrossCompilers: CrossCompiler[];
}
/** [ HTTP C2 ] ---------------------------------------- */
export interface HTTPC2Configs {
    configs: HTTPC2Config[];
}
export interface C2ProfileReq {
    Name: string;
}
export interface HTTPC2ConfigReq {
    overwrite: boolean;
    C2Config?: HTTPC2Config | undefined;
}
export interface HTTPC2Config {
    ID: string;
    Created: string;
    Name: string;
    ServerConfig?: HTTPC2ServerConfig | undefined;
    ImplantConfig?: HTTPC2ImplantConfig | undefined;
}
export interface HTTPC2ServerConfig {
    ID: string;
    RandomVersionHeaders: boolean;
    Headers: HTTPC2Header[];
    Cookies: HTTPC2Cookie[];
}
export interface HTTPC2ImplantConfig {
    ID: string;
    UserAgent: string;
    ChromeBaseVersion: number;
    MacOSVersion: string;
    NonceQueryArgChars: string;
    ExtraURLParameters: HTTPC2URLParameter[];
    Headers: HTTPC2Header[];
    MaxFileGen: number;
    MinFileGen: number;
    MaxPathGen: number;
    MinPathGen: number;
    MaxPathLength: number;
    MinPathLength: number;
    extensions: string[];
    PathSegments: HTTPC2PathSegment[];
    NonceQueryLength: number;
    NonceMode: string;
}
export interface HTTPC2Cookie {
    ID: string;
    Name: string;
}
export interface HTTPC2Header {
    ID: string;
    Method: string;
    Name: string;
    Value: string;
    Probability: number;
}
export interface HTTPC2URLParameter {
    ID: string;
    Method: string;
    Name: string;
    Value: string;
    Probability: number;
}
export interface HTTPC2PathSegment {
    ID: string;
    IsFile: boolean;
    Value: string;
}
export interface Credential {
    ID: string;
    Username: string;
    Plaintext: string;
    Hash: string;
    HashType: HashType;
    IsCracked: boolean;
    OriginHostUUID: string;
    Collection: string;
}
export interface Credentials {
    Credentials: Credential[];
}
/** [ Crackstation ] ---------------------------------------- */
export interface Crackstations {
    Crackstations: Crackstation[];
}
export interface CrackstationStatus {
    Name: string;
    HostUUID: string;
    State: States;
    CurrentCrackJobID: string;
    IsSyncing: boolean;
    Syncing?: CrackSyncStatus | undefined;
}
export interface CrackSyncStatus {
    Speed: number;
    Progress: {
        [key: string]: number;
    };
}
export interface CrackSyncStatus_ProgressEntry {
    key: string;
    value: number;
}
export interface CrackBenchmark {
    Name: string;
    HostUUID: string;
    Benchmarks: {
        [key: number]: string;
    };
}
export interface CrackBenchmark_BenchmarksEntry {
    key: number;
    value: string;
}
export interface CrackTask {
    ID: string;
    /** CrackstationID */
    HostUUID: string;
    CreatedAt: string;
    StartedAt: string;
    CompletedAt: string;
    Err: string;
    Command?: CrackCommand | undefined;
}
export interface Crackstation {
    ID: string;
    Name: string;
    OperatorName: string;
    /** The cracker's OS */
    GOOS: string;
    /** The cracker's Arch */
    GOARCH: string;
    HashcatVersion: string;
    HostUUID: string;
    Version: string;
    Benchmarks: {
        [key: number]: string;
    };
    CUDA: CUDABackendInfo[];
    Metal: MetalBackendInfo[];
    OpenCL: OpenCLBackendInfo[];
}
export interface Crackstation_BenchmarksEntry {
    key: number;
    value: string;
}
export interface CUDABackendInfo {
    Type: string;
    VendorID: number;
    Vendor: string;
    Name: string;
    Version: string;
    Processors: number;
    Clock: number;
    MemoryTotal: string;
    MemoryFree: string;
    CUDAVersion: string;
}
export interface OpenCLBackendInfo {
    Type: string;
    VendorID: number;
    Vendor: string;
    Name: string;
    Version: string;
    Processors: number;
    Clock: number;
    MemoryTotal: string;
    MemoryFree: string;
    OpenCLVersion: string;
    OpenCLDriverVersion: string;
}
export interface MetalBackendInfo {
    Type: string;
    VendorID: number;
    Vendor: string;
    Name: string;
    Version: string;
    Processors: number;
    Clock: number;
    MemoryTotal: string;
    MemoryFree: string;
    MetalVersion: string;
}
export interface CrackCommand {
    AttackMode: CrackAttackMode;
    HashType: HashType;
    Hashes: string[];
    /**
     * --version
     * --help
     */
    Quiet: boolean;
    HexCharset: boolean;
    HexSalt: boolean;
    HexWordlist: boolean;
    Force: boolean;
    DeprecatedCheckDisable: boolean;
    Status: boolean;
    StatusJSON: boolean;
    StatusTimer: number;
    StdinTimeoutAbort: number;
    MachineReadable: boolean;
    KeepGuessing: boolean;
    SelfTestDisable: boolean;
    Loopback: boolean;
    /** --markov-hcstat2 FILE */
    MarkovHcstat2: Buffer;
    MarkovDisable: boolean;
    MarkovClassic: boolean;
    MarkovInverse: boolean;
    MarkovThreshold: number;
    Runtime: number;
    /** [a-zA-Z0-9_-] */
    Session: string;
    Restore: boolean;
    RestoreDisable: boolean;
    /** --restore-file-path FILE */
    RestoreFile: Buffer;
    /** --outfile FILE (28) */
    OutfileFormat: CrackOutfileFormat[];
    OutfileAutohexDisable: boolean;
    OutfileCheckTimer: number;
    WordlistAutohexDisable: boolean;
    /** single char */
    Separator: string;
    Stdout: boolean;
    Show: boolean;
    Left: boolean;
    Username: boolean;
    Remove: boolean;
    RemoveTimer: number;
    PotfileDisable: boolean;
    /** --potfile-path FILE */
    Potfile: Buffer;
    EncodingFrom: CrackEncoding;
    EncodingTo: CrackEncoding;
    DebugMode: number;
    /**
     * --debug-file FILE (45)
     * --induction-dir DIR (46)
     * --outfile-check-dir DIR (47)
     */
    LogfileDisable: boolean;
    HccapxMessagePair: number;
    NonceErrorCorrections: number;
    /** --keyboard-layout-mapping FILE */
    KeyboardLayoutMapping: Buffer;
    /**
     * --truecrypt-keyfiles FILE (52)
     * --veracrypt-keyfiles FILE (53)
     * --veracrypt-pim-start PIM (54)
     * --veracrypt-pim-stop PIM (55)
     */
    Benchmark: boolean;
    BenchmarkAll: boolean;
    SpeedOnly: boolean;
    ProgressOnly: boolean;
    SegmentSize: number;
    BitmapMin: number;
    BitmapMax: number;
    CPUAffinity: number[];
    HookThreads: number;
    HashInfo: boolean;
    /** --example-hashes (66) */
    BackendIgnoreCUDA: boolean;
    BackendIgnoreHip: boolean;
    BackendIgnoreMetal: boolean;
    BackendIgnoreOpenCL: boolean;
    BackendInfo: boolean;
    BackendDevices: number[];
    OpenCLDeviceTypes: number[];
    OptimizedKernelEnable: boolean;
    MultiplyAccelDisabled: boolean;
    WorkloadProfile: CrackWorkloadProfile;
    KernelAccel: number;
    KernelLoops: number;
    KernelThreads: number;
    BackendVectorWidth: number;
    SpinDamp: number;
    HwmonDisable: boolean;
    HwmonTempAbort: number;
    ScryptTMTO: number;
    Skip: string;
    Limit: string;
    Keyspace: boolean;
    /**
     * --rule-left (88)
     * --rule-right (89)
     */
    RulesFile: Buffer;
    GenerateRules: number;
    GenerateRulesFunMin: number;
    GenerateRulesFunMax: number;
    GenerateRulesFuncSel: string;
    GenerateRulesSeed: number;
    CustomCharset1: string;
    CustomCharset2: string;
    CustomCharset3: string;
    CustomCharset4: string;
    Identify: string;
    Increment: boolean;
    IncrementMin: number;
    IncrementMax: number;
    SlowCandidates: boolean;
    BrainServer: boolean;
    BrainServerTimer: number;
    BrainClient: boolean;
    BrainClientFeatures: string;
    BrainHost: string;
    BrainPort: number;
    BrainPassword: string;
    BrainSession: string;
    BrainSessionWhitelist: string;
}
export interface CrackJob {
    ID: string;
    CreatedAt: string;
    CompletedAt: string;
    Status: CrackJobStatus;
    Err: string;
    Command?: CrackCommand | undefined;
    ResultFileID: string;
}
export interface CrackResponse {
    Job?: CrackJob | undefined;
}
export interface CrackConfig {
    AutoFire: boolean;
    MaxFileSize: string;
    ChunkSize: string;
    MaxDiskUsage: string;
}
export interface CrackFiles {
    Files: CrackFile[];
    CurrentDiskUsage: string;
    MaxDiskUsage: string;
}
export interface CrackFile {
    ID: string;
    CreatedAt: string;
    LastModified: string;
    Name: string;
    UncompressedSize: string;
    Sha2256: string;
    Type: CrackFileType;
    IsCompressed: boolean;
    MaxFileSize: string;
    ChunkSize: string;
    Chunks: CrackFileChunk[];
}
export interface CrackFileChunk {
    ID: string;
    CrackFileID: string;
    N: number;
    Data: Buffer;
}
/** watchtower */
export interface MonitoringProviders {
    providers: MonitoringProvider[];
}
export interface MonitoringProvider {
    ID: string;
    Type: string;
    APIKey: string;
    APIPassword: string;
}
/** resource IDs */
export interface ResourceID {
    ID: string;
    Type: string;
    Name: string;
    Value: string;
}
export interface CertificatesReq {
    CategoryFilters: number;
    CN: string;
}
export interface CertificateData {
    CN: string;
    CreationTime: string;
    ValidityStart: string;
    ValidityExpiry: string;
    Type: string;
    KeyAlgorithm: string;
    ID: string;
}
export interface CertificateInfo {
    info: CertificateData[];
}
export interface CertificateAuthorityData {
    CN: string;
    CreationTime: string;
    ValidityStart: string;
    ValidityExpiry: string;
    Type: string;
    KeyAlgorithm: string;
    ID: string;
}
export interface CertificateAuthorityInfo {
    info: CertificateAuthorityData[];
}
export declare const Version: MessageFns<Version>;
export declare const ClientLogData: MessageFns<ClientLogData>;
export declare const Session: MessageFns<Session>;
export declare const Beacon: MessageFns<Beacon>;
export declare const Beacons: MessageFns<Beacons>;
export declare const BeaconTask: MessageFns<BeaconTask>;
export declare const BeaconTasks: MessageFns<BeaconTasks>;
export declare const BeaconIntegrity: MessageFns<BeaconIntegrity>;
export declare const ImplantC2: MessageFns<ImplantC2>;
export declare const ShellcodeConfig: MessageFns<ShellcodeConfig>;
export declare const ImplantConfig: MessageFns<ImplantConfig>;
export declare const SpoofMetadataFile: MessageFns<SpoofMetadataFile>;
export declare const imageResourceDirectory: MessageFns<imageResourceDirectory>;
export declare const imageResourceDirectoryEntry: MessageFns<imageResourceDirectoryEntry>;
export declare const imageResourceDataEntry: MessageFns<imageResourceDataEntry>;
export declare const imageExportDirectory: MessageFns<imageExportDirectory>;
export declare const PESpoofMetadataConfig: MessageFns<PESpoofMetadataConfig>;
export declare const SpoofMetadataConfig: MessageFns<SpoofMetadataConfig>;
export declare const TrafficEncoder: MessageFns<TrafficEncoder>;
export declare const TrafficEncoderMap: MessageFns<TrafficEncoderMap>;
export declare const TrafficEncoderMap_EncodersEntry: MessageFns<TrafficEncoderMap_EncodersEntry>;
export declare const TrafficEncoderTest: MessageFns<TrafficEncoderTest>;
export declare const TrafficEncoderTests: MessageFns<TrafficEncoderTests>;
export declare const ExternalImplantConfig: MessageFns<ExternalImplantConfig>;
export declare const ExternalImplantConfig_EncodersEntry: MessageFns<ExternalImplantConfig_EncodersEntry>;
export declare const ExternalImplantBinary: MessageFns<ExternalImplantBinary>;
export declare const ImplantBuilds: MessageFns<ImplantBuilds>;
export declare const ImplantBuilds_ConfigsEntry: MessageFns<ImplantBuilds_ConfigsEntry>;
export declare const ImplantBuilds_ResourceIDsEntry: MessageFns<ImplantBuilds_ResourceIDsEntry>;
export declare const ImplantBuilds_StagedEntry: MessageFns<ImplantBuilds_StagedEntry>;
export declare const ImplantStageReq: MessageFns<ImplantStageReq>;
export declare const ImplantBuild: MessageFns<ImplantBuild>;
export declare const CompilerTarget: MessageFns<CompilerTarget>;
export declare const CrossCompiler: MessageFns<CrossCompiler>;
export declare const Compiler: MessageFns<Compiler>;
export declare const DeleteReq: MessageFns<DeleteReq>;
export declare const DNSCanary: MessageFns<DNSCanary>;
export declare const Canaries: MessageFns<Canaries>;
export declare const UniqueWGIP: MessageFns<UniqueWGIP>;
export declare const ImplantProfile: MessageFns<ImplantProfile>;
export declare const ImplantProfiles: MessageFns<ImplantProfiles>;
export declare const RegenerateReq: MessageFns<RegenerateReq>;
export declare const Job: MessageFns<Job>;
export declare const Jobs: MessageFns<Jobs>;
export declare const KillJobReq: MessageFns<KillJobReq>;
export declare const RestartJobReq: MessageFns<RestartJobReq>;
export declare const KillJob: MessageFns<KillJob>;
export declare const ListenerJob: MessageFns<ListenerJob>;
export declare const MultiplayerListenerReq: MessageFns<MultiplayerListenerReq>;
export declare const MTLSListenerReq: MessageFns<MTLSListenerReq>;
export declare const WGListenerReq: MessageFns<WGListenerReq>;
export declare const DNSListenerReq: MessageFns<DNSListenerReq>;
export declare const HTTPListenerReq: MessageFns<HTTPListenerReq>;
export declare const NamedPipesReq: MessageFns<NamedPipesReq>;
export declare const NamedPipes: MessageFns<NamedPipes>;
export declare const TCPPivotReq: MessageFns<TCPPivotReq>;
export declare const TCPPivot: MessageFns<TCPPivot>;
export declare const Sessions: MessageFns<Sessions>;
export declare const RenameReq: MessageFns<RenameReq>;
export declare const GenerateReq: MessageFns<GenerateReq>;
export declare const GenerateStageReq: MessageFns<GenerateStageReq>;
export declare const Generate: MessageFns<Generate>;
export declare const GenerateSpoofMetadataReq: MessageFns<GenerateSpoofMetadataReq>;
export declare const MSFReq: MessageFns<MSFReq>;
export declare const MSFRemoteReq: MessageFns<MSFRemoteReq>;
export declare const StagerListenerReq: MessageFns<StagerListenerReq>;
export declare const StagerListener: MessageFns<StagerListener>;
export declare const ShellcodeRDIReq: MessageFns<ShellcodeRDIReq>;
export declare const ShellcodeRDI: MessageFns<ShellcodeRDI>;
export declare const GetSystemReq: MessageFns<GetSystemReq>;
export declare const MigrateReq: MessageFns<MigrateReq>;
export declare const CreateTunnelReq: MessageFns<CreateTunnelReq>;
export declare const CreateTunnel: MessageFns<CreateTunnel>;
export declare const CloseTunnelReq: MessageFns<CloseTunnelReq>;
export declare const PivotGraphEntry: MessageFns<PivotGraphEntry>;
export declare const PivotGraph: MessageFns<PivotGraph>;
export declare const Client: MessageFns<Client>;
export declare const Event: MessageFns<Event>;
export declare const Operators: MessageFns<Operators>;
export declare const Operator: MessageFns<Operator>;
export declare const WebContent: MessageFns<WebContent>;
export declare const WebsiteAddContent: MessageFns<WebsiteAddContent>;
export declare const WebsiteAddContent_ContentsEntry: MessageFns<WebsiteAddContent_ContentsEntry>;
export declare const WebsiteRemoveContent: MessageFns<WebsiteRemoveContent>;
export declare const Website: MessageFns<Website>;
export declare const Website_ContentsEntry: MessageFns<Website_ContentsEntry>;
export declare const Websites: MessageFns<Websites>;
export declare const WGClientConfig: MessageFns<WGClientConfig>;
export declare const Loot: MessageFns<Loot>;
export declare const AllLoot: MessageFns<AllLoot>;
export declare const IOC: MessageFns<IOC>;
export declare const ExtensionData: MessageFns<ExtensionData>;
export declare const Host: MessageFns<Host>;
export declare const Host_ExtensionDataEntry: MessageFns<Host_ExtensionDataEntry>;
export declare const AllHosts: MessageFns<AllHosts>;
export declare const DllHijackReq: MessageFns<DllHijackReq>;
export declare const DllHijack: MessageFns<DllHijack>;
export declare const BackdoorReq: MessageFns<BackdoorReq>;
export declare const Backdoor: MessageFns<Backdoor>;
export declare const ShellcodeEncodeReq: MessageFns<ShellcodeEncodeReq>;
export declare const ShellcodeEncode: MessageFns<ShellcodeEncode>;
export declare const ShellcodeEncoderArchMap: MessageFns<ShellcodeEncoderArchMap>;
export declare const ShellcodeEncoderArchMap_EncodersEntry: MessageFns<ShellcodeEncoderArchMap_EncodersEntry>;
export declare const ShellcodeEncoderArchMap_DescriptionsEntry: MessageFns<ShellcodeEncoderArchMap_DescriptionsEntry>;
export declare const ShellcodeEncoderMap: MessageFns<ShellcodeEncoderMap>;
export declare const ShellcodeEncoderMap_EncodersEntry: MessageFns<ShellcodeEncoderMap_EncodersEntry>;
export declare const ExternalGenerateReq: MessageFns<ExternalGenerateReq>;
export declare const Builders: MessageFns<Builders>;
export declare const Builder: MessageFns<Builder>;
export declare const HTTPC2Configs: MessageFns<HTTPC2Configs>;
export declare const C2ProfileReq: MessageFns<C2ProfileReq>;
export declare const HTTPC2ConfigReq: MessageFns<HTTPC2ConfigReq>;
export declare const HTTPC2Config: MessageFns<HTTPC2Config>;
export declare const HTTPC2ServerConfig: MessageFns<HTTPC2ServerConfig>;
export declare const HTTPC2ImplantConfig: MessageFns<HTTPC2ImplantConfig>;
export declare const HTTPC2Cookie: MessageFns<HTTPC2Cookie>;
export declare const HTTPC2Header: MessageFns<HTTPC2Header>;
export declare const HTTPC2URLParameter: MessageFns<HTTPC2URLParameter>;
export declare const HTTPC2PathSegment: MessageFns<HTTPC2PathSegment>;
export declare const Credential: MessageFns<Credential>;
export declare const Credentials: MessageFns<Credentials>;
export declare const Crackstations: MessageFns<Crackstations>;
export declare const CrackstationStatus: MessageFns<CrackstationStatus>;
export declare const CrackSyncStatus: MessageFns<CrackSyncStatus>;
export declare const CrackSyncStatus_ProgressEntry: MessageFns<CrackSyncStatus_ProgressEntry>;
export declare const CrackBenchmark: MessageFns<CrackBenchmark>;
export declare const CrackBenchmark_BenchmarksEntry: MessageFns<CrackBenchmark_BenchmarksEntry>;
export declare const CrackTask: MessageFns<CrackTask>;
export declare const Crackstation: MessageFns<Crackstation>;
export declare const Crackstation_BenchmarksEntry: MessageFns<Crackstation_BenchmarksEntry>;
export declare const CUDABackendInfo: MessageFns<CUDABackendInfo>;
export declare const OpenCLBackendInfo: MessageFns<OpenCLBackendInfo>;
export declare const MetalBackendInfo: MessageFns<MetalBackendInfo>;
export declare const CrackCommand: MessageFns<CrackCommand>;
export declare const CrackJob: MessageFns<CrackJob>;
export declare const CrackResponse: MessageFns<CrackResponse>;
export declare const CrackConfig: MessageFns<CrackConfig>;
export declare const CrackFiles: MessageFns<CrackFiles>;
export declare const CrackFile: MessageFns<CrackFile>;
export declare const CrackFileChunk: MessageFns<CrackFileChunk>;
export declare const MonitoringProviders: MessageFns<MonitoringProviders>;
export declare const MonitoringProvider: MessageFns<MonitoringProvider>;
export declare const ResourceID: MessageFns<ResourceID>;
export declare const CertificatesReq: MessageFns<CertificatesReq>;
export declare const CertificateData: MessageFns<CertificateData>;
export declare const CertificateInfo: MessageFns<CertificateInfo>;
export declare const CertificateAuthorityData: MessageFns<CertificateAuthorityData>;
export declare const CertificateAuthorityInfo: MessageFns<CertificateAuthorityInfo>;
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
