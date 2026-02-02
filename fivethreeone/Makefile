# FiveThreeOne - Makefile
# Quality check targets for CI/CD

.PHONY: lint-frontend sast-frontend test-frontend all-checks

# Run ESLint on all source files
lint-frontend:
	@echo "🔍 Running ESLint..."
	npm run lint

# Run TypeScript type-check and ESLint security checks
sast-frontend:
	@echo "🔒 Running SAST checks (TypeScript + ESLint)..."
	npm run typecheck
	npm run lint

# Run Jest test suite
test-frontend:
	@echo "🧪 Running tests..."
	npm run test

# Run all quality checks
all-checks: lint-frontend sast-frontend test-frontend
	@echo "✅ All checks passed!"

# Run tests with coverage report
test-coverage:
	@echo "📊 Running tests with coverage..."
	npm run test:coverage

# Watch mode for development
test-watch:
	npm run test:watch

# Help target
help:
	@echo "Available targets:"
	@echo "  lint-frontend   - Run ESLint on all source files"
	@echo "  sast-frontend   - Run TypeScript type-check + ESLint"
	@echo "  test-frontend   - Run Jest test suite"
	@echo "  all-checks      - Run all quality checks"
	@echo "  test-coverage   - Run tests with coverage report"
	@echo "  test-watch      - Run tests in watch mode"
