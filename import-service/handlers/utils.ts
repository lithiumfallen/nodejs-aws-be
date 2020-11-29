import { pipeline as _pipeline, Transform } from 'stream';
import { promisify } from 'util';

export const pipeline = promisify(_pipeline);

type HandlerTypes = {
  data: Buffer,
  encoding?: string,
}

interface HandlerInterface {
  (args: HandlerTypes): Promise<void>
}

export const useTransofrmStream = (handler: HandlerInterface) : Transform => new Transform({
  objectMode: true,
  transform: async (data, encoding, callback) => {
    try {
      await handler({ data, encoding });
      callback(null, data);
    } catch (error) {
      callback(error);
    }
  }
})
