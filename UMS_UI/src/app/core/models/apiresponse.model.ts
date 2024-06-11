export interface ApiResponseDTO<T> {
    success: boolean,
    role: string,
    message: string,
    token: T,
    id: number
}