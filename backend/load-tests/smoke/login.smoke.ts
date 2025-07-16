import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1,
    iterations: 1,
    duration: '15s'
};

export default function () {
    const url = 'http://localhost:3000/auth/login';
    const payload = JSON.stringify({
        email: 'mutambukijoshua2@gmail.com',
        password: 'joshuapeter'
    });

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const res = http.post(url, payload, params);

    check(res, {
        "status is 200": (r) => r.status === 200,
        "response has token": (r) => r.json("token") !== undefined,
    });
    sleep(1);
}