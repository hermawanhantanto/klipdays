import { jest } from '@jest/globals';
import type { NextFunction, Request, Response } from 'express';

export interface MockResponseResult {
  res: Response;
  statusMock: ReturnType<typeof jest.fn>;
  jsonMock: ReturnType<typeof jest.fn>;
  cookieMock: ReturnType<typeof jest.fn>;
  clearCookieMock: ReturnType<typeof jest.fn>;
}

/**
 * Creates a mock Express Request with sensible defaults and optional overrides.
 *
 * @param overrides - Partial Request properties to override default state.
 * @returns A mocked Express Request object.
 */
export function CreateMockRequest(overrides: Partial<Request> = {}): Request {
  const req = {
    body: {},
    params: {},
    query: {},
    headers: {},
    cookies: {},
    ...overrides,
  } as unknown as Request;

  return req;
}

/**
 * Creates a mock Express Response with spyable status, json, cookie, and clearCookie methods.
 *
 * @returns MockResponseResult containing the Response and individual mock spies.
 */
export function CreateMockResponse(): MockResponseResult {
  const statusMock = jest.fn();
  const jsonMock = jest.fn();
  const cookieMock = jest.fn();
  const clearCookieMock = jest.fn();

  const res = {
    status: statusMock,
    json: jsonMock,
    cookie: cookieMock,
    clearCookie: clearCookieMock,
  } as unknown as Response;

  statusMock.mockReturnValue(res);
  jsonMock.mockReturnValue(res);
  cookieMock.mockReturnValue(res);
  clearCookieMock.mockReturnValue(res);

  return {
    res,
    statusMock,
    jsonMock,
    cookieMock,
    clearCookieMock,
  };
}

/**
 * Creates a mock Express NextFunction.
 *
 * @returns A Jest mock function typed as NextFunction.
 */
export function CreateMockNext(): NextFunction & ReturnType<typeof jest.fn> {
  return jest.fn() as unknown as NextFunction & ReturnType<typeof jest.fn>;
}
