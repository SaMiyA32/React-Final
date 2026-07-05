
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key';
process.env.PASSWORD_SALT_ROUNDS = '10';
process.env.CORS_ORIGIN = 'http://localhost:3000';


const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});
