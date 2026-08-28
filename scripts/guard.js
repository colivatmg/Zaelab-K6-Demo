// Demo 1B: the "Guardian" - the script that runs in GitHub Actions
// SLO from slide 15: 95% of requests under 200 ms.
// When a threshold is crossed, k6 exits with a non-zero code
// and GitHub Actions marks the check RED (the PR cannot be merged).
// Duration: ~45 s (enough for a representative sample).
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '40s',
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  http.get(`${BASE}/api/products`, { tags: { name: 'product_list' } });
  sleep(0.5);
}
