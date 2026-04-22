/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateProfileRequest } from '../models/UpdateProfileRequest';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserControllerService {
    /**
     * @returns UserResponse OK
     * @throws ApiError
     */
    public static getProfile(): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/me',
        });
    }
    /**
     * @param requestBody
     * @returns UserResponse OK
     * @throws ApiError
     */
    public static updateProfile(
        requestBody: UpdateProfileRequest,
    ): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/users/me',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
