import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';

// test parameters from environment variables
const TARGET_URL = __ENV.TARGET_URL;
const SIZE = __ENV.SIZE || '100';

export const options = {
	summaryTrendStats: ['min', 'med', 'avg', 'p(95)', 'p(99)', 'max'],
	stages: [
		{ duration: '15s', target: parseInt(__ENV.VUS) },	// ramp up
		{ duration: '30s', target: parseInt(__ENV.VUS) },	// sustained load
		{ duration: '5s',  target: 0 },						// ramp down
	],
	thresholds: {
		http_req_failed: ['rate<0.01'],		// fail if error rate > 1%
	},
};

export default function () {
	const res = http.get(`${TARGET_URL}?size=${SIZE}`);
	check(res, {
		'status is 200': (r) => r.status === 200,
	});
}

export function handleSummary(data) {
	return {
		[__ENV.OUTFILE]: JSON.stringify({
			http_req_duration: data.metrics.http_req_duration,
			http_reqs: data.metrics.http_reqs,
			http_req_failed: data.metrics.http_req_failed,
		}, null, 2),
	};
}