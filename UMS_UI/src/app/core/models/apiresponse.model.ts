export interface ApiResponseDTO<T> {
    success: boolean,
    role?: string,
    token?: T,
    id?: number
}