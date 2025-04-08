export interface IResponse {
    responseStatus: ResponseStatus;
    responseMessage: string;
    responseData: any;
}

export interface IResponseDTO {
    responseStatus: ResponseCode;
    responseMessage: string;
    responseData?: any;
}

export enum ResponseStatus {
    NoetSet = 0,
    OK = 1,
    Error = 2
}


export enum ResponseCode {
    OK = 'OK',
    Error = 'Error'
}
