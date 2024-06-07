export interface ApiResponseDTO<T> {
    success: boolean,
    message: string,
    token: T
}