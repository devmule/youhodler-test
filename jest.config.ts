import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: "ts-jest",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
};
export default config;