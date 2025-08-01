import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000';

export const options = {
    stages: [
        { duration: "30s", target: 50 }, // ramp-up to 50 users
        { duration: "30s", target: 100 }, // ramp-up to 100 users
        { duration: "30s", target: 200 }, // ramp-up to 200 users
        { duration: "30s", target: 400 }, // ramp-up to 400 users
        { duration: "30s", target: 500 }, // ramp-up to 500 users
        { duration: "30s", target: 800 }, // ramp-up to 800 users (keep increasing)
        { duration: "30s", target: 0 }, // ramp-down to 0 users
    ],
    ext: {
        loadimpact: {
            name: 'Hotels GET Breakpoint Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/hotels`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    check(res, {
        "status is 200": (r) => r.status === 200,
        "has data array": (r) => {
            try {
                const body = JSON.parse(r.body as string);
                return Array.isArray(body);
            } catch {
                return false;
            }
        },
    });
    sleep(1);
}