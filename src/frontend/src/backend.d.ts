import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Habit {
    id: string;
    effectiveness: bigint;
    isCritical: boolean;
    ease: bigint;
    name: string;
    createdAt: Time;
    affordability: bigint;
    anecdotes: string;
    description: string;
    totalScore: bigint;
    updatedAt: Time;
    category: Category;
}
export interface GalleryAddImageResponse {
    id: string;
    blob?: ExternalBlob;
    message?: string;
    success: boolean;
}
export enum Category {
    performance = "performance",
    aesthetics = "aesthetics"
}
export interface backendInterface {
    /**
     * / Photo Gallery Management
     */
    addGalleryImage(id: string, blob: ExternalBlob): Promise<GalleryAddImageResponse>;
    addHabit(id: string, category: Category, name: string, description: string, ease: bigint, effectiveness: bigint, affordability: bigint, anecdotes: string, isCritical: boolean): Promise<Habit>;
    deleteHabit(id: string): Promise<void>;
    editHabit(id: string, category: Category, name: string, description: string, ease: bigint, effectiveness: bigint, affordability: bigint, anecdotes: string, isCritical: boolean): Promise<Habit>;
    getAllHabits(): Promise<Array<Habit>>;
    getGalleryImage(id: string): Promise<ExternalBlob>;
    getGalleryImages(): Promise<Array<[string, ExternalBlob]>>;
    getHabit(id: string): Promise<Habit>;
    getHabitsByCategory(category: Category): Promise<Array<Habit>>;
    getHeaderTitle(): Promise<string>;
    removeGalleryImage(id: string): Promise<void>;
    updateHeaderTitle(newTitle: string): Promise<void>;
}
