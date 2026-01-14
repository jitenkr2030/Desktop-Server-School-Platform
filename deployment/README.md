# INR99 Academy - Deployment & Monitoring Guide

This document provides comprehensive instructions for deploying and monitoring the INR99 Academy white-label B2B SaaS platform. The deployment infrastructure is designed for production environments with containerization, automated CI/CD pipelines, and comprehensive monitoring capabilities.

## Table of Contents

The deployment architecture consists of multiple components that work together to provide a scalable, observable, and maintainable platform. The core application runs as containerized services with automated deployment pipelines, while monitoring is handled by Prometheus for metrics collection, Grafana for visualization, and Loki for log aggregation. This section provides an overview of the entire deployment stack and explains how each component integrates into the overall system architecture.

The platform uses Docker Compose for local development and production deployments, with support for multiple environments including staging and production. GitHub Actions handles continuous integration and continuous deployment, automatically building and deploying changes when code is pushed to the repository. The monitoring stack provides real-time visibility into application performance, system resources, and business metrics, enabling proactive issue detection and resolution.

## Prerequisites

Before beginning the deployment process, ensure that all required software is installed and configured correctly on your deployment environment. The following prerequisites are mandatory for a successful deployment.

Docker and Docker Compose must be installed on the deployment server. Docker version 20.10 or higher is recommended, and Docker Compose V2 should be available. Verify your installation by running `docker --version` and `docker compose version`. Additionally, ensure that the Docker daemon is running and that you have permissions to execute Docker commands.

Git is required for cloning the repository and managing deployments. Bun runtime is recommended for local development, though the Docker containers handle Bun installation automatically. For production deployments, ensure you have access to a PostgreSQL database with network connectivity from the deployment server.

For SSL/TLS certificates, you can use Let's Encrypt for automatic certificate generation or provide your own certificates. If using Let's Encrypt, ensure that your domain DNS records are properly configured to point to your server's IP address.

## Quick Start

The fastest way to get the platform running is to use the automated setup script. Clone the repository and navigate to the deployment directory to begin the setup process.

```bash
git clone <repository-url>
cd INR99-Academy
cd deployment
```

Copy the production environment template and configure your settings:

```bash
cp .env.production.example .env.production
# Edit .env.production with your configuration
```

Start all services:

```bash
docker compose up -d
```

The application will be available at `http://localhost:3000` by default. Access the Grafana dashboard at `http://localhost:3001` with the default credentials (admin/admin). Prometheus metrics are available at `http://localhost:9090`.

## Environment Configuration

The deployment uses environment variables for all configuration settings. Copy the production environment template and customize it according to your environment. The following sections describe the most important configuration options.

### Authentication Configuration

Generate a secure AUTH_SECRET using OpenSSL or a similar tool. This secret is critical for NextAuth v5 security and should be a 32-character minimum hexadecimal string. Never commit this secret to version control or share it publicly.

```bash
openssl rand -hex 32
```

The AUTH_SECRET value must be consistent across all deployment environments. Rotating this secret will invalidate all existing user sessions, so plan accordingly before making changes.

### Database Configuration

For production deployments, use a PostgreSQL database with SSL mode enabled. The DATABASE_URL format follows the standard PostgreSQL connection string format with additional parameters for Prisma compatibility.

```bash
DATABASE_URL="postgresql://username:password@hostname:5432/database?schema=public&sslmode=require"
```

Ensure that the database user has sufficient privileges to run migrations and that network connectivity is properly configured through firewalls.

### Payment Gateway Configuration

The platform integrates with Cashfree for payment processing. Obtain your credentials from the Cashfree merchant dashboard at https://merchant.cashfree.com. Configure the following environment variables with your production credentials.

```bash
CASHFREE_APP_ID=your_merchant_app_id
CASHFREE_SECRET_KEY=your_merchant_secret_key
CASHFREE_WEBHOOK_SECRET=your_webhook_signing_secret
```

Configure the webhook URL in your Cashfree dashboard to point to `https://your-domain.com/api/payments/webhook`. This endpoint handles payment confirmations and updates order status automatically.

### File Storage Configuration

The platform supports both AWS S3 and UploadThing for file storage. For AWS S3, configure the following credentials with appropriate IAM permissions for object operations.

```bash
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name
```

Ensure that the IAM user has the `s3:GetObject`, `s3:PutObject`, and `s3:ListBucket` permissions for the specified bucket.

## Docker Deployment

The Docker deployment provides a complete containerized environment with all necessary services. The following sections explain the Docker configuration and how to manage containers.

### Dockerfile Architecture

The Dockerfile uses a multi-stage build process to optimize image size and security. The first stage installs dependencies, the second stage builds the application, and the final stage creates the production runtime image. This approach ensures that build tools and source code are not present in the production image.

The production image runs as a non-root user (bun:bun) for enhanced security. The application listens on port 3000 inside the container, which is mapped to the host port configured in the environment.

### Docker Compose Services

The docker-compose.yml defines the following services that work together to form the complete platform.

