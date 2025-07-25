# Performance Testing Suite

This directory contains performance tests for the Academico-AI platform to ensure optimal user experience and system responsiveness.

## Test Categories

- **Load Testing**: API response times under various loads
- **Stress Testing**: System behavior under extreme conditions
- **Memory Usage**: Resource consumption monitoring
- **Database Performance**: Query optimization and response times
- **Network Performance**: Bundle sizes, loading times, Core Web Vitals

## Running Tests

```bash
# Run all performance tests
npm run test:performance

# Run specific performance test suites
npm run test:performance:load
npm run test:performance:memory
npm run test:performance:core-vitals
```

## Performance Thresholds

### API Response Times

- **Chat responses**: < 30 seconds (timeout at 120s)
- **Database queries**: < 2 seconds
- **Authentication**: < 5 seconds
- **File uploads**: < 60 seconds

### Frontend Performance

- **First Contentful Paint (FCP)**: < 2.5 seconds
- **Largest Contentful Paint (LCP)**: < 4.0 seconds
- **Cumulative Layout Shift (CLS)**: < 0.25
- **First Input Delay (FID)**: < 300ms

## Test Dependencies

- `lighthouse` - Performance auditing
- `puppeteer` - Browser automation for performance testing
- `playwright` - Cross-browser performance testing

## Test Reports

Performance test results are generated in:

- `tests/performance/reports/` - Detailed performance metrics
- `tests/performance/lighthouse/` - Lighthouse audit reports
- `tests/performance/screenshots/` - Performance timeline captures
