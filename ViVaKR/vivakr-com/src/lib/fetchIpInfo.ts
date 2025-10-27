import { IIpInfo } from "@/interfaces/i-ip-info";

const api = process.env.NEXT_PUBLIC_IPINFO_URL2;

export const getIpInfomations = async (): Promise<IIpInfo> => {

    const response = await fetch(`${api}/api/ip`);
    const data: IIpInfo | null = await response.json();
    return data ?? {
        ip: '0.0.0.0',
        city: '-',
        region: '-',
        country: '-',
        isp: '-'
    };
}
