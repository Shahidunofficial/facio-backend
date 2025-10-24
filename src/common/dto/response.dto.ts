export class ApiResponseDto<T> {
  message: string;
  data: T | null;
  error: string | null;

  constructor(message: string, data: T | null = null, error: string | null = null) {
    this.message = message;
    this.data = data;
    this.error = error;
  }

  static success<T>(data: T, message = 'Success'): ApiResponseDto<T> {
    return new ApiResponseDto(message, data, null);
  }

  static error(error: string, message = 'Error'): ApiResponseDto<null> {
    return new ApiResponseDto(message, null, error);
  }
}

