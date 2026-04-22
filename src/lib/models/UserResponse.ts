/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AchievementResponse } from './AchievementResponse';
export type UserResponse = {
    id?: number;
    username?: string;
    email?: string;
    totalPoints?: number;
    level?: number;
    levelTitle?: string;
    badges?: Array<AchievementResponse>;
};

