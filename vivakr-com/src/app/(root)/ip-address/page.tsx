// src/app/dtc/ip-address/page.tsx
import VivTitle from '@/components/VivTitle';
import { IIpInfo } from '@/interfaces/i-ip-info';
import React from 'react';
import FormSection from './FormSection';

const api = process.env.NEXT_PUBLIC_IPINFO_URL2;
async function getInfo(): Promise<IIpInfo> {
  const response = await fetch(`${api}/api/ip`);
  const data: IIpInfo = await response.json();
  return data;
}

const Page = async () => {
  const ipInfo = await getInfo();

  return (
    <>
      <VivTitle title="IP Address Info" />
      <FormSection ipInfo={ipInfo} />
    </>
  );
};
export default Page;