The application service runs the Next.js application with all necessary environment variables. It depends on the database service for data persistence and connects to Redis for caching when available. The health check endpoint at `/health` monitors application responsiveness.

The PostgreSQL database service provides persistent storage for application data. The database is configured with appropriate connection pooling settings and health checks to ensure data integrity.

Redis provides session storage and caching capabilities. The service is configured with append-only file persistence and memory limits to prevent resource exhaustion.

Nginx acts as the reverse proxy, handling SSL termination, rate limiting, and request routing. The configuration includes security headers, gzip compression, and connection pooling settings.

Prometheus collects and stores time-series metrics from all services. The configuration includes scrape targets for application metrics, system metrics, and service health checks.

Grafana provides visualization dashboards for Prometheus metrics. The service is pre-configured with datasources and includes sample dashboards for application overview and system monitoring.

Loki aggregates logs from all services for centralized analysis. The configuration includes retention policies and query optimization settings.

### Managing Containers

Use Docker Compose commands to manage the deployment lifecycle. The Makefile provides convenient shortcuts for common operations.

Build and start all services:

```bash
docker compose build --no-cache
docker compose up -d
```

View logs from all services:

```bash
docker compose logs -f
```

Restart a specific service:

```bash
docker compose restart app
```

Stop all services:

```bash
docker compose down
```

The deployment supports graceful shutdowns, allowing ongoing requests to complete before containers stop. The entrypoint script handles cleanup operations during shutdown.

## CI/CD Pipeline

The GitHub Actions workflow automates the entire deployment process from code commit to production deployment. The pipeline includes linting, testing, security scanning, building, and deployment stages.

### Pipeline Stages

The CI/CD pipeline consists of seven distinct stages that execute in sequence. Each stage must pass before the pipeline proceeds to the next stage.

The lint stage runs ESLint to check code quality and identify potential issues. Type checking is performed using the TypeScript compiler, though failures here do not block the build in development environments.

The test stage executes unit tests using Vitest and generates coverage reports. Code coverage metrics are uploaded to Codecov for tracking over time. The coverage threshold is configurable and can be adjusted based on project requirements.

The security stage performs vulnerability scanning using Trivy and npm audit. Critical and high-severity vulnerabilities will fail the pipeline, while medium and low-severity issues are reported but do not block deployment. This approach balances security requirements with development velocity.

The build stage compiles the application and builds the Docker image. The image is tagged with the git SHA and pushed to the GitHub Container Registry. Build caching is enabled to speed up subsequent builds.

The deployment stages deploy the application to staging or production environments based on the git branch. Staging deployments happen automatically when code is pushed to the develop branch. Production deployments require a pull request to main and include additional approval steps.

### Deployment Workflow

The deployment process follows a blue-green deployment strategy for zero-downtime releases. When deploying to production, the pipeline pulls the new image, stops the old containers, starts the new containers, and runs health checks. If health checks fail, the deployment automatically rolls back to the previous version.

The deployment includes smoke tests that verify core functionality after deployment. These tests cover authentication, database connectivity, and critical API endpoints. If smoke tests fail, the deployment is considered unsuccessful.

Database migrations are run after the application is deployed. This ensures that the application and database schema remain synchronized. Migrations are designed to be backward-compatible to support rollback scenarios.

### Environment Configuration

The pipeline uses GitHub Secrets for sensitive configuration. The following secrets must be configured in your GitHub repository settings.

Staging environment secrets include the server hostname, SSH key, and application directory path. Production environment secrets include the same values plus additional security requirements.

Slack webhook URL enables deployment notifications to your team's Slack channel. Configure this in the GitHub repository settings under Secrets and variables.

## Monitoring Setup

The monitoring stack provides comprehensive visibility into application performance and system health. Prometheus collects metrics, Grafana visualizes them, and Loki aggregates logs for analysis.

### Prometheus Configuration

Prometheus is configured to scrape metrics from all services at regular intervals. The scrape configuration includes application metrics from the `/api/metrics` endpoint, system metrics from node exporters, and service-specific metrics from database and cache exporters.

Alert rules are defined in the prometheus/rules directory. These rules trigger notifications when critical thresholds are exceeded. The alerts cover application availability, error rates, response times, system resources, and database performance.

The alert rules are organized into logical groups for easy management. The application health group monitors application-specific metrics like uptime and error rates. The infrastructure group monitors system resources like CPU, memory, and disk usage. The database group monitors connection pools and query performance. The business metrics group monitors payment gateway status and authentication failures.

### Grafana Dashboards

Grafana provides pre-configured dashboards for monitoring platform health. The application overview dashboard displays key metrics including request rate, error rate, response time percentiles, and resource utilization.

Dashboard panels can be customized to suit your monitoring needs. Add new panels for additional metrics or modify existing panels to change visualization types and thresholds.

The dashboard configuration is version-controlled and can be updated through pull requests. Any changes to dashboard configuration are deployed automatically with the monitoring stack.

### Log Aggregation

Loki collects and indexes logs from all services. Logs are structured with labels for easy filtering and querying. The log schema includes service name, log level, and custom labels for business context.

