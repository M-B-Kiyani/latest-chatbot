# Security Guidelines

## Environment Variables

**NEVER commit API keys, secrets, or credentials to the repository.**

### Required Environment Variables

Create a `.env` file in your project root with the following variables:

```bash
# Gemini AI API Key
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Retell AI Configuration
RETELL_API_KEY=your_actual_retell_api_key_here
RETELL_AGENT_ID=your_actual_retell_agent_id_here

# Google Calendar API
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token

# HubSpot CRM
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token

# Database
DATABASE_URL=your_database_connection_string

# Email Configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email_username
SMTP_PASS=your_email_password

# Application Settings
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
```

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Copy all the above variables plus:
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
```

## Security Best Practices

1. **Never commit `.env` files** - They are already in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Rotate API keys regularly**
4. **Use different keys** for development and production
5. **Limit API key permissions** to only what's needed
6. **Monitor API usage** for unusual activity

## If You Accidentally Commit Secrets

1. **Immediately revoke/regenerate** the exposed keys
2. **Remove from git history** using git-filter-repo or BFG
3. **Force push** the cleaned repository
4. **Update all environments** with new keys

## Production Deployment

- Use your hosting platform's environment variable system
- Never hardcode secrets in deployment scripts
- Use secrets management services when available
- Enable audit logging for secret access

## Reporting Security Issues

If you discover a security vulnerability, please report it privately to the repository maintainer.
