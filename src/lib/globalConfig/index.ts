import fs from 'fs';
import path from 'path';
import * as process from "process";

const fileName = 'globalConfig.json';

export function getGlobalConfig() {
    const filePath = path.join(process.cwd(), fileName);
    const fileData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileData);
}

export function setGlobalConfig(data: any) {
    const filePath = path.join(process.cwd(), fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

