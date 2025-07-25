# Accessibility Testing Suite

This directory contains accessibility tests for the Academico-AI platform to ensure WCAG compliance and inclusive design.

## Test Categories

- **Keyboard Navigation**: Tab order, focus management, keyboard shortcuts
- **Screen Reader Compatibility**: ARIA labels, semantic HTML, announcement testing
- **Color Contrast**: Text readability, visual accessibility
- **Focus Management**: Focus indicators, modal focus trapping
- **Form Accessibility**: Label associations, error messaging, validation feedback

## Running Tests

```bash
# Run all accessibility tests
npm run test:accessibility

# Run specific accessibility test suites
npm run test:accessibility:keyboard
npm run test:accessibility:screen-reader
npm run test:accessibility:contrast
```

## Test Dependencies

- `@axe-core/playwright` - Automated accessibility testing
- `axe-core` - Accessibility rules engine
- `playwright` - Cross-browser testing framework

## Test Reports

Accessibility test results are generated in:

- `tests/accessibility/reports/` - Detailed test reports
- `tests/accessibility/screenshots/` - Visual regression captures
