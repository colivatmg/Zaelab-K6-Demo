// Demo 1B: stress test with a VU ramp up to the breaking point
// Goal: watch live as latency (p95) climbs and errors (HTTP 500) appear
// while load increases. The final summary MUST come out RED (thresholds crossed).
// Total duration: ~2 min 40 s.
import http from 'k6/http';
import { sleep, rampingVUs } from 'k6';

export const options = {
  scenarios: {
    ramp_to_break: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 20 },  // warm-up: normal traffic
        { duration: '60s', target: 50 },  // increase pressure
        { duration: '80s', target: 100 }, // find the breaking point
        { duration: '20s', target: 0 },   // release and close
      ],
    },
  },
  thresholds: {
    // SLOs we EXPECT to be crossed in the final stage
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  http.get(`${BASE}/api/products`, { tags: { name: 'product_list' } });
  // A second request to show multiple endpoints per iteration
  http.get(`${BASE}/api/categories`, { tags: { name: 'category_list' } });
  sleep(0.5);
}