Log retention is configured to 30 days by default. Adjust the retention period in the Loki configuration based on your storage capacity and compliance requirements.

Use LogQL, Loki's query language, to analyze logs efficiently. Example queries include filtering error logs, aggregating logs by time period, and correlating logs with metrics.

### Alert Notifications

Alerts are configured to send notifications through configured channels. The default configuration includes webhook integration for Slack.

Configure additional alert notification channels in the Grafana provisioning configuration. Supported channels include Slack, PagerDuty, OpsGenie, and email.

Alert severity levels determine notification urgency and escalation procedures. Critical alerts require immediate attention and may trigger on-call rotations. Warning alerts indicate potential issues that should be addressed during business hours.

## Health Checks

The platform implements multiple health check endpoints for different purposes. These endpoints are used by load balancers, orchestrators, and monitoring systems to verify service availability.

### Health Endpoints

The `/health` endpoint returns a simple 200 response indicating that the application process is running. This endpoint has minimal overhead and is suitable for frequent health checks from load balancers.

The `/ready` endpoint performs additional checks including database connectivity. This endpoint returns 200 only when the application is ready to accept traffic. Load balancers should use this endpoint for traffic routing decisions.

The `/api/health` endpoint provides detailed health information including dependency status. This endpoint returns a JSON response with component status, resource utilization, and uptime metrics. Use this endpoint for comprehensive health monitoring.

### Custom Health Checks

The healthcheck script performs additional validation including port listening, database connectivity, disk space, and memory availability. This script is used by Docker's health check mechanism to monitor container health.

Customize the health check thresholds based on your deployment requirements. The thresholds are defined in the healthcheck.sh script and can be adjusted for different environments.

## Production Checklist

Before deploying to production, complete the following checklist to ensure a secure and reliable deployment.

### Security Configuration

Enable SSL/TLS for all production traffic. Configure Nginx with valid certificates from a trusted certificate authority. Enable HTTP Strict Transport Security (HSTS) to force HTTPS connections.

Configure rate limiting to protect against abuse and denial-of-service attacks. The default configuration includes separate rate limits for API endpoints and authentication routes.

Enable all security headers in the Nginx configuration. The default headers include X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, and Content-Security-Policy.

### Database Security

Use strong passwords for database access and rotate them regularly. Enable SSL/TLS for database connections and verify certificate validity.

Configure database connection pooling to prevent connection exhaustion. Set appropriate timeouts for queries and connections to handle slow queries gracefully.

Enable database logging for audit purposes. Log all connection attempts and significant operations while respecting privacy regulations.

### Monitoring Validation

Verify that all monitoring components are functional before production deployment. Confirm that Prometheus is successfully scraping metrics from all services.

Test alert notifications by triggering test alerts or temporarily lowering thresholds. Verify that notifications are received through all configured channels.

Validate Grafana dashboards by reviewing all panels and confirming data is displayed correctly. Customize panels as needed for your monitoring requirements.

### Backup and Recovery

Configure automated backups for the database and persistent volumes. Test backup restoration procedures regularly to ensure recoverability.

Document the recovery procedures for different failure scenarios. Include steps for database restoration, application rollback, and infrastructure recovery.

### Performance Tuning

Configure appropriate resource limits for all containers. Monitor resource utilization and adjust limits based on actual usage patterns.

Enable gzip compression for text-based responses to reduce bandwidth usage. Configure appropriate cache headers for static assets to reduce server load.

Optimize database queries by reviewing slow query logs and adding indexes where necessary. Monitor query performance and adjust configuration based on workload characteristics.

## Troubleshooting

Common deployment issues and their solutions are documented in this section.

### Container Startup Failures

If containers fail to start, check the container logs for error messages. Common causes include missing environment variables, database connectivity issues, and resource constraints.

```bash
docker compose logs app
```

Verify that all required environment variables are set correctly. The application will fail to start if critical variables like AUTH_SECRET or DATABASE_URL are missing.

### Database Connection Issues

If the application cannot connect to the database, verify network connectivity and credentials. Check that the database is accepting connections on the expected port.

```bash
docker compose exec db pg_isready -U inr99
```

Ensure that the database URL format is correct and that SSL requirements are met. Some database providers require specific connection string parameters.

### Performance Degradation

If the application experiences performance issues, check resource utilization metrics in Grafana. Common causes include memory exhaustion, CPU saturation, and database slow queries.

Review the slow query logs to identify problematic database queries. Add indexes or optimize queries to improve performance.

### Monitoring Issues

If metrics are not appearing in Grafana, verify that Prometheus is successfully scraping targets. Check the Prometheus targets page for scraping status.

Ensure that the application is exposing metrics at the configured endpoint. Review the application logs for metric collection errors.

## Support

For deployment support, contact the platform team through the designated communication channels. Include relevant logs, error messages, and environment details when requesting assistance.

Document any customizations or modifications to the default deployment configuration. This information helps with troubleshooting and ensures reproducible deployments.
