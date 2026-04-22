/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateTaskRequest = {
    title?: string;
    description?: string;
    priority?: UpdateTaskRequest.priority;
    status?: UpdateTaskRequest.status;
};
export namespace UpdateTaskRequest {
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

