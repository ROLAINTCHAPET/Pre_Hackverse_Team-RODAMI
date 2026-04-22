/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaskResponse = {
    id?: number;
    title?: string;
    description?: string;
    priority?: TaskResponse.priority;
    status?: TaskResponse.status;
    deadline?: string;
    createdAt?: string;
    priorityScore?: number;
};
export namespace TaskResponse {
    export enum priority {
        HIGH = 'HIGH',
        MEDIUM = 'MEDIUM',
        LOW = 'LOW',
    }
    export enum status {
        TODO = 'TODO',
        IN_PROGRESS = 'IN_PROGRESS',
        DONE = 'DONE',
    }
}

