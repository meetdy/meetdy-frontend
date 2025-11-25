export interface IColor {
    _id: string;
    name: string;
    code: string;
}

export interface IClassify {
    _id: string;
    name: string;
    conversationIds: Array<string>;
    color: IColor;
}

export interface IAddClassify {
    name: string;
    colorId: string;
}
