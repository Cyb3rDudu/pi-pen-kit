"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListConfigs = exports.ParseConfig = exports.ParseConfigFile = void 0;
exports.parseConfigFile = parseConfigFile;
exports.parseConfig = parseConfig;
exports.listConfigs = listConfigs;
const promises_1 = require("node:fs/promises");
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
async function parseConfigFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Config file does not exist: ${filePath}`);
    }
    const data = await (0, promises_1.readFile)(filePath);
    return parseConfig(data);
}
function parseConfig(data) {
    const raw = JSON.parse(data.toString("utf8"));
    validateConfig(raw);
    return raw;
}
async function listConfigs(configDir) {
    try {
        const items = await (0, promises_1.readdir)(configDir);
        const configs = [];
        for (const item of items) {
            const filePath = path.join(configDir, item);
            if (!fs.existsSync(filePath) || fs.lstatSync(filePath).isDirectory()) {
                continue;
            }
            try {
                configs.push(await parseConfigFile(filePath));
            }
            catch {
                // Best-effort: ignore invalid config files in the directory.
            }
        }
        return configs;
    }
    catch {
        return [];
    }
}
function validateConfig(config) {
    const mustBeString = [
        "operator",
        "lhost",
        "ca_certificate",
        "certificate",
        "private_key",
        "token",
    ];
    for (const key of mustBeString) {
        if (typeof config[key] !== "string") {
            throw new Error(`Invalid sliver config: missing/invalid ${key}`);
        }
    }
    if (typeof config.lport !== "number" || !Number.isFinite(config.lport)) {
        throw new Error("Invalid sliver config: missing/invalid lport");
    }
}
// Back-compat exports (v1.x API)
exports.ParseConfigFile = parseConfigFile;
exports.ParseConfig = parseConfig;
exports.ListConfigs = listConfigs;
