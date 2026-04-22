/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AchievementResponse } from '../models/AchievementResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AchievementControllerService {
    /**
     * @returns AchievementResponse OK
     * @throws ApiError
     */
    public static getMyAchievements(): CancelablePromise<Array<AchievementResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/achievements/me',
        });
    }
}
