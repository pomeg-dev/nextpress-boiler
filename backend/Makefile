.PHONY: stop start down install frontend php-tools hooks

stop:
	-docker stop $$(docker ps -a -q)
	-docker rm $$(docker ps -a -q)

start: stop
	docker-compose up -d --build

down: stop
	docker-compose down

# Frontend deps (eslint/prettier/stylelint); npm's "prepare" also activates git hooks
frontend:
	cd ../frontend && npm install

# PHP dev tooling (PHPCS/WPCS); non-fatal if composer isn't installed
php-tools:
	cd .. && { command -v composer >/dev/null 2>&1 && composer install || echo "composer not found — skipping PHP tooling"; }

# Point git at the repo's tracked hooks (advisory pre-push AI review)
hooks:
	cd .. && bash bin/enable-hooks

install: start frontend php-tools hooks
	docker-compose -f docker-compose.yml -f wp-auto-config.yml run --rm wp-auto-config
	cd .. && git submodule update --init --recursive
