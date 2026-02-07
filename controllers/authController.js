import authService from '../services/authService.js';

// Register new user
class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const result = await authService.register({ name, email, password });

      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();