// Demo 1A, step 1: smoke test against OWASP Juice Shop
// Goal: validate the environment and show basic k6 syntax.
// Duration: ~35s.
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    // Simple SLOs: p95 under 300 ms and under 5% of failed requests
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  http.get(`${BASE}/api/products`, { tags: { name: 'product_list' } });
  sleep(1);
}
