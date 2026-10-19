# Email Queue & Background Job Service

A backend service for submitting email requests through GraphQL and
processing them asynchronously using Redis and BullMQ, with PostgreSQL
for durable records.

## Overview

Sending emails directly during an API request can make requests slower
and tie request success to the email provider's availability. This
project separates email submission from delivery: the API accepts a
request, a background worker processes the queued job, and the
application tracks its status.

The service is designed around a replaceable email-provider adapter, so
the delivery provider can be changed without rewriting the core business
logic.

## Tech Stack

-   **TypeScript** --- strict type checking
-   **GraphQL** --- API query and mutation interface
-   **Apollo Server + Express** --- GraphQL server
-   **PostgreSQL** --- durable application records and email lifecycle
    status
-   **Redis + BullMQ** --- background job queue, scheduling, and retries
-   **Docker** --- planned for local infrastructure and deployment

## Architecture

``` text
Client
  |
  v
GraphQL API (Apollo Server + Express)
  |
  v
Resolver -> Service -> Repository -> PostgreSQL
               |
               v
          BullMQ Queue <----> Redis
               |
               v
        Background Worker
               |
               v
      Email Provider Adapter
               |
               v
        Email Delivery Provider
```

## Features

The service is intended to support:

-   Submitting email jobs through GraphQL.
-   Processing emails asynchronously in a separate worker process.
-   Persisting email records and tracking job status.
-   Automatic retries with exponential backoff.
-   Idempotency to help prevent duplicate submissions.
-   Delayed and recurring email jobs.
-   Explicit handling of jobs that repeatedly fail.
-   Worker concurrency and rate limiting.
-   Authentication, authorization, validation, logging, and metrics.
-   Tests for core behavior and failure scenarios.
-   Reliable coordination between PostgreSQL and the queue using the
    outbox pattern.

These capabilities will be implemented as the project develops; the list
describes the intended functionality, not a claim that every feature is
currently available.