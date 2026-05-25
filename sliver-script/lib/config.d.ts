export interface SliverClientConfig {
    operator: string;
    lhost: string;
    lport: number;
    ca_certificate: string;
    certificate: string;
    private_key: string;
    token: string;
}
export declare function parseConfigFile(filePath: string): Promise<SliverClientConfig>;
export declare function parseConfig(data: Buffer): SliverClientConfig;
export declare function listConfigs(configDir: string): Promise<SliverClientConfig[]>;
export declare const ParseConfigFile: typeof parseConfigFile;
export declare const ParseConfig: typeof parseConfig;
export declare const ListConfigs: typeof listConfigs;
