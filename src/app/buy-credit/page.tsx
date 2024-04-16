import React from 'react';
import BuyCreditScreen from '@/containers/BuyCredit/BuyCreditScreen';
import MobileNavigatorMenu from '@/components/Menu/MobileNavigatorMenu';
import PurchaseHistoryScreen from '@/containers/PurchaseHistory/PurchaseHistoryScreen';
import RedirectHeader from '@/components/RedirectHeader';
import { getServerAuthSession } from '@/lib/nextauthOptions';
import { redirect } from 'next/navigation';

interface PageProps {}

async function Page({}: PageProps) {
	const session = await getServerAuthSession();
	if (!session) {
		return redirect('/');
	}
	return (
		<>
			<MobileNavigatorMenu isShow={true} />
			<RedirectHeader redirectUrl={'/profile'} title={'Nạp tiền'} />
			<BuyCreditScreen />
		</>
	);
}

export default Page;
