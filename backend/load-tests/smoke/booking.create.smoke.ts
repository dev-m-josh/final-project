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
        }
    };

    const payload = JSON.stringify({
        userId: 2,
        roomId: 1,
        checkInDate: "2023-06-01",
        checkOutDate: "2023-06-10",
        totalAmount: 1000,
        isConfirmed: false,
    });

    const res = http.post(url, payload, params);
    console.log("Booking response:", res.status, res.body);

    check(res, {
        "status is 201": (r) => r.status === 201,
    });
    sleep(1);
}