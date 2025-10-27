export interface ICodeQueryParameters {
    page: number; // 요청 페이지 번호
    pageSize: number; // 페이지당 아이템수
    sortField?: string; // 정렬할 필드
    sortOrder: string; // 정렬 순서 (asc, desc)
    categoryId?: number; // 필터링할 카테고리 ID
    searchTerm?: string; // 검색어 (제목, 부제목, 등 검색용)
    userId?: string; // 회원 아이디

}
