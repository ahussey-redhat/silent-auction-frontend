import { Buffer } from 'buffer';
import type { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { simulateError, simulateNotFound } from './simulate';

export const handleGet =
  <T>(callback: (url: URL) => T) =>
  async (
    request: IncomingMessage,
    response: ServerResponse,
    next: (...args: unknown[]) => void,
  ) => {
    try {
      const result = await Promise.resolve(
        callback(new URL(request.url!, 'http://localhost:8080')),
      );

      next();

      if (!result) {
        response.statusCode = 404;
        response.end('');
        return;
      }

      const responseBody = JSON.stringify(result);

      response.setHeader('Content-Type', 'application/json');
      response.end(responseBody);
    } catch (error) {
      next(error instanceof Error ? error.message : error);
    }
  };

export const handleGetId = <T extends { id: string }>(list: T[]) =>
  handleGet(url => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (simulateError) {
          reject(new Error('Simulated Error'));
        } else if (simulateNotFound) {
          resolve(null);
        }

        const pathSegments = url.pathname.split('/');
        const memberId = pathSegments[pathSegments.length - 1];

        resolve(list.find(({ id }) => id === memberId));
      });
    });
  });

export const handlePost =
  <T, U>(callback: (requestBody: Partial<T>) => U) =>
  (
    request: IncomingMessage,
    response: ServerResponse,
    next: (...args: unknown[]) => void,
  ) => {
    const requestBuffer: Uint8Array[] = [];
    request
      .on('data', chunk => {
        requestBuffer.push(chunk);
      })
      .on('end', () => {
        try {
          const responseBody = JSON.stringify(
            callback(JSON.parse(Buffer.concat(requestBuffer).toString())),
          );

          next();

          response.setHeader('Content-Type', 'application/json');
          response.end(responseBody);
        } catch (error) {
          next(error instanceof Error ? error.message : error);
        }
      });
  };
