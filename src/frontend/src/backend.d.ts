import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    sender: Principal;
    timestamp: bigint;
}
export interface UserProfile {
    username: string;
    messages: Array<Message>;
    userID: Principal;
}
export interface backendInterface {
    clearMessages(): Promise<void>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getFamilyMemberList(): Promise<Array<UserProfile>>;
    getMessages(): Promise<Array<Message>>;
    getUserProfile(): Promise<UserProfile>;
    registerUser(username: string): Promise<void>;
    sendMessage(recipientID: Principal, content: string, timestamp: bigint): Promise<void>;
}
