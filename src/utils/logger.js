/**
 * Logger utility for consistent logging across the application
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  /**
   * Ensure log directory exists
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Get current timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Format log message
   */
  formatMessage(level, message, data = null) {
    const timestamp = this.getTimestamp();
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      logMessage += ` ${JSON.stringify(data)}`;
    }
    
    return logMessage;
  }

  /**
   * Write to log file
   */
  writeToFile(level, message, data = null) {
    const logMessage = this.formatMessage(level, message, data);
    const logFile = path.join(this.logDir, 'app.log');
    
    fs.appendFileSync(logFile, logMessage + '\n');
  }

  /**
   * Log info message
   */
  info(message, data = null) {
    const logMessage = this.formatMessage('info', message, data);
    console.log(`\x1b[36m${logMessage}\x1b[0m`); // Cyan
    this.writeToFile('info', message, data);
  }

  /**
   * Log warning message
   */
  warn(message, data = null) {
    const logMessage = this.formatMessage('warn', message, data);
    console.warn(`\x1b[33m${logMessage}\x1b[0m`); // Yellow
    this.writeToFile('warn', message, data);
  }

  /**
   * Log error message
   */
  error(message, data = null) {
    const logMessage = this.formatMessage('error', message, data);
    console.error(`\x1b[31m${logMessage}\x1b[0m`); // Red
    this.writeToFile('error', message, data);
  }

  /**
   * Log debug message
   */
  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = this.formatMessage('debug', message, data);
      console.log(`\x1b[35m${logMessage}\x1b[0m`); // Magenta
      this.writeToFile('debug', message, data);
    }
  }

  /**
   * Log success message
   */
  success(message, data = null) {
    const logMessage = this.formatMessage('success', message, data);
    console.log(`\x1b[32m${logMessage}\x1b[0m`); // Green
    this.writeToFile('info', `SUCCESS: ${message}`, data);
  }

  /**
   * Clear log files
   */
  clearLogs() {
    const logFile = path.join(this.logDir, 'app.log');
    if (fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, '');
      this.info('Log files cleared');
    }
  }
}

// Create singleton instance
const logger = new Logger();

module.exports = { logger };
