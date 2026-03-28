const express = require('express');
const { create } = require('xmlbuilder2');
const app = express();
const port = 8001;

// cache generated data
const dataCache = {};
const getData = (count = 100) => {
	if (!dataCache[count]) {
		dataCache[count] = Array.from({ length: count }, (_, i) => ({
			id: i,
			name: `Item ${i}`,
			timestamp: "2025-01-01T00:00:00.000Z",
			active: true,
			description: "Standardized string for performance testing."
		}));
	}
	return dataCache[count];
};

// JSON Endpoint
app.get('/api/json', (req, res) => {
	const size = parseInt(req.query.size) || 100;
	const data = getData(size);
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(data));
});

// XML Endpoint
app.get('/api/xml', (req, res) => {
	const size = parseInt(req.query.size) || 100;
	const data = getData(size);
	const root = create({ items: { item: data } });
	const xml = root.end({ prettyPrint: false });
	res.setHeader('Content-Type', 'application/xml');
	res.send(xml);
});

app.listen(port, () => {
	console.log(`Test server listening at http://localhost:${port}`);
});