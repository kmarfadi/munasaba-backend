# Munasaba Backend

A comprehensive event management system built with NestJS, featuring user authentication, event management, guest tracking, and analytics.

## Features

- 🔐 **User Authentication** - JWT-based authentication with local strategy
- 📅 **Event Management** - Create, update, and manage events
- 👥 **Guest Management** - Track guests, check-ins, and check-outs
- 📊 **Analytics Dashboard** - Comprehensive event and attendance analytics
- 🛡️ **Security** - Global exception handling and request logging
- 🗄️ **Database** - PostgreSQL with TypeORM
- 🐳 **Docker Support** - Containerized deployment

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Validation**: Class-validator
- **Containerization**: Docker

## Project Structure

```
src/
├── common/                       # Shared utilities
│   ├── filters/                  # Global exception filters
│   ├── guards/                   # Authentication guards
│   ├── interceptors/             # Logging interceptors
│   ├── middleware/               # Request logging middleware
│   └── utils/                    # Utility functions
├── config/                       # Configuration files
├── database/                     # Database setup
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Database seeders
└── modules/                      # Feature modules
    ├── analytics/                # Analytics module
    │   ├── analytics.controller.ts
    │   ├── analytics.module.ts
    │   └── analytics.service.ts
    ├── events/                   # Events module
    │   ├── dto/                  # Data Transfer Objects
    │   │   ├── create-event.dto.ts
    │   │   └── update-event.dto.ts
    │   ├── event.entity.ts
    │   ├── events.controller.ts
    │   ├── events.module.ts
    │   └── events.service.ts
    ├── guests/                   # Guests module
    │   ├── dto/
    │   │   ├── create-guest.dto.ts
    │   │   └── update-guest.dto.ts
    │   ├── guest.entity.ts
    │   ├── guests.controller.ts
    │   ├── guests.module.ts
    │   └── guests.service.ts
    └── user/                     # User module
        └── auth/                 # Authentication submodule
            ├── dto/
            │   ├── login.dto.ts
            │   └── register.dto.ts
            ├── entities/
            │   └── user.entity.ts
            ├── strategies/
            │   ├── jwt.strategy.ts
            │   └── local.strategy.ts
            ├── auth.controller.ts
            ├── auth.module.ts
            └── auth.service.ts
```

## Installation

```bash
# Install dependencies
$ npm install

# Set up environment variables
$ cp .env.example .env
# Edit .env with your database credentials
```

## Database Setup

```bash
# Run database migrations
$ npm run migration:run

# Seed the database (optional)
$ npm run seed
```

## Running the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run start:prod

# Build the application
$ npm run build
```

## API Endpoints

### Authentication (`/api/user/auth`)
- `POST /api/user/auth/register` - Register a new user
- `POST /api/user/auth/login` - Login user
- `GET /api/user/auth/profile` - Get user profile (protected)

### Events (`/api/events`)
- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event (protected)
- `GET /api/events/:id` - Get event by ID
- `PATCH /api/events/:id` - Update event (protected)
- `DELETE /api/events/:id` - Delete event (protected)

### Guests (`/api/guests`)
- `GET /api/guests` - Get all guests
- `POST /api/guests` - Create a new guest (protected)
- `GET /api/guests/:id` - Get guest by ID
- `PATCH /api/guests/:id` - Update guest (protected)
- `DELETE /api/guests/:id` - Delete guest (protected)
- `POST /api/guests/:id/checkin` - Check-in guest (protected)
- `POST /api/guests/:id/checkout` - Check-out guest (protected)

### Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` - Get dashboard statistics (protected)
- `GET /api/analytics/events/stats` - Get event statistics (protected)
- `GET /api/analytics/guests/stats` - Get guest statistics (protected)
- `GET /api/analytics/events/:id/analytics` - Get event-specific analytics (protected)
- `GET /api/analytics/attendance/trends` - Get attendance trends (protected)

## Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Docker Support

The application includes Docker configuration for easy deployment:

```bash
# Build and run with Docker Compose
$ docker-compose up --build

# Run in production mode
$ docker-compose -f docker-compose.prod.yml up --build
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=munasaba

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Application
PORT=3000
NODE_ENV=development
```

## Logging and Error Handling

The application includes comprehensive logging and error handling:

- **Request/Response Logging**: All HTTP requests and responses are logged with timing information
- **Global Exception Filter**: Catches and formats all unhandled exceptions
- **Structured Logging**: Consistent log format across the application
- **Error Tracking**: Detailed error information for debugging

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
