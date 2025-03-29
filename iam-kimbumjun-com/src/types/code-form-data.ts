export type CodeData = {
    id: number; // id
    title: string; // title
    subTitle: string; // sub_title
    content: string; // content
    subContent: string; // sub_content
    markdown: string; // markdown
    note?: string; //note
    categoryId: number; // category_id
    created?: Date; // DataType.Date
    modified?: Date; // DataType.DateTime
    userId?: string; // user_id
    userName?: string; // user_name
    myIp?: string; // myip
    attachFileName?: string; // attach_file_name
    attachImageName?: string; // attach_image_name
}
