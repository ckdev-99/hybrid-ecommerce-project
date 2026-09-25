FROM php:8.2-cli

# Install system dependencies and PHP extensions (pgsql for Neon)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files first (better Docker layer caching)
COPY composer.json composer.lock ./

# Install PHP dependencies (skip dev packages for production)
# --no-scripts: artisan doesn't exist yet, so post-autoload scripts would fail
RUN composer install --optimize-autoloader --no-dev --no-interaction --no-progress --no-scripts

# Copy the rest of the application
COPY . .

# Now that artisan exists, discover packages
RUN php artisan package:discover --ansi

# Set permissions for Laravel storage and cache
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Expose the port Render assigns
EXPOSE 10000

# Run migrations on startup, then serve the app
CMD ["sh", "-c", "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]
