/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PagedResponseTaskResponse } from '../models/PagedResponseTaskResponse';
import type { TaskRequest } from '../models/TaskRequest';
import type { TaskResponse } from '../models/TaskResponse';
import type { UpdateTaskRequest } from '../models/UpdateTaskRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TaskControllerService {
    /**
     * @param id
     * @param requestBody
     * @returns TaskResponse OK
     * @throws ApiError
     */
    public static updateTask(
        id: number,
        requestBody: UpdateTaskRequest,
    ): CancelablePromise<TaskResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/tasks/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id
     * @returns any OK
     * @throws ApiError
     */
    public static deleteTask(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/tasks/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param page
     * @param size
     * @param sort
     * @returns PagedResponseTaskResponse OK
     * @throws ApiError
     */
    public static getTasks(
        page?: number,
        size: number = 20,
        sort: string = 'createdAt,desc',
    ): CancelablePromise<PagedResponseTaskResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tasks',
            query: {
                'page': page,
                'size': size,
                'sort': sort,
            },
        });
    }
    /**
     * @param requestBody
     * @returns TaskResponse OK
     * @throws ApiError
     */
    public static createTask(
        requestBody: TaskRequest,
    ): CancelablePromise<TaskResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/tasks',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @returns TaskResponse OK
     * @throws ApiError
     */
    public static getPrioritized(): CancelablePromise<Array<TaskResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tasks/prioritized',
        });
    }
}
