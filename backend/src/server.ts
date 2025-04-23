require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const morgan = require("morgan");
const { requestLogger, errorLogger, log } = require("./utils/logger");
const { validate } = require("./middleware/validate");
const { errorHandler } = require("./utils/errorHandler");
const Response = require("./utils/response");

// Import routes
const authRoutes = require("./routes/authRoutes");
const kycRoutes = require("./routes/kycRoutes");
const emailRoutes = require("./routes/emailRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || "http://localhost:5173"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      sandbox: ["allow-forms", "allow-scripts", "allow-same-origin"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rate limiting with different limits for different routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  handler: (req, res) => Response.tooManyRequests(res)
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  handler: (req, res) => Response.tooManyRequests(res, "Too many login attempts, please try again after 15 minutes")
});

// Apply rate limiters
app.use("/api/auth", authLimiter);
app.use(generalLimiter);

// Body parser middleware with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    try {
      JSON.parse(buf);
    } catch(e) {
      Response.badRequest(res, "Invalid JSON payload");
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  parameterLimit: 1000
}));

// Request logging middleware
app.use(requestLogger);

// Morgan logging with Winston stream
app.use(morgan('combined', { stream: log.stream }));

// Connect to database
connectDB().catch(err => {
  log.error("Database connection failed", { error: err.message });
  process.exit(1);
});

// Routes with validation middleware
app.use("/api/auth", validate, authRoutes);
app.use("/api/kyc", validate, kycRoutes);
app.use("/api/rentals", validate, rentalRoutes);
app.use("/api", validate, emailRoutes);
app.use("/api/cart", validate, cartRoutes);
app.use("/api/payments", validate, paymentRoutes);

// Add a test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error logging middleware
app.use(errorLogger);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  log.warn("Route not found", {
    path: req.path,
    method: req.method
  });
  
  Response.notFound(res);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log.info('SIGTERM received. Shutting down gracefully...');
  app.close(() => {
    log.info('Server closed');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, '0.0.0.0', () => {
  log.info(`Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV || 'development',
    url: `http://localhost:${PORT}`
  });
  
  // Log all registered routes
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  log.info('Registered routes:', { routes });
});
