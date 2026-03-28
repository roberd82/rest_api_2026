BASE = 'results'
pattern = re.compile(r'^(json|xml)_size(\d+)_vus(\d+)\.json$')
rows = []

for filename in sorted(os.listdir(BASE)):
	match = pattern.match(filename)
	if not match:
		continue

	fmt = match.group(1)
	size = int(match.group(2))
	vus = int(match.group(3))

	with open(os.path.join(BASE, filename)) as f:
		data = json.load(f)

	duration = data.get('http_req_duration', {}).get('values', {})
	reqs = data.get('http_reqs', {}).get('values', {})
	failed = data.get('http_req_failed', {}).get('values', {})

	rows.append({
		'format': fmt,
		'size_records': size,
		'vus': vus,
		'avg_ms': round(duration.get('avg', 0), 4),
		'med_ms': round(duration.get('med', 0), 4),
		'p95_ms': round(duration.get('p(95)', 0), 4),
		'p99_ms': round(duration.get('p(99)', 0), 4),
		'min_ms': round(duration.get('min', 0), 4),
		'max_ms': round(duration.get('max', 0), 4),
		'throughput_rps': round(reqs.get('rate', 0), 4),
		'total_requests': int(reqs.get('count', 0)),
		'error_rate': round(failed.get('rate', 0), 6),
	})

df = pd.DataFrame(rows).sort_values(['format', 'size_records', 'vus']).reset_index(drop=True)

# check for errors
errors = df[df.error_rate > 0]
if errors.empty:
	print(f"Parsed {len(df)} scenarios - all error rates 0%")
else:
	print(f"WARNING: {len(errors)} scenario(s) with non-zero error rate:")
	print(errors[['format','size_records','vus','error_rate']])

df.head()
