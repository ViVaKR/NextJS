// src/types/navermaps-augmentation.d.ts

// 기존 'navermaps' 모듈의 타입 정의를 가져와서 확장함을 명시
import 'navermaps';

declare global { // 전역 네임스페이스 naver.maps를 확장
    namespace naver.maps {
        // Marker 인터페이스(클래스)에 메소드 추가/수정
        interface Marker {
            setMap(map: Map | null): void;
            setPosition(latlng: Coord | CoordLiteral): void;
            getMap(): Map | null;
            getPosition(): Coord;
            // 필요하다면 다른 누락된 메소드/속성도 추가
        }

        // InfoWindow 인터페이스(클래스)에 메소드 추가/수정
        interface InfoWindow {
            setContent(content: string | Node): void;
            open(map: Map, anchor: Coord | Marker): void;
            close(): void;
            getMap(): Map | null;
            getPosition(): Coord;
            // 필요하다면 다른 누락된 메소드/속성도 추가
        }

        // 필요하다면 다른 클래스(Map, Service 등)의 타입도 확장 가능
    }
}

// 이 파일이 모듈임을 TypeScript에게 알리기 위한 빈 export (필수)
export { };
