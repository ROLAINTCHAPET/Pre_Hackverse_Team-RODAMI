/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type TaskRequest = {
    title: string;
    description?: string;
    priority?: TaskRequest.priority;
    deadline?: string;
};
export namespace TaskRequest {
    export enum priority {
        HIGH = 'HIGH',
        MEDIUM = 'MEDIUM',
        LOW = 'LOW',
    }
}

