/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeaderboardEntry } from '../models/LeaderboardEntry';
import type { StatsResponse } from '../models/StatsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatsControllerService {
    /**
     * @returns StatsResponse OK
     * @throws ApiError
     */
    public static getMyStats(): CancelablePromise<StatsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stats/me',
        });
    }
    /**
     * @param limit
     * @returns LeaderboardEntry OK
     * @throws ApiError
     */
    public static getLeaderboard(
        limit: number = 10,
    ): CancelablePromise<Array<LeaderboardEntry>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/stats/leaderboard',
            query: {
                'limit': limit,
            },
        });
    }
}
