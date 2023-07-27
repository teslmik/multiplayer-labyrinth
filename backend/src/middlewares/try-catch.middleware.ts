import { Request, Response, NextFunction } from 'express';

const tryCatchMiddleware =
  (handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next);
      } catch (error) {
        if (error instanceof Error) {
          console.log('error: ', error);
          res
            .status(500)
            .json({ message: error.message ? error?.message : String(error) });
          next(error);
        } else {
          res.status(500).json({ message: String(error) });
          next(error);
        }
      }
    };

export { tryCatchMiddleware };