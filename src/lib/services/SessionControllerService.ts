/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PagedResponseSessionResponse } from '../models/PagedResponseSessionResponse';
import type { SaveSessionResponse } from '../models/SaveSessionResponse';
import type { SessionSaveRequest } from '../models/SessionSaveRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SessionControllerService {
    /**
     * @param requestBody
     * @returns SaveSessionResponse OK
     * @throws ApiError
     */
    public static saveSession(
        requestBody: SessionSaveRequest,
    ): CancelablePromise<SaveSessionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/sessions/save',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param page
     * @param size
     * @returns PagedResponseSessionResponse OK
     * @throws ApiError
     */
    public static getHistory(
        page?: number,
        size: number = 20,
    ): CancelablePromise<PagedResponseSessionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/sessions/history',
            query: {
                'page': page,
                'size': size,
            },
        });
    }
}
