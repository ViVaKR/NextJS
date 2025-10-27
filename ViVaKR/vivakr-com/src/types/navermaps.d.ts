// types/navermaps.d.ts
// 수정: NaverMapOptions와 NaverMarkerOptions를 namespace 안으로 이동

// naver.maps 네임스페이스 및 주요 클래스/타입 선언
declare namespace naver.maps {

    // --- 인터페이스 정의를 네임스페이스 안으로 이동 ---
    interface NaverMapOptions {
        center: Coord | CoordLiteral; // 네임스페이스 내부 타입 사용
        zoom?: number;
        // 필요한 다른 지도 옵션들...
        [key: string]: any; // 다른 옵션 허용
    }

    interface NaverMarkerOptions {
        position: Coord | CoordLiteral; // 네임스페이스 내부 타입 사용
        map: Map; // 네임스페이스 내부 타입 사용
        // 필요한 다른 마커 옵션들...
        [key: string]: any; // 다른 옵션 허용
    }
    // --- 인터페이스 정의 이동 완료 ---

    type Coord = LatLng; // LatLng 클래스가 좌표 역할을 함
    type CoordLiteral = { lat: number; lng: number }; // 객체 리터럴 형태 좌표

    class LatLng {
        constructor(lat: number, lng: number);
        lat(): number;
        lng(): number;
    }

    class Map {
        // 이제 네임스페이스 내부에 정의된 NaverMapOptions를 참조합니다.
        constructor(mapDiv: string | HTMLElement, mapOptions?: NaverMapOptions);
        // 필요한 Map 메서드들 (예: setCenter, setZoom, destroy 등)
    }

    class Marker {
        // 이제 네임스페이스 내부에 정의된 NaverMarkerOptions를 참조합니다.
        constructor(options: NaverMarkerOptions);
        // 필요한 Marker 메서드들 (예: setPosition, setMap 등)
    }

    // (선택) Geocoding/Reverse Geocoding을 위한 타입 정의 추가
    type ServiceStatus = { OK: number; ERROR: number; /* ... 등 */ }; // 실제 상태 코드 확인 필요
    interface GeocodeCallback { (status: number, response: any): void; } // response 타입 구체화 가능
    interface ReverseGeocodeCallback { (status: number, response: any): void; } // response 타입 구체화 가능

    namespace Service {
        function geocode(options: { query: string; coordinate?: string | Coord | CoordLiteral; filter?: string; }, callback: GeocodeCallback): void;
        function reverseGeocode(options: { coords: string | Coord | CoordLiteral; orders?: string; output?: string; }, callback: ReverseGeocodeCallback): void;
    }

    // 필요한 다른 Naver Maps 타입들 (Event, Size, Point 등)
    interface PointerEvent {
        coord: Coord;
        point: Point;
        offset: Point;
        domEvent: MouseEvent;
    }

    class Point {
        constructor(x: number, y: number);
        x: number;
        y: number;
    }
}

// 전역 window 객체에 naver 속성 추가
interface Window {
    naver?: {
        maps: typeof naver.maps; // naver.maps 네임스페이스 자체를 타입으로 참조
    };
}
