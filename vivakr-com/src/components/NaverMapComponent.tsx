"use client";

import { IPosData } from '@/interfaces/i-pos-data';
import React, { JSX, useCallback, useEffect, useRef } from 'react';

interface AddressInfo {
    lat: number;
    lng: number;
    jibunAddress?: string;
    roadAddress?: string;
}

interface NaverMapComponentProps {
    params: IPosData;
    onAddressUpdate: (addressInfo: AddressInfo | null) => void; // 부모로 주소 정보 전달
}

export default function NaverMapComponent({ params, onAddressUpdate }: NaverMapComponentProps): JSX.Element {
    const { latitude, longitude }: IPosData = params;
    const mapElement = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<naver.maps.Map | null>(null);
    const markerRef = useRef<naver.maps.Marker | null>(null);

    const searchCoordinateToAddress = useCallback(
        (coord: naver.maps.Coord) => {
            const map = mapInstanceRef.current;
            if (!map) {
                console.warn("Map not initialized yet.");
                return;
            }

            naver.maps.Service.reverseGeocode(
                {
                    coords: coord,
                    orders: [
                        naver.maps.Service.OrderType.ROAD_ADDR,
                        naver.maps.Service.OrderType.ADDR,
                    ].join(','),
                },
                (status, response) => {
                    if (status !== naver.maps.Service.Status.OK) {
                        console.error('ReverseGeocode Error:', status);
                        onAddressUpdate(null); // 에러 시 null 전달
                        return;
                    }

                    const result = response.v2;
                    const address = result.address;
                    const addressInfo: AddressInfo = {
                        lat: (coord as naver.maps.LatLng).lat(),
                        lng: (coord as naver.maps.LatLng).lng(),
                        jibunAddress: address?.jibunAddress,
                        roadAddress: address?.roadAddress,
                    };

                    onAddressUpdate(addressInfo); // 부모로 주소 정보 전달
                }
            );
        },
        [onAddressUpdate]
    );

    useEffect(() => {
        if (typeof window !== "undefined" && window.naver && window.naver.maps) {
            if (!mapElement.current) {
                console.error("Map container element not found.");
                return;
            }

            const lat = Number(latitude);
            const lng = Number(longitude);
            if (isNaN(lat) || isNaN(lng)) {
                console.error("Invalid latitude or longitude:", latitude, longitude);
                return;
            }

            const initialLocation = new window.naver.maps.LatLng(lat, lng);
            const mapOptions: naver.maps.NaverMapOptions = {
                center: initialLocation,
                zoom: 15,
                zoomControl: true,
            };

            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
            }

            mapInstanceRef.current = new window.naver.maps.Map(mapElement.current, mapOptions);
            const map = mapInstanceRef.current;

            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
            markerRef.current = new window.naver.maps.Marker({
                position: initialLocation,
                map,
            });

            const listeners: naver.maps.MapEventListener[] = [];

            listeners.push(
                naver.maps.Event.addListener(map, 'click', (e: naver.maps.PointerEvent) => {
                    searchCoordinateToAddress(e.coord);

                    // 클릭한 위치에 마커 이동
                    if (markerRef.current) {
                        markerRef.current.setPosition(e.coord);
                        markerRef.current.setMap(map);
                    }
                })
            );

            return () => {
                listeners.forEach(listener => naver.maps.Event.removeListener(listener));
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.destroy();
                    mapInstanceRef.current = null;
                }
                markerRef.current = null;
            };
        } else {
            console.warn("네이버 스크립트 로드가 되지 않았습니다.");
        }
    }, [latitude, longitude, searchCoordinateToAddress]);

    return (
        <div
            ref={mapElement}
            className='border-8 rounded-2xl border-slate-400'
            style={{ width: '100%', margin: 0, height: 'calc((100vh * 2) / 3)', backgroundColor: '#eee', overflow: 'hidden' }}
        />
    );
}
