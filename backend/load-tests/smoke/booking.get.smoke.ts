import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 1,
};

export default function () {
    const url = 'http://localhost:3000/bookings';
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.get(url, params);
    check(res, {
        "status is 200": (r) => r.status === 200,
        "has data array": (r) => {
            try = 
        }
    });
    sleep(1);
}
